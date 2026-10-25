
import React, { useState, useEffect } from 'react';
import { UserRole, AppTab, Worker, Job } from './types';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './components/LandingPage';
import WorkerProfile from './components/WorkerProfile';

// Modular Page Imports
import ClientDashboard from './pages/Client/Dashboard';
import PostJob from './pages/Client/PostJob';
import NearbyWorkers from './pages/Client/NearbyWorkers';

import WorkerMap from './pages/Worker/WorkerMap';
import IncomingJobs from './pages/Worker/IncomingJobs';
import Availability from './pages/Worker/Availability';

import ProfileView from './features/Profile/ProfileView';
import SettingsView from './features/Settings/SettingsView';
import NotificationCenter from './components/NotificationCenter';
import ChatUI from './features/Chat/ChatUI';
import AuthUI from './pages/Auth/AuthUI';

import { getSession, saveSession, clearSession, getStoredJobs, saveJob, deleteJob, runMigrations } from './lib/storage';
import { MOCK_WORKERS } from './constants';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.HOME);
  const [showJobPost, setShowJobPost] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<Worker | null>(null);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [incomingJob, setIncomingJob] = useState<Job | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    runMigrations();
    const session = getSession();
    if (session) {
      setIsLoggedIn(session.isLoggedIn);
      setRole(session.role);
      setUserProfile(session.user);
    } else {
      // Default initial profile matching reference design
      setUserProfile({
        id: 'user_ubaid',
        name: 'Ubaid Ur Rahman',
        email: 'ubaid@giglink.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviews: 14,
        completedProjects: 18,
        isVerified: true,
        isEmailVerified: true,
        isAvailable: true,
        distance: '0 km',
        specialties: ['Client'],
        hourlyRate: 0,
        formattedAddress: 'Abbottabad, Pakistan',
      });
      setIsLoggedIn(true);
    }
    setUserJobs(getStoredJobs());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleUpdateProfile = (updated: Worker) => {
    setUserProfile(updated);
    if (isLoggedIn) saveSession({ isLoggedIn, role, isEmailVerified: updated.isEmailVerified, user: updated });
  };

  const handleViewWorker = (id: string) => {
    const worker = MOCK_WORKERS.find(w => w.id === id);
    if (worker) setSelectedWorker(worker);
  };

  const renderContent = () => {
    if (showJobPost) return <PostJob onCancel={() => setShowJobPost(false)} onSubmit={(j) => { saveJob(j); setShowJobPost(false); setUserJobs(getStoredJobs()); }} isVerified={userProfile?.isEmailVerified} />;

    if (selectedWorker) return (
      <WorkerProfile 
        worker={selectedWorker} 
        onBack={() => setSelectedWorker(null)}
        onContact={() => { setSelectedWorker(null); setCurrentTab(AppTab.CHAT); }}
        onApply={() => alert('Order inquiry sent to ' + selectedWorker.name)}
      />
    );

    switch (currentTab) {
      case AppTab.HOME: return <LandingPage onPostJob={() => setShowJobPost(true)} onViewWorker={handleViewWorker} onViewAllWorkers={() => setCurrentTab(AppTab.SEARCH)} />;
      case AppTab.SEARCH: 
        return role === UserRole.CLIENT 
          ? <NearbyWorkers onViewWorker={handleViewWorker} userLocation={userLocation} /> 
          : <WorkerMap isVerified={userProfile?.isEmailVerified} />;
      case AppTab.MY_JOBS: 
        return role === UserRole.CLIENT 
          ? <ClientDashboard jobs={userJobs} onCancelJob={(id) => { deleteJob(id); setUserJobs(getStoredJobs()); }} /> 
          : <IncomingJobs job={incomingJob} onAccept={() => {}} onDecline={() => setIncomingJob(null)} />;
      case AppTab.PROFILE: 
        if (!isLoggedIn) return <AuthUI onLoginSuccess={(r, v, u) => { setRole(r); setIsLoggedIn(true); handleUpdateProfile(u); setCurrentTab(AppTab.HOME); }} />;
        return <ProfileView role={role} isLoggedIn={isLoggedIn} userProfile={userProfile!} onUpdateProfile={handleUpdateProfile} onSignIn={() => {}} onSwitchRole={() => setRole(role === UserRole.CLIENT ? UserRole.WORKER : UserRole.CLIENT)} />;
      case AppTab.NOTIFICATIONS: return <NotificationCenter />;
      case AppTab.CHAT: return <ChatUI contactName="GigLink Support" />;
      case AppTab.SETTINGS: return <SettingsView user={userProfile!} role={role} onUpdate={handleUpdateProfile} />;
      default: return <LandingPage onPostJob={() => setShowJobPost(true)} onViewWorker={handleViewWorker} onViewAllWorkers={() => setCurrentTab(AppTab.SEARCH)} />;
    }
  };

  return (
    <MainLayout 
      currentTab={currentTab} 
      setCurrentTab={(tab) => { setSelectedWorker(null); setCurrentTab(tab); }} 
      role={role} 
      setRole={setRole} 
      isLoggedIn={isLoggedIn} 
      user={userProfile || undefined} 
      onLogout={() => { clearSession(); setIsLoggedIn(false); setCurrentTab(AppTab.HOME); }}
      onPostJob={() => setShowJobPost(true)}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default App;
