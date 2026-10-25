
import React, { useState } from 'react';

interface AvailabilityCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  // Mock availability: Weekends are busy, weekdays are available
  const isAvailable = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Mon-Fri available
  };

  const handleDayClick = (day: number) => {
    if (isAvailable(day)) {
      onDateSelect(new Date(year, month, day));
    }
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{monthName} {year}</h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => (
          <div key={`blank-${b}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const available = isAvailable(day);
          const selected = isSelected(day);
          const today = isToday(day);
          
          return (
            <button
              key={day}
              disabled={!available}
              onClick={() => handleDayClick(day)}
              className={`
                relative aspect-square rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center
                ${!available ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-indigo-50'}
                ${selected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105 z-10' : 'text-slate-700'}
                ${today && !selected ? 'text-indigo-600' : ''}
              `}
            >
              {day}
              {available && !selected && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-emerald-400 rounded-full"></div>
              )}
              {today && !selected && (
                <div className="absolute top-1 text-[8px] font-black uppercase tracking-tighter text-indigo-400">Today</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
