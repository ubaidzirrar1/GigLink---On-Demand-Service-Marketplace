
import React, { useState, useRef } from 'react';
import { Worker } from '../types';
import PortfolioModal from './PortfolioModal';
import EditProfileModal from './EditProfileModal';
import { getWorkerLevel } from '../lib/workerUtils';
import { reverseGeocode } from '../lib/geoUtils';

interface WorkerProfileProps {
  worker: Worker;
  onSwitchRole?: () => void;
  onContact?: () => void;
  onApply?: () => void;
  onSaveProfile?: (updated: Worker) => void;
  onBack?: () => void;
  isOwnProfile?: boolean;
}

const WorkerProfile: React.FC<WorkerProfileProps> = ({ 
  worker, 
  onSwitchRole, 
  onContact, 
  onApply,
  onSaveProfile,
  onBack,
  isOwnProfile = false
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const level = getWorkerLevel(worker);

  const handleSaveProfile = (updatedWorker: Worker) => {
    if (onSaveProfile) {
      onSaveProfile(updatedWorker);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRefreshLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOwnProfile || isRefreshingLocation) return;

    if (navigator.geolocation) {
      setIsRefreshingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const addr = await reverseGeocode(lat, lng);
            const updated = {
              ...worker,
              location: { lat, lng },
              formattedAddress: addr.short
            };
            handleSaveProfile(updated);
            setIsRefreshingLocation(false);
          } catch (error) {
            setIsRefreshingLocation(false);
            console.error("Location update failed", error);
          }
        },
        () => {
          setIsRefreshingLocation(false);
          alert("Location refresh failed. Please enable GPS.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];
    const filesArray = Array.from(files);
    
    let processedCount = 0;
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processedCount++;
        if (processedCount === filesArray.length) {
          const updated = {
            ...worker,
            portfolio: [...(worker.portfolio || []), ...newImages]
          };
          handleSaveProfile(updated);
          setIsUploading(false);
          if (portfolioInputRef.current) portfolioInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePortfolioItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!isOwnProfile) return;
    
    if (window.confirm('Are you sure you want to remove this item from your portfolio?')) {
      const updatedPortfolio = worker.portfolio?.filter((_, i) => i !== index) || [];
      const updated = {
        ...worker,
        portfolio: updatedPortfolio
      };
      handleSaveProfile(updated);
    }
  };

  const getProgress = () => {
    if (!level.nextTier) return 100;
    const current = worker.completedProjects;
    const needed = level.nextTier.projectsNeeded;
    const prev = level.minProjects;
    return Math.min(100, Math.max(0, ((current - prev) / (needed - prev)) * 100));
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-32 overflow-hidden bg-[#071426] text-[#F4F7FC]">
      {saveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[130] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          <span className="font-bold text-sm">Updated successfully!</span>
        </div>
      )}

      <div className="bg-[#0B1B31] border-b border-[#1E3557] p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-[#10223A] rounded-xl transition-all cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-white">{isOwnProfile ? 'My Professional Profile' : 'Professional Profile'}</h2>
          </div>
        </div>

        <div className="flex items-start space-x-6 mb-8">
          <div className="relative group shrink-0">
            <img src={worker.avatar} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-105 duration-300" alt={worker.name} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight truncate">{worker.name}</h2>
                </div>
                
                {/* Interactive location pill */}
                {(isOwnProfile || worker.formattedAddress) && (
                  <button 
                    onClick={handleRefreshLocation}
                    className={`flex items-center space-x-1.5 mt-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 w-max px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-inner transition-all group ${isRefreshingLocation ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
                    title={isOwnProfile ? "Click to update current location" : ""}
                    disabled={!isOwnProfile || isRefreshingLocation}
                  >
                    <span className={`text-red-500 text-[10px] ${isRefreshingLocation ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`}>📍</span>
                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">
                      {isRefreshingLocation ? 'Locating...' : (worker.formattedAddress || (isOwnProfile ? 'Set Work Area' : 'Location Not Set'))}
                    </span>
                    {isOwnProfile && !isRefreshingLocation && (
                      <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-500 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    )}
                  </button>
                )}

                <div className="flex items-center space-x-2 mt-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest text-white ${level.color}`}>
                    {level.name}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-black text-slate-900 dark:text-white">${worker.hourlyRate}<span className="text-[10px] text-slate-400 font-bold uppercase ml-1">/hr</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0D1E34] p-6 rounded-[28px] border border-[#1E3557] mb-8 space-y-4 shadow-xl">
           <div className="flex justify-between items-center mb-1">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress to {level.nextTier?.name || 'Top Tier'}</div>
             <div className="text-[10px] font-bold text-[#2878FF] uppercase tracking-widest">{Math.round(getProgress())}%</div>
           </div>
           <div className="w-full h-2.5 bg-[#071426] rounded-full overflow-hidden border border-[#1E3557]">
             <div 
              className={`h-full ${level.color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(40,120,255,0.4)]`} 
              style={{ width: `${getProgress()}%` }}
             ></div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-xs font-black text-white">{worker.completedProjects} / {level.nextTier?.projectsNeeded || level.minProjects}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Projects Completed</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-white">{worker.rating} / {level.nextTier?.ratingNeeded || level.minRating}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Required Rating</div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl bg-[#2878FF] hover:bg-blue-600 text-white font-bold text-sm active:scale-95 transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Edit Profile</span>
              </button>
              <button 
                onClick={onSwitchRole}
                className="flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl border border-[#1E3557] text-white font-bold text-sm active:scale-95 transition-all bg-[#10223A] hover:bg-[#162A45] shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                <span>Switch Mode</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onApply}
                className="flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl bg-[#2878FF] hover:bg-blue-600 text-white font-bold text-sm active:scale-95 transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
              >
                <span>Book Service Now</span>
              </button>
              <button 
                onClick={onContact}
                className="flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl border border-[#1E3557] text-white font-bold text-sm active:scale-95 transition-all bg-[#10223A] hover:bg-[#162A45] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                <span>Chat with Pro</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8 mt-2 bg-[#071426] border-t border-[#1E3557]">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Professional Bio</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {worker.bio || "No bio provided yet."}
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Skills & Tools</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.length ? worker.skills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                {skill}
              </span>
            )) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
            )}
          </div>
        </section>

        {/* Portfolio Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recent Portfolio</h3>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{(worker.portfolio?.length || 0)} Items</span>
              {isOwnProfile && (
                <button 
                  onClick={() => portfolioInputRef.current?.click()}
                  className="bg-indigo-600 text-white p-2 rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                  disabled={isUploading}
                >
                  <svg className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                  </svg>
                  <input 
                    type="file" 
                    ref={portfolioInputRef} 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={handlePortfolioUpload} 
                  />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {worker.portfolio?.map((img, idx) => (
              <div 
                key={idx} 
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group border border-slate-100 dark:border-slate-800 active:scale-95 transition-all"
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={`Portfolio ${idx}`} 
                  onClick={() => setSelectedImageIndex(idx)}
                />
                <div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                {isOwnProfile && (
                  <button 
                    onClick={(e) => handleDeletePortfolioItem(e, idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {isOwnProfile && (worker.portfolio?.length || 0) < 6 && (
              <button 
                onClick={() => portfolioInputRef.current?.click()}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-300 transition-all text-slate-400 group"
              >
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Add Item</span>
              </button>
            )}
          </div>
          
          {(!worker.portfolio || worker.portfolio.length === 0) && !isOwnProfile && (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">No portfolio items listed yet.</p>
          )}
        </section>
      </div>

      {selectedImageIndex !== null && worker.portfolio && (
        <PortfolioModal 
          imageUrl={worker.portfolio[selectedImageIndex]} 
          onClose={() => setSelectedImageIndex(null)}
          totalCount={worker.portfolio.length}
          currentIndex={selectedImageIndex}
          onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % worker.portfolio!.length)}
          onPrev={() => setSelectedImageIndex((selectedImageIndex - 1 + worker.portfolio!.length) % worker.portfolio!.length)}
        />
      )}

      {showEditModal && (
        <EditProfileModal 
          worker={worker} 
          onClose={() => setShowEditModal(false)} 
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default WorkerProfile;
