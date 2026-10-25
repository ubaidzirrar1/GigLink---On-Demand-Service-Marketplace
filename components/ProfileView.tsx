
import React, { useState } from 'react';
import { UserRole, Worker } from '../types';
import WorkerProfile from './WorkerProfile';
import { reverseGeocode } from '../lib/geoUtils';

interface ProfileViewProps {
  role: UserRole;
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSwitchRole: () => void;
  userProfile: Worker;
  onUpdateProfile: (updated: Worker) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ role, isLoggedIn, onSignIn, onSwitchRole, userProfile, onUpdateProfile }) => {
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRefreshLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshingLocation) return;

    if (navigator.geolocation) {
      setIsRefreshingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const addr = await reverseGeocode(lat, lng);
            const updated = {
              ...userProfile,
              location: { lat, lng },
              formattedAddress: addr.short
            };
            onUpdateProfile(updated);
            
            // Success Feedback
            setIsRefreshingLocation(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
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
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner shadow-indigo-100/50">
          👤
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Join GigLink</h2>
        <p className="text-slate-400 font-medium mt-4 max-w-xs mx-auto leading-relaxed">
          Create an account to post jobs, message workers, and manage your bookings all in one place.
        </p>
        
        <div className="w-full max-w-xs mt-12 space-y-4">
          <button 
            onClick={onSignIn}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-none active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (role === UserRole.WORKER) {
    return (
      <WorkerProfile 
        worker={userProfile} 
        onSwitchRole={onSwitchRole} 
        onSaveProfile={onUpdateProfile}
        isOwnProfile 
      />
    );
  }

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20 relative">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[130] w-max max-w-[90%]">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span className="font-bold text-sm text-white">Location set successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-8 border-b border-slate-100 dark:border-slate-800 text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <img src={userProfile.avatar} className="relative w-28 h-28 rounded-[40px] object-cover shadow-2xl border-4 border-white dark:border-slate-800" alt="Profile" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{userProfile.name}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Client Elite Member</p>
        
        {/* Interactive location pill - Always Visible */}
        <div className="mt-6">
          <button 
            onClick={handleRefreshLocation}
            disabled={isRefreshingLocation}
            className={`flex items-center justify-center space-x-2.5 mx-auto px-6 py-3 rounded-2xl border transition-all group ${
              isRefreshingLocation 
              ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-70 cursor-wait' 
              : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-500 shadow-sm active:scale-95'
            }`}
          >
            <span className={`text-red-500 transition-transform ${isRefreshingLocation ? 'animate-bounce' : 'group-hover:scale-125 rotate-12'}`}>📍</span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
              {isRefreshingLocation ? 'Pulse Scanning...' : (userProfile.formattedAddress || 'Set Current Location')}
            </span>
            {!isRefreshingLocation && (
              <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex justify-center space-x-12 mt-10">
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{userProfile.completedProjects || 0}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Posted</div>
          </div>
          <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 self-center"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Reviews</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Account Control</h3>
           <div className="space-y-2">
              <ProfileItem icon="🔔" label="Notifications" />
              <ProfileItem icon="💳" label="Payments" />
              <ProfileItem icon="🛡️" label="Safety Center" />
              <div className="pt-6">
                <button 
                  onClick={onSwitchRole}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 transition-all"
                >
                  <span>Switch to Worker Profile</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

const ProfileItem: React.FC<{icon: string, label: string}> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group">
    <div className="flex items-center space-x-4">
      <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
    </div>
    <svg className="w-5 h-5 text-slate-200 dark:text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
  </button>
);

export default ProfileView;
