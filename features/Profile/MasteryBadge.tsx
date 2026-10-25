
import React from 'react';
import { getWorkerMastery } from './workerUtils';
import { Worker } from '../../types';

export const MasteryBadge: React.FC<{ worker: Worker }> = ({ worker }) => {
  const mastery = getWorkerMastery(worker);
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border-2 ${mastery.color} ${mastery.borderColor} shadow-sm`}>
      <span className="text-lg">{mastery.belt}</span>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${mastery.name === 'White Belt' ? 'text-slate-400' : 'text-white'}`}>
        {mastery.name}
      </span>
    </div>
  );
};
