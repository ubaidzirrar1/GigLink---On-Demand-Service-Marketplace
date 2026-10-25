
import React, { useState } from 'react';
import { UserRole, AppTab, Worker } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onPostJob?: () => void;
  user?: Worker;
  onLogout?: () => void;
  isLoggedIn: boolean;
  theme?: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentTab, setCurrentTab, role, setRole, onPostJob, user, onLogout, isLoggedIn, theme, setTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { tab: AppTab.HOME, label: 'Home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    )},
    { tab: AppTab.SEARCH, label: role === UserRole.CLIENT ? 'Search' : 'Map', icon: (
      role === UserRole.CLIENT 
      ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
    )},
    { tab: AppTab.MY_JOBS, label: role === UserRole.CLIENT ? 'My Jobs' : 'Applied', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
    )},
    { tab: AppTab.PROFILE, label: isLoggedIn ? 'Profile' : 'Sign In', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
    )},
  ];

  const cycleTheme = () => {
    if (!setTheme) return;
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="relative min-h-screen bg-[#fbfcff] dark:bg-slate-900 flex flex-col overflow-x-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
               {isLoggedIn && user ? (
                 <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
               ) : (
                 <span className="text-xl">👤</span>
               )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{isLoggedIn && user ? user.name : "Guest User"}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{isLoggedIn ? `${role.toLowerCase()} Mode` : 'Limited Access'}</p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {isLoggedIn && (
              <button 
                onClick={() => {
                  setRole(role === UserRole.CLIENT ? UserRole.WORKER : UserRole.CLIENT);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold mb-4"
              >
                <div className="flex items-center space-x-3 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  <span>Switch to {role === UserRole.CLIENT ? 'Worker' : 'Client'}</span>
                </div>
              </button>
            )}

            {/* Theme Toggle in Sidebar */}
            <button 
              onClick={cycleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🌓'}
                </span>
                <span>Theme: <span className="capitalize">{theme}</span></span>
              </div>
            </button>

            <SidebarLink icon="⚙️" label="Settings" onClick={() => { setCurrentTab(AppTab.SETTINGS); setIsSidebarOpen(false); }} />
            <SidebarLink icon="💬" label="Support" onClick={() => { setCurrentTab(AppTab.CHAT); setIsSidebarOpen(false); }} />
            <SidebarLink icon="🔔" label="Notifications" onClick={() => { setCurrentTab(AppTab.NOTIFICATIONS); setIsSidebarOpen(false); }} />
            <SidebarLink icon="📜" label="Term of Services" />
          </div>

          {isLoggedIn ? (
            <button 
              onClick={() => onLogout?.()}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold transition-colors mt-auto"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          ) : (
            <button 
              onClick={() => { setCurrentTab(AppTab.PROFILE); setIsSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-indigo-600 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none mt-auto"
            >
              <span>🔑</span>
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
          </button>
          <div className="font-bold text-xl tracking-tight text-indigo-600">GigLink</div>
        </div>

        <div className="flex items-center space-x-1.5">
          {isLoggedIn && role === UserRole.CLIENT && onPostJob && (
            <button 
              onClick={onPostJob}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-[12px] shadow-sm active:scale-95 transition-all mr-2"
            >
              Post Job
            </button>
          )}
          <button onClick={() => setCurrentTab(AppTab.CHAT)} className="p-2 text-slate-500 dark:text-slate-400 relative bg-slate-50 dark:bg-slate-800 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>
          <button onClick={() => setCurrentTab(AppTab.NOTIFICATIONS)} className="p-2 text-slate-500 dark:text-slate-400 relative bg-slate-50 dark:bg-slate-800 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Sticky Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center py-2 px-4 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setCurrentTab(item.tab)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${currentTab === item.tab ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const SidebarLink: React.FC<{icon: string, label: string, onClick?: () => void}> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Layout;
