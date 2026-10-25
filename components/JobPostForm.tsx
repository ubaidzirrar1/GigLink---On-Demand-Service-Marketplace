
import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../constants';
import LocationPicker from './LocationPicker';
import CategoryIcon from './CategoryIcon';

interface JobPostFormProps {
  onCancel: () => void;
  onSubmit: (jobData: any) => void;
  isVerified?: boolean;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ onCancel, onSubmit, isVerified = false }) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    budget: '',
    timeframe: 'Urgent',
    location: null as any,
    images: [] as string[]
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!isVerified) {
      alert("Please verify your email to post jobs.");
      return;
    }
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 flex flex-col h-full overflow-hidden">
            <div className="shrink-0">
              <h3 className="text-xl font-bold text-slate-800">What service do you need?</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Select a category to automatically route your project to relevant experts.</p>
              {!isVerified && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold leading-relaxed mb-4">
                    ⚠️ Registration complete, but email verification is mandatory before you can officially publish a job.
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar pb-10">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFormData({ ...formData, category: cat.name });
                    nextStep();
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 group ${formData.category === cat.name ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400`}>
                    <CategoryIcon name={cat.name} size={26} className="text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center tracking-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Details about the job</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium" 
                  placeholder={`e.g. Need ${formData.category || 'help'} service`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium" 
                  placeholder="Tell us what needs to be done..."
                />
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-bold text-slate-600">Job Images</label>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{formData.images.length} / {MAX_IMAGES}</span>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload}
                />
                
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  
                  {formData.images.length < MAX_IMAGES && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                        formData.images.length > 0 
                          ? 'border-slate-200 bg-white hover:border-indigo-300 text-indigo-500' 
                          : 'border-slate-200 bg-slate-50 text-slate-400 py-8 col-span-3 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {formData.images.length > 0 ? 'Add More' : 'Add Photos'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Where and When?</h3>
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
               <LocationPicker onSelect={(loc) => setFormData({...formData, location: loc})} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['Urgent', 'Today', 'This Week'].map(t => (
                <button
                  key={t}
                  onClick={() => setFormData({...formData, timeframe: t})}
                  className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${formData.timeframe === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Budget Estimate</h3>
            <div className="flex items-center space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
              <span className="text-3xl font-bold text-slate-400">$</span>
              <input 
                type="number" 
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full text-4xl font-bold bg-transparent outline-none text-indigo-600" 
                placeholder="0.00"
              />
            </div>
            {!isVerified && (
               <div className="p-5 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-100 leading-relaxed shadow-sm">
                 🚫 You cannot publish this job until your email is verified. Please check your inbox or update your profile.
               </div>
            )}
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
               <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Routing Summary</h4>
               <p className="text-xs text-indigo-600 leading-relaxed">
                 Your project for <strong>{formData.title || 'Untitled'}</strong> will be instantly visible to all <strong>{formData.category}</strong> experts within your area.
               </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#071426] text-[#F4F7FC] z-[80] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="px-4 py-4 border-b border-[#1E3557] bg-[#0B1B31] flex items-center justify-between shrink-0">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white hover:bg-[#10223A] rounded-lg cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="flex space-x-1.5">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-8 h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#2878FF]' : 'bg-[#1E3557]'}`} />
          ))}
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
        {renderStep()}
      </div>

      <div className="p-4 border-t border-[#1E3557] bg-[#0B1B31] pb-safe shrink-0">
        <div className="flex space-x-3 max-w-lg mx-auto w-full">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="px-6 py-3.5 rounded-xl border border-[#1E3557] bg-[#10223A] text-slate-300 font-bold active:scale-95 transition-transform cursor-pointer"
            >
              Back
            </button>
          )}
          {step > 1 && (
            <button 
              onClick={step === 4 ? handleSubmit : nextStep}
              disabled={step === 4 && !isVerified}
              className={`flex-1 py-3.5 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all cursor-pointer ${
                step === 4 && !isVerified 
                  ? 'bg-[#10223A] text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-[#2878FF] hover:bg-blue-600 text-white shadow-blue-500/20'
              }`}
            >
              {step === 4 ? 'Publish Job' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;
