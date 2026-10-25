
import React, { useState } from 'react';

interface ReviewFormProps {
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center animate-in zoom-in-95 duration-200 shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Confetti-like decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-indigo-600"></div>
        
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
          🎉
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Job Completed!</h2>
        <p className="text-sm font-medium text-slate-400 mb-8 px-4">How would you rate your experience with the service?</p>
        
        <div className="flex justify-center space-x-2 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className={`text-5xl transition-all duration-300 drop-shadow-sm ${
                star <= (hover || rating) 
                  ? 'text-yellow-400 scale-125 rotate-6' 
                  : 'text-slate-100 hover:text-slate-200 scale-100'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <textarea 
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all focus:bg-white shadow-inner resize-none"
            placeholder="Tell us what you liked (or didn't like)..."
          />
          <span className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 uppercase">Optional</span>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
          >
            Later
          </button>
          <button 
            onClick={onClose}
            disabled={rating === 0}
            className={`flex-[2.5] py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${
              rating > 0 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 active:scale-95' 
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
