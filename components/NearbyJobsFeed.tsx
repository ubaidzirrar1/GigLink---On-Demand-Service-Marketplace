
import React, { useState } from 'react';
import { MOCK_NEARBY_JOBS } from '../constants';
import BiddingModal from './BiddingModal';

const NearbyJobsFeed: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-800">Nearby Jobs</h2>
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          <span>San Francisco</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_NEARBY_JOBS.map(job => (
          <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{job.category}</span>
                <h3 className="font-bold text-slate-800 mt-2 text-lg leading-tight">{job.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900">${job.budget}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Fixed Price</div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-600">
                  <span className="text-red-500">📍</span>
                  <span>{job.distance}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>{job.date}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                 <button 
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <BiddingModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onSubmit={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default NearbyJobsFeed;
