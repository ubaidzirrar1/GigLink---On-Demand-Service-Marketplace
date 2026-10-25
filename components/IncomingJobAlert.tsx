
import React from 'react';
import { Job } from '../types';
import { CATEGORIES } from '../constants';
import CategoryIcon from './CategoryIcon';

interface IncomingJobAlertProps {
  job: Job;
  onAccept: (jobId: string) => void;
  onDecline: (jobId: string) => void;
}

const IncomingJobAlert: React.FC<IncomingJobAlertProps> = ({ job, onAccept, onDecline }) => {
  const category = CATEGORIES.find(c => c.name === job.category) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className="fixed inset-x-4 top-24 z-[100] animate-in slide-in-from-top-10 duration-500">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-indigo-100 relative overflow-hidden">
        {/* Animated pulse background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse"></div>
        
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-600 shadow-sm animate-bounce">
            <CategoryIcon name={job.category} size={28} className="text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                  New Order Nearby
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1 truncate leading-tight">
                  {job.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900">${job.budget}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Budget</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1.5 px-2 py-1 bg-red-50 rounded-lg text-xs font-bold text-red-600">
                <span className="text-sm">📍</span>
                <span>{job.distance || 'Near You'}</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Matching specialty</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
          {job.description || 'No detailed description provided by the client.'}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            onClick={() => onDecline(job.id)}
            className="py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
          >
            Decline
          </button>
          <button 
            onClick={() => onAccept(job.id)}
            className="py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 animate-pulse active:scale-95 transition-all"
          >
            Accept Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingJobAlert;
