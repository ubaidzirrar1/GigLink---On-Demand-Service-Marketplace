
import React from 'react';
import { Job } from '../../types';

interface Props {
  job: Job | null;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const IncomingJobs: React.FC<Props> = ({ job, onAccept, onDecline }) => {
  if (!job) return (
    <div className="p-8 text-center mt-20">
      <div className="text-6xl mb-4">🛰️</div>
      <h3 className="text-xl font-black text-slate-900">Scanning for Gigs...</h3>
      <p className="text-slate-400 text-sm mt-2">New job posts in your area will appear here instantly.</p>
    </div>
  );

  return (
    <div className="p-4 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-[40px] p-8 border border-indigo-100 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse">Live Pulse</span>
          <div className="text-2xl font-black text-slate-900">${job.budget}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">{job.title}</h2>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed">{job.description}</p>
        <div className="flex items-center space-x-4 mt-6">
           <div className="flex items-center space-x-1 text-xs font-bold text-red-500">
             <span>📍</span>
             <span>{job.distance}</span>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button onClick={() => onDecline(job.id)} className="py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase">Ignore</button>
          <button onClick={() => onAccept(job.id)} className="py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase shadow-xl">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingJobs;
