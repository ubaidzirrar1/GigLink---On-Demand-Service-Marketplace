import React, { useState, useEffect, useRef } from 'react';
import { UserRole, AppTab, Worker } from '../../types';

interface Props {
  children: React.ReactNode;
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  user?: Worker;
  onLogout: () => void;
  onPostJob?: () => void;
}

const MainLayout: React.FC<Props> = ({ 
  children, 
  currentTab, 
  setCurrentTab, 
  role, 
  setRole, 
  isLoggedIn, 
  user, 
  onLogout,
  onPostJob 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display user info - defaults to Ubaid Ur Rahman if guest or standard profile
  const displayName = user?.name || 'Ubaid Ur Rahman';
  const displayAvatar = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';

  const navLinks = [
    { label: 'Home', tab: AppTab.HOME },
    { label: 'Browse Services', tab: AppTab.SEARCH },
    { label: 'Become a Partner', action: () => {
        if (role !== UserRole.WORKER) {
          setRole(UserRole.WORKER);
          setCurrentTab(AppTab.PROFILE);
        } else {
          setCurrentTab(AppTab.PROFILE);
        }
      } 
    },
    { label: 'About Us', action: () => setShowAboutModal(true) },
  ];

  const mobileNavItems = [
    { 
      tab: AppTab.HOME, 
      label: 'Home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ) 
    },
    { 
      tab: AppTab.SEARCH, 
      label: 'Explore', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      ) 
    },
    { 
      tab: AppTab.MY_JOBS, 
      label: role === UserRole.CLIENT ? 'Gigs' : 'Jobs', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ) 
    },
    { 
      tab: AppTab.CHAT, 
      label: 'Messages', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ) 
    },
    { 
      tab: AppTab.PROFILE, 
      label: 'Profile', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ) 
    },
  ];

  return (
    <div className="min-h-screen bg-[#071426] text-[#F4F7FC] flex flex-col font-sans selection:bg-[#2878FF]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0B1B31]/95 backdrop-blur-md border-b border-[#223955] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Mobile menu trigger */}
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#A9B9D0] hover:text-white hover:bg-[#10223A] rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
              </svg>
            </button>

            <button 
              type="button"
              onClick={() => setCurrentTab(AppTab.HOME)}
              className="flex items-center space-x-2.5 text-left group cursor-pointer"
            >
              {/* Distinctive Hexagonal Map Pin Logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2878FF] to-[#22C55E] p-0.5 shadow-[0_0_15px_rgba(40,120,255,0.4)] group-hover:shadow-[0_0_20px_rgba(40,120,255,0.6)] transition-all">
                <div className="w-full h-full bg-[#0B1B31] rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#2878FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                Gig<span className="text-[#2878FF]">Link</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item, idx) => {
              const isActive = item.tab ? currentTab === item.tab : false;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.action) item.action();
                    else if (item.tab) setCurrentTab(item.tab);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'text-[#2878FF] bg-[#10223A] font-semibold shadow-inner' 
                      : 'text-[#A9B9D0] hover:text-white hover:bg-[#10223A]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Post Job, Notifications, Profile Menu */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Post Job CTA */}
            {onPostJob && (
              <button
                type="button"
                onClick={onPostJob}
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#2878FF] to-[#1B66E5] hover:brightness-110 text-white text-xs md:text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(40,120,255,0.35)] transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Post a Job</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setCurrentTab(AppTab.NOTIFICATIONS)}
              className="relative p-2.5 text-[#A9B9D0] hover:text-white hover:bg-[#10223A] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#223955]"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-[#0B1B31] animate-pulse"></span>
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-xl hover:bg-[#10223A] border border-transparent hover:border-[#223955] transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">{displayName}</div>
                  <div className="text-[10px] text-[#22C55E] font-medium flex items-center justify-end space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                    <span>{role === UserRole.WORKER ? 'Pro Mode' : 'Client'}</span>
                  </div>
                </div>

                <div className="relative w-9 h-9 rounded-full ring-2 ring-[#2878FF]/40 overflow-hidden bg-[#10223A] shrink-0">
                  <img 
                    src={displayAvatar} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#10223A] border border-[#223955] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#223955]/70">
                    <p className="text-xs text-[#A9B9D0]">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-[#2878FF] font-medium mt-0.5">{user?.email || 'ubaid@giglink.com'}</p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRole(role === UserRole.CLIENT ? UserRole.WORKER : UserRole.CLIENT);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#F4F7FC] hover:bg-[#162A45] flex items-center space-x-2.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#2878FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span>Switch to {role === UserRole.CLIENT ? 'Pro (Worker)' : 'Client'} Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab(AppTab.PROFILE);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#F4F7FC] hover:bg-[#162A45] flex items-center space-x-2.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#A9B9D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab(AppTab.MY_JOBS);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#F4F7FC] hover:bg-[#162A45] flex items-center space-x-2.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#A9B9D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      <span>{role === UserRole.CLIENT ? 'My Gigs & Posts' : 'Active Jobs'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab(AppTab.SETTINGS);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#F4F7FC] hover:bg-[#162A45] flex items-center space-x-2.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#A9B9D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-[#223955]/70 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0B1B31] border-r border-[#223955] p-6 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center space-x-2.5 mb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2878FF] to-[#22C55E] p-0.5">
                  <div className="w-full h-full bg-[#0B1B31] rounded-[10px] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#2878FF]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-white">
                  Gig<span className="text-[#2878FF]">Link</span>
                </span>
              </div>

              <div className="space-y-1">
                {navLinks.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.tab) setCurrentTab(item.tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm font-semibold text-[#F4F7FC] hover:bg-[#10223A] transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <svg className="w-4 h-4 text-[#A9B9D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                ))}
              </div>

              {/* Role switcher button */}
              <div className="mt-6 pt-6 border-t border-[#223955]">
                <button
                  type="button"
                  onClick={() => {
                    setRole(role === UserRole.CLIENT ? UserRole.WORKER : UserRole.CLIENT);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full p-3 rounded-xl bg-[#10223A] hover:bg-[#162A45] border border-[#223955] text-xs font-bold text-[#2878FF] flex items-center justify-between"
                >
                  <span>Active Mode: <strong className="text-white capitalize">{role.toLowerCase()}</strong></span>
                  <span className="text-[11px] underline">Switch</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#223955]">
              {onPostJob && (
                <button
                  type="button"
                  onClick={() => {
                    onPostJob();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#2878FF] hover:bg-[#1B66E5] text-white text-sm font-bold rounded-xl shadow-lg transition-all mb-3 text-center"
                >
                  Post a Job Now
                </button>
              )}
              <p className="text-[11px] text-[#A9B9D0] text-center">GigLink Local Marketplace</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 pb-20 lg:pb-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0B1B31]/95 backdrop-blur-md border-t border-[#223955] py-2 px-3 z-40 flex justify-around items-center shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        {mobileNavItems.map(item => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setCurrentTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#2878FF] font-bold scale-105' 
                  : 'text-[#A9B9D0] hover:text-[#F4F7FC]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2878FF] rounded-full"></span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAboutModal(false)}
          />
          <div className="relative bg-[#0B1B31] border border-[#223955] rounded-3xl max-w-lg w-full p-6 sm:p-8 z-10 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#223955]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2878FF] flex items-center justify-center text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-white">About GigLink</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-[#A9B9D0] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-[#A9B9D0]">
              <p>
                <strong className="text-white">GigLink</strong> is a next-generation local services marketplace designed to instantly connect homeowners, residents, and businesses with certified local trade professionals and specialists.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#10223A] p-3 rounded-2xl border border-[#223955]">
                  <div className="text-[#22C55E] text-base font-bold">100% Verified</div>
                  <div className="text-xs text-[#A9B9D0]">ID & background vetted pros</div>
                </div>
                <div className="bg-[#10223A] p-3 rounded-2xl border border-[#223955]">
                  <div className="text-[#2878FF] text-base font-bold">Real-Time GPS</div>
                  <div className="text-xs text-[#A9B9D0]">Live local distance metrics</div>
                </div>
                <div className="bg-[#10223A] p-3 rounded-2xl border border-[#223955]">
                  <div className="text-amber-400 text-base font-bold">Escrow Safety</div>
                  <div className="text-xs text-[#A9B9D0]">Pay only when job is completed</div>
                </div>
                <div className="bg-[#10223A] p-3 rounded-2xl border border-[#223955]">
                  <div className="text-purple-400 text-base font-bold">Direct Chat</div>
                  <div className="text-xs text-[#A9B9D0]">Instant contact with workers</div>
                </div>
              </div>
              <p className="text-xs text-[#A9B9D0]/80">
                Operating in Abbottabad, Rawalpindi, Islamabad, and expanding nationwide.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#223955] flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2.5 bg-[#2878FF] hover:bg-[#1B66E5] text-white font-bold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
