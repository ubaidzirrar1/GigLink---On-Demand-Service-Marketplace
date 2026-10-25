
import React from 'react';

interface PortfolioModalProps {
  imageUrl: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  totalCount?: number;
  currentIndex?: number;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ 
  imageUrl, 
  onClose, 
  onNext, 
  onPrev, 
  totalCount, 
  currentIndex 
}) => {
  return (
    <div 
      className="fixed inset-0 bg-slate-900/98 z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white z-[110]">
        <div className="text-xs font-bold tracking-widest uppercase opacity-60">
          Project {currentIndex !== undefined ? currentIndex + 1 : 1} / {totalCount || 1}
        </div>
        <button 
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Navigation Controls */}
      {onPrev && (
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-[110]"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
      )}
      
      {onNext && (
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-[110]"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Image Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-black flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} className="w-full h-full object-contain" alt="" />
      </div>

      {/* Footer Dots (Simplified) */}
      <div className="mt-8 flex justify-center space-x-2 animate-in slide-in-from-bottom duration-500">
        {Array.from({ length: totalCount || 0 }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

export default PortfolioModal;
