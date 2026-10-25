
import React, { useState, useMemo } from 'react';
import { MOCK_WORKERS, CATEGORIES } from '../constants';
import { getWorkerLevel } from '../lib/workerUtils';
import { calculateDistance } from '../lib/geoUtils';
import WorkerMapView from './WorkerMapView';
import CategoryIcon from './CategoryIcon';

interface WorkerSearchProps {
  onViewWorker: (workerId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const WorkerSearch: React.FC<WorkerSearchProps> = ({ onViewWorker, userLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Default 50km
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setIsAvailableOnly(false);
    setMaxDistance(50);
  };

  const quickFilters = ['Near Me', 'Top Rated', 'Verified'];
  const priceFilters = ['Under $30', '$30 - $60', '$60+'];
  const specialtyFilters = CATEGORIES.map(c => c.name);

  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter(worker => {
      // Available Only Filter
      if (isAvailableOnly && !worker.isAvailable) return false;
      
      // Search Text Filter
      const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           worker.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
      
      // Distance Filter (Customizable)
      if (userLocation && worker.location) {
        const dist = calculateDistance(userLocation, worker.location);
        if (dist > maxDistance) return false;
      }

      // Metadata Filters
      if (activeFilters.includes('Verified') && !worker.isVerified) return false;
      if (activeFilters.includes('Top Rated') && worker.rating < 4.8) return false;
      if (activeFilters.includes('Near Me') && userLocation && worker.location) {
        if (calculateDistance(userLocation, worker.location) > 5) return false; // "Near Me" as 5km
      }
      
      // Price Filters
      if (activeFilters.includes('Under $30') && worker.hourlyRate >= 30) return false;
      if (activeFilters.includes('$30 - $60') && (worker.hourlyRate < 30 || worker.hourlyRate > 60)) return false;
      if (activeFilters.includes('$60+') && worker.hourlyRate < 60) return false;
      
      // Category Specialty Filters
      const specialtyActive = activeFilters.filter(f => specialtyFilters.includes(f));
      if (specialtyActive.length > 0 && !specialtyActive.some(s => worker.specialties.includes(s))) return false;
      
      return true;
    });
  }, [searchQuery, activeFilters, isAvailableOnly, maxDistance, userLocation]);

  const FilterPill = ({ label, icon, active }: { label: string, icon?: React.ReactNode, active?: boolean }) => {
    return (
      <button 
        onClick={() => toggleFilter(label)}
        className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all text-[13px] font-bold flex items-center space-x-2 ${
          active 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const hasActiveFilters = activeFilters.length > 0 || searchQuery !== '' || isAvailableOnly || maxDistance < 50;

  return (
    <div className="bg-[#fbfcff] dark:bg-slate-900 min-h-screen">
      <div className="sticky top-[60px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 border-b border-slate-100 dark:border-slate-800">
        <div className="p-4 space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium text-slate-700 dark:text-slate-200"
                />
              </div>
              
              <button 
                onClick={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-95 ${
                  viewMode === 'MAP' 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {viewMode === 'LIST' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">{viewMode === 'LIST' ? 'Map View' : 'List View'}</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-lg shadow-sm">⚡</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Available Now</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Experts ready immediately</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAvailableOnly(!isAvailableOnly)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-indigo-500 ${isAvailableOnly ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailableOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-lg shadow-sm">📍</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Radius: <span className="text-emerald-600 dark:text-emerald-400 font-black">{maxDistance}km</span></h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Working range filter</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRadiusSlider(!showRadiusSlider)}
                  className={`p-2 rounded-xl transition-all ${showRadiusSlider ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 shadow-sm'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                </button>
              </div>
            </div>

            {showRadiusSlider && (
              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-inner animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Distance Range</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{maxDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="flex-shrink-0 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center space-x-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  <span>Clear All</span>
                </button>
              )}
              
              {CATEGORIES.map(cat => {
                const isActive = activeFilters.includes(cat.name);
                return (
                  <FilterPill 
                    key={cat.id} 
                    label={cat.name} 
                    icon={<CategoryIcon name={cat.name} size={16} className={isActive ? 'text-white' : 'text-sky-500'} />} 
                    active={isActive} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'LIST' ? (
        <div className="p-4 space-y-4 max-w-7xl mx-auto pb-24">
          {filteredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkers.map(worker => {
                const level = getWorkerLevel(worker);
                let realDist = worker.distance;
                if (userLocation && worker.location) {
                  realDist = `${calculateDistance(userLocation, worker.location).toFixed(1)} km`;
                }

                return (
                  <div key={worker.id} className="bg-white dark:bg-slate-800 rounded-[28px] p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
                    <div className="flex items-start space-x-4">
                      <div className="relative shrink-0">
                        <img src={worker.avatar} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700" alt={worker.name} />
                        {level.hasTick && (
                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-700 p-0.5 rounded-full shadow-md">
                            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1">
                              <h4 className="font-bold text-slate-800 dark:text-white truncate text-base">{worker.name}</h4>
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-tight">
                              <span className="text-indigo-600 dark:text-indigo-400">{worker.specialties[0]}</span>
                              <span>•</span>
                              <span>{realDist}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-900 dark:text-white font-extrabold text-base">${worker.hourlyRate}<span className="text-slate-400 dark:text-slate-500 font-normal text-xs">/hr</span></div>
                          </div>
                        </div>

                        <div className="flex items-center mt-3 space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${level.color}`}>
                            {level.name}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-amber-400 text-sm">★</span>
                            <span className="text-[13px] font-extrabold text-slate-700 dark:text-slate-200">{worker.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {worker.bio && (
                      <p className="mt-4 text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {worker.bio}
                      </p>
                    )}

                    <button 
                      onClick={() => onViewWorker(worker.id)}
                      className="w-full mt-5 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 text-[13px] font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 mx-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">No experts found</h3>
              <button onClick={clearAllFilters} className="mt-8 bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest">Clear All Filters</button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-220px)] w-full">
          <WorkerMapView isVerified={true} />
        </div>
      )}
    </div>
  );
};

export default WorkerSearch;
