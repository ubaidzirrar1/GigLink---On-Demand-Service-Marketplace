import React, { useState, useMemo } from 'react';
import { MOCK_WORKERS, CATEGORIES } from '../../constants';
import { getWorkerMastery } from '../../features/Profile/workerUtils';
import CategoryIcon, { getCategoryTheme } from '../../components/CategoryIcon';

interface Props {
  onViewWorker: (id: string) => void;
  userLocation: { lat: number; lng: number } | null;
}

type SortOption = 'rating' | 'distance' | 'hourlyRate_asc' | 'hourlyRate_desc';

const getNumericDistance = (
  worker: typeof MOCK_WORKERS[0], 
  userLoc: { lat: number; lng: number } | null
): number => {
  if (userLoc && worker.location && typeof worker.location.lat === 'number' && typeof worker.location.lng === 'number') {
    const R = 6371; // Earth radius in km
    const dLat = ((worker.location.lat - userLoc.lat) * Math.PI) / 180;
    const dLng = ((worker.location.lng - userLoc.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLoc.lat * Math.PI) / 180) *
        Math.cos((worker.location.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }
  const match = worker.distance?.match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : 999;
};

const NearbyWorkers: React.FC<Props> = ({ onViewWorker, userLocation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredWorkers = useMemo(() => {
    let list = MOCK_WORKERS;

    // Filter by Category
    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      list = list.filter(w => 
        w.specialties.some(s => s.toLowerCase().includes(cat)) ||
        w.skills?.some(s => s.toLowerCase().includes(cat)) ||
        w.bio?.toLowerCase().includes(cat)
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(w => 
        w.name.toLowerCase().includes(q) ||
        w.specialties.some(s => s.toLowerCase().includes(q)) ||
        w.skills?.some(s => s.toLowerCase().includes(q)) ||
        w.formattedAddress?.toLowerCase().includes(q)
      );
    }

    // Filter by Verified Only
    if (onlyVerified) {
      list = list.filter(w => w.isVerified);
    }

    // Filter by Available Now
    if (onlyAvailable) {
      list = list.filter(w => w.isAvailable);
    }

    // Sort Workers
    const result = [...list].sort((a, b) => {
      if (sortBy === 'rating') {
        if (b.rating !== a.rating) {
          return b.rating - a.rating; // Highest rating first
        }
        return (b.reviews || 0) - (a.reviews || 0); // Tie breaker: review count
      }
      if (sortBy === 'distance') {
        const distA = getNumericDistance(a, userLocation);
        const distB = getNumericDistance(b, userLocation);
        return distA - distB; // Closest first
      }
      if (sortBy === 'hourlyRate_asc') {
        return a.hourlyRate - b.hourlyRate; // Lowest hourly rate first
      }
      if (sortBy === 'hourlyRate_desc') {
        return b.hourlyRate - a.hourlyRate; // Highest hourly rate first
      }
      return 0;
    });

    return result;
  }, [selectedCategory, searchQuery, onlyVerified, onlyAvailable, sortBy, userLocation]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 max-w-7xl mx-auto bg-[#071426] text-[#F4F7FC]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#223955] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[#2878FF] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span>Live Professional Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Browse Verified Specialists
          </h2>
          <p className="text-xs sm:text-sm text-[#A9B9D0] mt-1">
            Found {filteredWorkers.length} {selectedCategory ? `${selectedCategory} ` : ''}professionals near Abbottabad & surroundings
          </p>
        </div>

        {/* Quick search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, skill, area..."
            className="w-full bg-[#10223A] border border-[#223955] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#A9B9D0]/60 focus:outline-none focus:border-[#2878FF]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#A9B9D0] hover:text-white cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === null 
              ? 'bg-[#2878FF] text-white shadow-md' 
              : 'bg-[#10223A] text-[#A9B9D0] hover:text-white border border-[#223955] hover:border-[#2878FF]/50'
          }`}
        >
          All Specialists
        </button>
        {CATEGORIES.slice(0, 16).map(cat => {
          const isActive = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
          const theme = getCategoryTheme(cat.name);
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? null : cat.name)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-[#2878FF] text-white shadow-md border border-[#2878FF]'
                  : `bg-[#10223A] text-[#A9B9D0] hover:text-white border border-[#223955] ${theme.hoverBorder}`
              }`}
            >
              <CategoryIcon 
                name={cat.name} 
                size={16} 
                className={isActive ? 'text-white' : theme.iconColor} 
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* FILTER & SORT BAR */}
      <div className="bg-[#10223A] border border-[#223955] rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Sort By Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#A9B9D0] uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <svg className="w-3.5 h-3.5 text-[#2878FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>Sort By:</span>
            </span>

            {/* Sort: Rating */}
            <button
              type="button"
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                sortBy === 'rating'
                  ? 'bg-[#2878FF] text-white shadow-md shadow-[#2878FF]/20 border border-[#2878FF]'
                  : 'bg-[#0B1B31] text-[#A9B9D0] hover:text-white border border-[#223955] hover:border-[#2878FF]/50'
              }`}
            >
              <span className="text-amber-400">★</span>
              <span>Rating</span>
              <span className={`text-[10px] ${sortBy === 'rating' ? 'text-white/80' : 'text-[#A9B9D0]/70'}`}>(High to Low)</span>
            </button>

            {/* Sort: Distance */}
            <button
              type="button"
              onClick={() => setSortBy('distance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                sortBy === 'distance'
                  ? 'bg-[#2878FF] text-white shadow-md shadow-[#2878FF]/20 border border-[#2878FF]'
                  : 'bg-[#0B1B31] text-[#A9B9D0] hover:text-white border border-[#223955] hover:border-[#2878FF]/50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
              <span>Distance</span>
              <span className={`text-[10px] ${sortBy === 'distance' ? 'text-white/80' : 'text-[#A9B9D0]/70'}`}>(Nearest)</span>
            </button>

            {/* Sort: Hourly Rate Low to High */}
            <button
              type="button"
              onClick={() => setSortBy('hourlyRate_asc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                sortBy === 'hourlyRate_asc'
                  ? 'bg-[#2878FF] text-white shadow-md shadow-[#2878FF]/20 border border-[#2878FF]'
                  : 'bg-[#0B1B31] text-[#A9B9D0] hover:text-white border border-[#223955] hover:border-[#2878FF]/50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Rate: Low → High</span>
            </button>

            {/* Sort: Hourly Rate High to Low */}
            <button
              type="button"
              onClick={() => setSortBy('hourlyRate_desc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                sortBy === 'hourlyRate_desc'
                  ? 'bg-[#2878FF] text-white shadow-md shadow-[#2878FF]/20 border border-[#2878FF]'
                  : 'bg-[#0B1B31] text-[#A9B9D0] hover:text-white border border-[#223955] hover:border-[#2878FF]/50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Rate: High → Low</span>
            </button>
          </div>

          {/* Right: Quick Status Toggles & Reset */}
          <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#223955]/70">
            {/* Verified Only Toggle */}
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer border ${
                onlyVerified
                  ? 'bg-[#2878FF]/15 text-[#5393FF] border-[#2878FF]'
                  : 'bg-[#0B1B31] text-[#A9B9D0] border-[#223955] hover:border-[#2878FF]/40'
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${onlyVerified ? 'text-[#2878FF]' : 'text-[#A9B9D0]'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Only</span>
            </button>

            {/* Available Now Toggle */}
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer border ${
                onlyAvailable
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                  : 'bg-[#0B1B31] text-[#A9B9D0] border-[#223955] hover:border-emerald-500/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-[#22C55E] animate-pulse' : 'bg-gray-500'}`}></span>
              <span>Available Now</span>
            </button>

            {/* Reset Filters (if modified) */}
            {(sortBy !== 'rating' || onlyVerified || onlyAvailable || selectedCategory || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSortBy('rating');
                  setOnlyVerified(false);
                  setOnlyAvailable(false);
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-all cursor-pointer ml-auto sm:ml-0"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Sort/Filter Status Summary bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#A9B9D0] pt-2.5 border-t border-[#223955]/60 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span>Showing <strong className="text-white font-bold">{filteredWorkers.length}</strong> matching specialists</span>
            {selectedCategory && (
              <span className="px-2 py-0.5 rounded-md bg-[#2878FF]/10 text-[#2878FF] border border-[#2878FF]/20 text-[10px] font-semibold">
                Category: {selectedCategory}
              </span>
            )}
            {onlyVerified && (
              <span className="px-2 py-0.5 rounded-md bg-[#2878FF]/15 text-[#5393FF] border border-[#2878FF]/30 text-[10px] font-semibold">
                Verified Only
              </span>
            )}
            {onlyAvailable && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                Available Now
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[#A9B9D0]">
            <span>Active Sort:</span>
            <span className="font-semibold text-white">
              {sortBy === 'rating' && 'Highest Rated ★'}
              {sortBy === 'distance' && 'Nearest Distance 📍'}
              {sortBy === 'hourlyRate_asc' && 'Lowest Hourly Rate ($)'}
              {sortBy === 'hourlyRate_desc' && 'Highest Hourly Rate ($)'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkers.map((worker) => {
          const mastery = getWorkerMastery(worker);
          const computedDist = getNumericDistance(worker, userLocation);
          const displayDist = userLocation ? `${computedDist} km` : worker.distance;

          return (
            <div 
              key={worker.id} 
              className="bg-[#10223A] border border-[#223955] hover:border-[#2878FF]/70 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start space-x-4">
                  <div className="relative shrink-0">
                    <img 
                      src={worker.avatar} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#223955] group-hover:border-[#2878FF] transition-colors" 
                      alt={worker.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${worker.isAvailable ? 'bg-[#22C55E]' : 'bg-gray-500'} border-2 border-[#10223A] rounded-full`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base truncate group-hover:text-[#2878FF] transition-colors flex items-center gap-1.5">
                      <span>{worker.name}</span>
                      {worker.isVerified && (
                        <svg className="w-3.5 h-3.5 text-[#2878FF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded ${mastery.color}`}>
                        {mastery.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs font-bold text-white">{worker.rating}</span>
                        <span className="text-[10px] text-[#A9B9D0]">({worker.reviews})</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#A9B9D0] mt-1 flex items-center gap-1 truncate">
                      <svg className="w-3 h-3 text-[#22C55E] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                      </svg>
                      <span className="truncate">{worker.formattedAddress || 'Mandian, Abbottabad'}</span>
                      <span>·</span>
                      <span className="font-semibold text-white shrink-0">{displayDist}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-white">${worker.hourlyRate}</div>
                    <div className="text-[9px] text-[#A9B9D0] font-semibold">/ HR</div>
                  </div>
                </div>

                <p className="text-xs text-[#A9B9D0] mt-3 line-clamp-2 leading-relaxed">
                  {worker.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {worker.specialties.map(s => (
                    <span key={s} className="text-[10px] font-semibold text-[#2878FF] bg-[#2878FF]/10 px-2 py-0.5 rounded-md border border-[#2878FF]/20">
                      {s}
                    </span>
                  ))}
                  {worker.skills?.slice(0, 2).map(sk => (
                    <span key={sk} className="text-[10px] text-[#A9B9D0] bg-[#071426] px-2 py-0.5 rounded-md border border-[#223955]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#223955] flex items-center gap-2">
                <button 
                  onClick={() => onViewWorker(worker.id)}
                  className="flex-1 py-2.5 bg-[#0B1B31] hover:bg-[#2878FF] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#223955] hover:border-[#2878FF] text-center"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="py-16 text-center bg-[#0B1B31] rounded-3xl border border-[#223955] p-6 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#10223A] text-2xl flex items-center justify-center mx-auto mb-3">
            🔍
          </div>
          <h3 className="text-base font-bold text-white">No specialists found</h3>
          <p className="text-xs text-[#A9B9D0] mt-1">Try another category or clear your search/sort filters.</p>
          <button
            onClick={() => { 
              setSelectedCategory(null); 
              setSearchQuery('');
              setSortBy('rating');
              setOnlyVerified(false);
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-2 bg-[#2878FF] hover:bg-[#1B66E5] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default NearbyWorkers;
