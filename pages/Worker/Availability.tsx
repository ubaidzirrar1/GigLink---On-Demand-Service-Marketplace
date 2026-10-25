
import React, { useState } from 'react';
import AvailabilityCalendar from '../../components/AvailabilityCalendar';

const Availability: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-black text-slate-900 leading-tight">My Availability</h2>
      <AvailabilityCalendar 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />
      {selectedDate && (
        <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 animate-in slide-in-from-bottom duration-300">
           <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Selected Date</p>
           <p className="text-lg font-black text-slate-800 mt-1">{selectedDate.toDateString()}</p>
           <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Set as Busy</button>
        </div>
      )}
    </div>
  );
};

export default Availability;
