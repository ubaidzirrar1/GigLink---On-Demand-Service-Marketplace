import React, { useState, useMemo } from 'react';
import { CATEGORIES, MOCK_WORKERS } from '../constants';
import PopularProjects from './PopularProjects';
import CategoryIcon, { getCategoryTheme } from './CategoryIcon';

interface LandingPageProps {
  onPostJob: () => void;
  onViewWorker: (id: string) => void;
  onViewAllWorkers: () => void;
  onSelectCategory?: (category: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onPostJob, 
  onViewWorker, 
  onViewAllWorkers,
  onSelectCategory 
}) => {
  const [serviceSearch, setServiceSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isWorkersMobileExpanded, setIsWorkersMobileExpanded] = useState(false);

  // Extract category list (27 categories across 4 columns)
  const categoryList = useMemo(() => {
    const cols = CATEGORIES.filter(c => c.column !== undefined && c.column >= 1 && c.column <= 4);
    return cols.length > 0 ? cols : CATEGORIES.slice(0, 27);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (!categoryName || activeCategory === categoryName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryName);
      // Smoothly scroll to the workers section so the user sees results
      const section = document.getElementById('workers-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceSearch.trim()) {
      setActiveCategory(serviceSearch.trim());
    }
    const workersSection = document.getElementById('workers-section');
    if (workersSection) {
      workersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredWorkers = useMemo(() => {
    let list = MOCK_WORKERS;

    if (activeCategory) {
      const catLower = activeCategory.toLowerCase();
      const match = list.filter(w => 
        w.specialties.some(s => s.toLowerCase().includes(catLower)) ||
        w.skills?.some(sk => sk.toLowerCase().includes(catLower)) ||
        w.bio?.toLowerCase().includes(catLower)
      );
      if (match.length > 0) {
        list = match;
      }
    }

    if (serviceSearch.trim()) {
      const q = serviceSearch.trim().toLowerCase();
      const match = list.filter(w => 
        w.name.toLowerCase().includes(q) ||
        w.specialties.some(s => s.toLowerCase().includes(q)) ||
        w.skills?.some(sk => sk.toLowerCase().includes(q))
      );
      if (match.length > 0) {
        list = match;
      }
    }

    if (locationSearch.trim()) {
      const loc = locationSearch.trim().toLowerCase();
      const match = list.filter(w => 
        w.formattedAddress?.toLowerCase().includes(loc) ||
        w.bio?.toLowerCase().includes(loc)
      );
      if (match.length > 0) {
        list = match;
      }
    }

    return list;
  }, [activeCategory, serviceSearch, locationSearch]);

  const quickFilterPills = [
    'Plumbing',
    'Electrical',
    'Construction',
    'Design',
    'Cleaning',
    'Roofing',
    'Painter',
    'Tech & IT'
  ];

  return (
    <div className="bg-[#071426] text-[#F4F7FC] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background glow element */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2878FF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & Search Bar */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10223A] border border-[#223955] text-xs font-semibold text-[#2878FF]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
              <span>Over 1,400+ Verified Pros Ready Nearby</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Find Trusted Professionals{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2878FF] via-[#38BDF8] to-[#22C55E]">
                Near You
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A9B9D0] max-w-xl font-normal leading-relaxed">
              Get quality services from verified local experts for any project, from repairs to tech support. Fast response, guaranteed craftsmanship, and secure payment.
            </p>

            {/* Dark Navy Search Bar Card */}
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-[#10223A] border border-[#223955] rounded-2xl p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 max-w-2xl"
            >
              {/* Service Input */}
              <div className="flex-1 flex items-center px-3.5 py-3 w-full border-b md:border-b-0 md:border-r border-[#223955]">
                <svg className="w-5 h-5 text-[#2878FF] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input 
                  type="text" 
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search Service (e.g. Plumber, Electrician)" 
                  className="w-full bg-transparent focus:outline-none text-[#F4F7FC] placeholder:text-[#A9B9D0]/60 text-sm font-medium"
                />
              </div>

              {/* Location Input with glowing pin icon */}
              <div className="flex-1 flex items-center px-3.5 py-3 w-full">
                <svg className="w-5 h-5 text-[#22C55E] mr-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                <input 
                  type="text" 
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Set your location (e.g. Abbottabad)" 
                  className="w-full bg-transparent focus:outline-none text-[#F4F7FC] placeholder:text-[#A9B9D0]/60 text-sm font-medium"
                />
              </div>

              {/* Submit CTA Button */}
              <button 
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 bg-gradient-to-r from-[#2878FF] to-[#1B66E5] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_4px_16px_rgba(40,120,255,0.4)] transition-all active:scale-95 text-sm shrink-0 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Search</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </form>

            {/* Quick Filter Pills */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-[#A9B9D0] mb-2 font-medium">
                <span>Popular searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilterPills.map(tag => {
                  const isActive = activeCategory?.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleCategoryClick(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#2878FF] border-[#2878FF] text-white font-semibold' 
                          : 'bg-[#10223A]/80 border-[#223955] text-[#A9B9D0] hover:text-white hover:border-[#2878FF]/50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Feature Graphic (Handyman with Blue Glow & Badges) - Hidden on mobile so it doesn't crowd under the search */}
          <div className="hidden lg:flex lg:col-span-5 justify-center relative">
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
              {/* Blue Circular Glow Backdrop */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#1B66E5] via-[#2878FF] to-[#22C55E]/60 opacity-80 blur-2xl -z-10" />
              <div className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-full bg-gradient-to-b from-[#10223A] to-[#071426] border-2 border-[#2878FF]/40 shadow-2xl relative overflow-hidden flex items-end justify-center">
                
                {/* Handyman Pro Graphic Representation */}
                <div className="relative w-full h-full flex flex-col items-center justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=700&q=80"
                    alt="Trusted Professional Handyman"
                    className="w-full h-[90%] object-cover object-top scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-80"></div>
                </div>
              </div>

              {/* Floating Trust Badge: Verified Pro */}
              <div className="absolute top-4 -left-2 sm:-left-6 bg-[#0B1B31]/95 border border-[#223955] rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center space-x-3 animate-in fade-in duration-500">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Verified Specialists</div>
                  <div className="text-[10px] text-[#22C55E] font-medium">100% Background-Checked</div>
                </div>
              </div>

              {/* Floating Trust Badge: 4.9 Stars */}
              <div className="absolute bottom-4 -right-2 sm:-right-4 bg-[#0B1B31]/95 border border-[#223955] rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <span className="text-lg">★</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>4.8 / 5.0</span>
                    <span className="text-[10px] text-[#A9B9D0]">(1,400+ reviews)</span>
                  </div>
                  <div className="text-[10px] text-[#A9B9D0]">Top Quality Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PROJECTS / BROWSE CATEGORIES SECTION */}
      <section className="border-t border-[#223955]/60 bg-[#0B1B31]/30 px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-[#223955]/60 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-[#2878FF] text-xs font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#2878FF]"></span>
                <span>Project Directory</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>Browse Categories</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#10223A] border border-[#223955] text-[#2878FF]">
                  {categoryList.length} Categories
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#A9B9D0] mt-1 font-normal">
                Select any trade or project category below to filter verified specialists near you
              </p>
            </div>

            {activeCategory && (
              <button
                type="button"
                onClick={() => handleCategoryClick('')}
                className="text-xs text-[#2878FF] hover:text-[#5393FF] font-semibold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer bg-[#10223A] px-3 py-1.5 rounded-lg border border-[#223955]"
              >
                <span>Reset filter</span>
                <span className="text-sm font-bold leading-none">×</span>
              </button>
            )}
          </div>

          {/* Category Cards Grid: 2 columns on mobile (grid-cols-2), 4 columns on desktop (lg:grid-cols-4) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categoryList.map((category, index) => {
              const isSelected = activeCategory?.toLowerCase() === category.name.toLowerCase();
              const theme = getCategoryTheme(category.name);
              // On mobile (< sm), show only first 8 cards and hide the rest unless expanded
              const isHiddenOnMobile = index >= 8 && !isCategoriesExpanded;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full group items-center space-x-2.5 sm:space-x-3 text-left p-2.5 sm:p-3 rounded-xl transition-all duration-150 cursor-pointer ${
                    isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                  } ${
                    isSelected 
                      ? 'bg-[#10223A] border border-[#2878FF] text-[#2878FF] shadow-[0_0_15px_rgba(40,120,255,0.25)] font-semibold scale-[1.02]' 
                      : `bg-[#10223A] hover:bg-[#162A45] border border-[#223955] ${theme.hoverBorder} text-[#A9B9D0] hover:text-white shadow-sm`
                  }`}
                >
                  <span className={`shrink-0 p-1.5 rounded-lg border transition-transform duration-150 group-hover:scale-110 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-[#2878FF]/20 border-[#2878FF] text-[#2878FF]' 
                      : `${theme.badgeBg} ${theme.badgeBorder} ${theme.iconColor}`
                  }`}>
                    <CategoryIcon 
                      name={category.name} 
                      size={18}
                      className={isSelected ? 'text-[#2878FF]' : theme.iconColor} 
                    />
                  </span>
                  <span className="text-xs sm:text-sm leading-tight font-medium truncate">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile 'View More' / 'View Less' Toggle Button for Categories */}
          {categoryList.length > 8 && (
            <div className="flex sm:hidden justify-center mt-4">
              <button
                type="button"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="w-full py-2.5 px-4 bg-[#10223A] hover:bg-[#162A45] border border-[#223955] hover:border-[#2878FF] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
              >
                <span>{isCategoriesExpanded ? 'View Less' : `View More (${categoryList.length - 8} more)`}</span>
                <svg 
                  className={`w-4 h-4 text-[#2878FF] transition-transform duration-200 ${isCategoriesExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TOP-RATED PROFESSIONALS NEARBY SECTION */}
      <section id="workers-section" className="px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-7xl mx-auto border-t border-[#223955]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#2878FF] text-xs font-bold uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2878FF]"></span>
              <span>Available Right Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeCategory ? `Top-Rated ${activeCategory} Specialists` : 'Top-Rated Professionals Nearby'}
            </h2>
            <p className="text-sm text-[#A9B9D0] mt-1">
              {activeCategory 
                ? `Showing verified experts specializing in ${activeCategory}` 
                : 'Connect with top-rated local experts instantly'}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg bg-[#10223A] border border-[#223955] cursor-pointer"
              >
                Clear Filter ({activeCategory})
              </button>
            )}
            <button 
              type="button"
              onClick={onViewAllWorkers}
              className="text-xs font-bold text-[#2878FF] hover:text-[#5393FF] flex items-center space-x-1 transition-colors px-3 py-1.5 rounded-lg bg-[#10223A] border border-[#223955] cursor-pointer hover:border-[#2878FF]/50"
            >
              <span>View all</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Professional Cards Grid: 2 columns on mobile (grid-cols-2), 5 columns on desktop (lg:grid-cols-5) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch">
          {filteredWorkers.map((worker, index) => {
            // On mobile (< sm): show first 8 cards when collapsed; hide index >= 8 unless expanded
            const isHiddenOnMobile = index >= 8 && !isWorkersMobileExpanded;
            // On desktop: if list is long, show up to 10 (2 full rows of 5)
            const isHiddenOnDesktop = index >= 10;

            return (
              <div 
                key={worker.id} 
                className={`h-72 bg-[#10223A] border border-[#223955] rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-[#2878FF]/70 hover:shadow-[0_8px_25px_rgba(40,120,255,0.15)] transition-all flex flex-col justify-between group ${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                } ${isHiddenOnDesktop ? 'lg:hidden' : ''}`}
              >
                {/* Card Top: Specialty Badge & Distance */}
                <div>
                  <div className="flex items-center justify-between mb-2 gap-1.5 w-full min-h-[22px]">
                    <span className="text-[10px] font-bold text-[#2878FF] bg-[#2878FF]/10 px-2 py-0.5 rounded-md border border-[#2878FF]/20 truncate max-w-[75px] sm:max-w-none">
                      {worker.specialties[0]}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-[#A9B9D0] flex items-center shrink-0">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#22C55E] mr-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                      </svg>
                      {worker.distance}
                    </span>
                  </div>

                  {/* Profile Avatar & Details Centered */}
                  <div className="flex flex-col items-center text-center">
                    {/* Fixed Size Circular Avatar with Online Dot */}
                    <div className="relative mb-2 shrink-0 flex justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#223955] group-hover:border-[#2878FF] transition-colors shadow-md shrink-0 aspect-square bg-[#0B1B31]">
                        <img 
                          src={worker.avatar} 
                          alt={worker.name}
                          className="w-full h-full object-cover object-center rounded-full aspect-square block"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#22C55E] rounded-full border-2 border-[#10223A] ring-1 ring-[#22C55E]/50 z-10"></span>
                    </div>

                    <h3 className="font-bold text-white text-xs sm:text-sm leading-snug group-hover:text-[#2878FF] transition-colors flex items-center justify-center gap-1 w-full px-1">
                      <span className="truncate">{worker.name}</span>
                      {worker.isVerified && (
                        <svg className="w-3 h-3 text-[#2878FF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-xs font-bold text-white">{worker.rating}</span>
                      <span className="text-[10px] text-[#A9B9D0]">({worker.reviews})</span>
                    </div>

                    {/* Hourly Rate */}
                    <div className="text-[11px] font-semibold text-[#A9B9D0] mt-1">
                      <strong className="text-white text-xs sm:text-sm">${worker.hourlyRate}</strong> / hr
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Action Button pinned to bottom */}
                <div className="w-full pt-2">
                  <button 
                    type="button"
                    onClick={() => onViewWorker(worker.id)}
                    className="w-full py-2 bg-[#0B1B31] hover:bg-[#2878FF] text-[#F4F7FC] hover:text-white border border-[#223955] hover:border-[#2878FF] rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm text-center"
                  >
                    View profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile 'View More' / 'View Less' Toggle Button for Top-Rated Workers */}
        {filteredWorkers.length > 8 && (
          <div className="flex sm:hidden justify-center mt-4">
            <button
              type="button"
              onClick={() => setIsWorkersMobileExpanded(!isWorkersMobileExpanded)}
              className="w-full py-2.5 px-4 bg-[#10223A] hover:bg-[#162A45] border border-[#223955] hover:border-[#2878FF] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <span>{isWorkersMobileExpanded ? 'View Less' : `View More (${filteredWorkers.length - 8} more specialists)`}</span>
              <svg 
                className={`w-4 h-4 text-[#2878FF] transition-transform duration-200 ${isWorkersMobileExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* Trust & Guarantee Section: 2 Cards on Mobile (grid-cols-2), 4 on Desktop (lg:grid-cols-4) */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-7xl mx-auto border-t border-[#223955]/70">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Built for Peace of Mind
          </h2>
          <p className="text-xs sm:text-sm text-[#A9B9D0] mt-1.5">
            Every booking through GigLink is backed by our customer protection and quality standards
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-[#0B1B31] border border-[#223955] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#2878FF]/10 border border-[#2878FF]/30 flex items-center justify-center text-[#2878FF] mb-2.5 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white mb-1 leading-snug">100% Vetted Pros</h3>
              <p className="text-[10px] sm:text-xs text-[#A9B9D0] leading-relaxed line-clamp-3 sm:line-clamp-none">
                Every provider undergoes CNIC, background, credential, and skill verification before taking orders.
              </p>
            </div>
          </div>

          <div className="bg-[#0B1B31] border border-[#223955] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] mb-2.5 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white mb-1 leading-snug">Escrow Protection</h3>
              <p className="text-[10px] sm:text-xs text-[#A9B9D0] leading-relaxed line-clamp-3 sm:line-clamp-none">
                Your funds are securely held in escrow and only released once you inspect and approve the completed job.
              </p>
            </div>
          </div>

          <div className="bg-[#0B1B31] border border-[#223955] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2.5 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white mb-1 leading-snug">Live Pro Dispatch</h3>
              <p className="text-[10px] sm:text-xs text-[#A9B9D0] leading-relaxed line-clamp-3 sm:line-clamp-none">
                Real-time distance estimation and interactive map navigation so you know exactly when help arrives.
              </p>
            </div>
          </div>

          <div className="bg-[#0B1B31] border border-[#223955] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white mb-1 leading-snug">24/7 Support Desk</h3>
              <p className="text-[10px] sm:text-xs text-[#A9B9D0] leading-relaxed line-clamp-3 sm:line-clamp-none">
                Instant live chat assistance for scheduling, project disputes, emergency requests, or warranty coverage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
