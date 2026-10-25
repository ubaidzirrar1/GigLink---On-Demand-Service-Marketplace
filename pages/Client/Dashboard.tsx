
import React from 'react';
import { Job } from '../../types';

interface Props {
  jobs: Job[];
  onCancelJob: (id: string) => void;
}

const Dashboard: React.FC<Props> = ({ jobs, onCancelJob }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active',
          bg: 'bg-indigo-50 dark:bg-indigo-900/30',
          text: 'text-indigo-600 dark:text-indigo-400',
          dot: 'bg-indigo-500'
        };
      case 'PENDING':
        return {
          label: 'Pending',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          text: 'text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500'
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-50 dark:bg-slate-800',
          text: 'text-slate-600 dark:text-slate-400',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-24 max-w-5xl mx-auto text-[#F4F7FC]">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">My Gigs & Requests</h2>
        <p className="text-xs text-[#8EA1BE] mt-1">Manage your active service requests and past projects</p>
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? jobs.map((job, index) => {
          const status = getStatusConfig(job.status);
          return (
            <div 
              key={job.id} 
              className="bg-[#0D1E34] rounded-2xl p-6 border border-[#1E3557] shadow-lg transition-all hover:border-[#2878FF]/40 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1 mr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                      #{job.category}
                    </span>
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
                      <span>{status.label}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate leading-snug">{job.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-slate-900 dark:text-white">${job.budget}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{job.date}</div>
                </div>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 line-clamp-2 leading-relaxed font-medium">
                {job.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=bid${job.id}${i}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500 shadow-sm">
                    +2
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {job.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => onCancelJob(job.id)} 
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-90"
                      title="Cancel Project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  )}
                  <button className="bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm mx-2 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">📦</div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">No projects yet</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-[240px] leading-relaxed font-medium">Your project list is empty. Post a new job to find experts near you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
