
import React, { useState, useRef } from 'react';
import { Worker } from '../types';
import { reverseGeocode } from '../lib/geoUtils';

interface EditProfileModalProps {
  worker: Worker;
  onClose: () => void;
  onSave: (updatedWorker: Worker) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ worker, onClose, onSave }) => {
  const [formData, setFormData] = useState<Worker>({ 
    ...worker,
    preferredRadius: worker.preferredRadius || 15
  });
  const [newSkill, setNewSkill] = useState('');
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshLocation = () => {
    if (navigator.geolocation) {
      setIsUpdatingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const addr = await reverseGeocode(lat, lng);
          setFormData({
            ...formData,
            location: { lat, lng },
            formattedAddress: addr.short // Use the shorter PK, District format
          });
          setIsUpdatingLocation(false);
        },
        () => {
          setIsUpdatingLocation(false);
          alert("Could not fetch current GPS location.");
        }
      );
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !formData.skills?.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), trimmed]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-end justify-center px-4 pb-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 animate-in slide-in-from-bottom duration-300 pb-safe shadow-2xl relative my-auto border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Edit Profile</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Keep your details up to date</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
          {/* Photo Selection */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img src={formData.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-50 shadow-lg" alt="Avatar" />
              <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              Choose New Photo
            </button>
          </div>

          <div className="space-y-5">
            {/* Location Management Section */}
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Current Location</label>
                <button 
                  onClick={refreshLocation}
                  disabled={isUpdatingLocation}
                  className="flex items-center space-x-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 disabled:opacity-50"
                >
                  <svg className={`w-3.5 h-3.5 ${isUpdatingLocation ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span>{isUpdatingLocation ? 'Locating...' : 'Refresh GPS'}</span>
                </button>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3">
                 <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">📍</div>
                 <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-900 truncate">
                      {formData.formattedAddress || 'Location Not Set'}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">Country Code, District</p>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-800 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hourly Rate ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                    className="w-full pl-8 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-indigo-600 shadow-inner"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Specialty</label>
                <div className="relative">
                  <select 
                    value={formData.specialties[0]}
                    onChange={(e) => setFormData({...formData, specialties: [e.target.value]})}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none shadow-inner"
                  >
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Construction">Construction</option>
                    <option value="Designing">Designing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Labor">General Labor</option>
                  </select>
                  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest">Job Alert Radius (km)</label>
                <span className="text-sm font-black text-indigo-700">{formData.preferredRadius} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                step="1"
                value={formData.preferredRadius}
                onChange={(e) => setFormData({...formData, preferredRadius: parseInt(e.target.value)})}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 leading-tight">Define your acceptable working radius to filter incoming job notifications.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">About Me (Bio)</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-600 text-sm leading-relaxed shadow-inner"
                placeholder="Describe your professional skills..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skills & Tools</label>
              <div className="flex space-x-2 mb-4">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(v) => setNewSkill(v.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm shadow-inner"
                  placeholder="Add a skill"
                />
                <button 
                  onClick={addSkill}
                  className="px-5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map(skill => (
                  <span key={skill} className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 text-indigo-700 text-[11px] font-black uppercase rounded-xl border border-indigo-100">
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-slate-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2.5] bg-indigo-600 text-white font-black py-4 rounded-3xl shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
