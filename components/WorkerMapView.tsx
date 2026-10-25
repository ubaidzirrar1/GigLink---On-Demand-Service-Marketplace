
import React, { useEffect, useRef, useState } from 'react';
import { MOCK_NEARBY_JOBS } from '../constants';
import BiddingModal from './BiddingModal';

declare const L: any;

// Fixed: Define props interface to handle isVerified passed from App.tsx
interface WorkerMapViewProps {
  isVerified?: boolean;
}

const WorkerMapView: React.FC<WorkerMapViewProps> = ({ isVerified }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState(false);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false
      }).setView([37.78, -122.41], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(leafletMap.current);

      MOCK_NEARBY_JOBS.forEach(job => {
        if (job.location) {
          const marker = L.marker([job.location.lat, job.location.lng]).addTo(leafletMap.current);
          marker.on('click', () => {
            setSelectedJob(job);
          });
        }
      });
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full -mt-[60px]">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Bottom Sheet Detail */}
      {selectedJob && (
        <div className="absolute bottom-[80px] left-0 right-0 p-4 z-[45] animate-in slide-in-from-bottom duration-300">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800">{selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="p-1 text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">{selectedJob.budget}</div>
              <div className="text-xs text-slate-400 font-bold tracking-tight">{selectedJob.distance} away</div>
            </div>
            <p className="text-sm text-slate-500 mb-6">{selectedJob.description}</p>
            <button 
              onClick={() => setShowBidModal(true)}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {showBidModal && selectedJob && (
        <BiddingModal 
          job={selectedJob} 
          onClose={() => setShowBidModal(false)} 
          onSubmit={() => {
            setShowBidModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkerMapView;
