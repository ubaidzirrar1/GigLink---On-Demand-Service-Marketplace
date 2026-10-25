
import React, { useState } from 'react';
import { UserRole, Job } from '../types';
import ReviewForm from './ReviewForm';

interface ClientDashboardProps {
  role?: UserRole;
  isVerified?: boolean;
  jobs: Job[];
  onCancelJob: (jobId: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ role = UserRole.CLIENT, isVerified = false, jobs, onCancelJob }) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING' | 'COMPLETED'>('ACTIVE');
  const [showReview, setShowReview] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const filteredJobs = jobs.filter(job => job.status === activeTab);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-600 text-white shadow-md shadow-blue-100 ring-2 ring-blue-100';
      case 'PENDING':
        return 'bg-amber-500 text-white shadow-md shadow-amber-100 ring-2 ring-amber-100';
      case 'COMPLETED':
        return 'bg-emerald-500 text-white shadow-md shadow-emerald-100 ring-2 ring-emerald-100';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  const handleDeleteJob = () => {
    if (jobToDelete) {
      onCancelJob(jobToDelete.id);
      setJobToDelete(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full space-y-4 relative">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          <span className="font-bold text-sm">Job post canceled successfully</span>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-800 px-1">
        {role === UserRole.CLIENT ? 'My Posted Jobs' : 'My Active Gigs'}
      </h2>
      
      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        {(['ACTIVE', 'PENDING', 'COMPLETED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">
                    {job.category}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{job.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <div className="text-xl font-black text-slate-900">${job.budget}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{job.date}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-4">
                <div className="flex items-center -space-x-2.5">
                   {[1, 2, 3].map(i => (
                     <img key={i} src={`https://picsum.photos/seed/${job.id}${i}/100`} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt="Worker Avatar" />
                   ))}
                   <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 shadow-sm">
                     +2
                   </div>
                   <span className="ml-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">Active Bids</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {role === UserRole.CLIENT && job.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => setJobToDelete(job)}
                      className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors active:scale-95"
                      title="Cancel Job Post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  )}

                  {job.status === 'COMPLETED' ? (
                    <button 
                      onClick={() => setShowReview(true)}
                      className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                    >
                      Rate Now
                    </button>
                  ) : (
                    <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors active:scale-95 shadow-lg shadow-slate-100">
                      {role === UserRole.CLIENT ? 'Manage' : 'Details'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] border border-slate-50 shadow-sm mx-2">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">📭</div>
            <h3 className="text-lg font-bold text-slate-800">No {activeTab.toLowerCase()} jobs</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-[240px] leading-relaxed">Your dashboard is clear. New jobs you post or accept will appear here.</p>
          </div>
        )}
      </div>

      {showReview && <ReviewForm onClose={() => setShowReview(false)} />}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Cancel Job Post?</h2>
            <p className="text-sm font-medium text-slate-400 mb-8 px-4 leading-relaxed">
              Are you sure you want to cancel <span className="text-slate-900 font-bold">"{jobToDelete.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleDeleteJob}
                className="w-full py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition-all"
              >
                Yes, Cancel Post
              </button>
              <button 
                onClick={() => setJobToDelete(null)}
                className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
