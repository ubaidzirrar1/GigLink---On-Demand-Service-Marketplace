import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import CategoryIcon, { getCategoryTheme } from './CategoryIcon';

interface PopularProjectsProps {
  onSelectCategory?: (categoryName: string) => void;
  selectedCategory?: string | null;
}

export const PopularProjects: React.FC<PopularProjectsProps> = ({ 
  onSelectCategory,
  selectedCategory 
}) => {
  // Extract all 27 categories that belong to the 4 columns
  const columnCategories = CATEGORIES.filter(c => c.column !== undefined && c.column >= 1 && c.column <= 4);
  const displayCategories = columnCategories.length > 0 ? columnCategories : CATEGORIES.slice(0, 27);

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-14 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-[#223955]/60 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#2878FF] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2878FF]"></span>
            <span>Project Directory</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Popular projects</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#10223A] border border-[#223955] text-[#2878FF]">
              {displayCategories.length} Categories
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A9B9D0] mt-1 font-normal">
            Select any trade or project category below to filter verified specialists near you
          </p>
        </div>

        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory?.('')}
            className="text-xs text-[#2878FF] hover:text-[#5393FF] font-semibold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer bg-[#10223A] px-3 py-1.5 rounded-lg border border-[#223955]"
          >
            <span>Reset filter</span>
            <span className="text-sm font-bold leading-none">×</span>
          </button>
        )}
      </div>

      {/* Category Grid: 2 columns on mobile (grid-cols-2), 4 columns on desktop (lg:grid-cols-4) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayCategories.map((category, index) => {
          const isSelected = selectedCategory?.toLowerCase() === category.name.toLowerCase();
          const theme = getCategoryTheme(category.name);
          // On mobile, hide categories beyond the first 8 unless expanded
          const isHiddenOnMobile = index >= 8 && !isMobileExpanded;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory?.(category.name)}
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

      {/* Mobile 'View More' / 'View Less' Toggle Button */}
      {displayCategories.length > 8 && (
        <div className="flex sm:hidden justify-center mt-4">
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="w-full py-2.5 px-4 bg-[#10223A] hover:bg-[#162A45] border border-[#223955] hover:border-[#2878FF] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
          >
            <span>{isMobileExpanded ? 'View Less' : `View More (${displayCategories.length - 8} more)`}</span>
            <svg 
              className={`w-4 h-4 text-[#2878FF] transition-transform duration-200 ${isMobileExpanded ? 'rotate-180' : ''}`} 
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
  );
};

export default PopularProjects;

