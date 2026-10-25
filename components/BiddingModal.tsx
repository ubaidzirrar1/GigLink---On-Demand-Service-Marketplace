
import React, { useState } from 'react';
import { Job } from '../types';

interface BiddingModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: () => void;
}

const BiddingModal: React.FC<BiddingModalProps> = ({ job, onClose, onSubmit }) => {
  const [offer, setOffer] = useState(job.budget.toString());
  const [message, setMessage] = useState('');
  const [arrivalTime, setArrivalTime] = useState('30 mins');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-end justify-center px-4 pb-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 animate-in slide-in-from-bottom duration-300 pb-safe shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 relative z-10"></div>
        
        <div className="relative z-10 mb-8">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 w-max px-2 py-1 rounded-md mb-2">
            <span>Official Application</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Apply for this Job</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">{job.title}</p>
        </div>

        <div className="space-y-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Bid Amount</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300 group-focus-within:text-indigo-600 transition-colors">$</span>
              <input 
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full pl-14 pr-6 py-6 rounded-3xl bg-slate-50 border-2 border-slate-50 text-4xl font-black text-indigo-600 focus:outline-none focus:border-indigo-500 transition-all focus:bg-white shadow-inner"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1 uppercase">Client budget: ${job.budget}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cover Letter</label>
            <textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all focus:bg-white shadow-inner resize-none"
              placeholder="Hi! I'm an expert in this field and can help you right away..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Estimated Arrival</label>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-50">
              {['15m', '30m', '1h', 'Later'].map(t => (
                <button
                  key={t}
                  onClick={() => setArrivalTime(t)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all duration-300 ${
                    arrivalTime === t 
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex space-x-4 relative z-10">
          <button 
            onClick={onClose}
            className="flex-1 py-5 text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSubmit}
            className="flex-[2.5] bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-200 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiddingModal;
