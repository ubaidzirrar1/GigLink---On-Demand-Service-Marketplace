
import { Worker } from '../../types';

export interface BeltTier {
  name: string;
  belt: string;
  color: string;
  borderColor: string;
  minJobs: number;
  minRating: number;
}

export const BELT_TIERS: BeltTier[] = [
  { name: 'Black Belt', belt: '⚫', color: 'bg-slate-900', borderColor: 'border-slate-800', minJobs: 100, minRating: 4.9 },
  { name: 'Brown Belt', belt: '🟤', color: 'bg-amber-900', borderColor: 'border-amber-800', minJobs: 50, minRating: 4.8 },
  { name: 'Green Belt', belt: '🟢', color: 'bg-emerald-600', borderColor: 'border-emerald-500', minJobs: 25, minRating: 4.7 },
  { name: 'Yellow Belt', belt: '🟡', color: 'bg-yellow-400', borderColor: 'border-yellow-300', minJobs: 10, minRating: 4.6 },
  { name: 'White Belt', belt: '⚪', color: 'bg-slate-100', borderColor: 'border-slate-200', minJobs: 0, minRating: 0 },
];

export const getWorkerMastery = (worker: Worker): BeltTier => {
  const { completedProjects, rating } = worker;
  return BELT_TIERS.find(t => completedProjects >= t.minJobs && rating >= t.minRating) || BELT_TIERS[BELT_TIERS.length - 1];
};
