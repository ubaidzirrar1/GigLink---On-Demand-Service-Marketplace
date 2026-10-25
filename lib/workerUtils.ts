
import { Worker } from '../types';

export interface WorkerLevelInfo {
  name: string;
  color: string;
  textColor: string;
  hasTick: boolean;
  minProjects: number;
  minRating: number;
  nextTier?: {
    name: string;
    projectsNeeded: number;
    ratingNeeded: number;
  };
}

export const getWorkerLevel = (worker: Worker): WorkerLevelInfo => {
  const { completedProjects, rating } = worker;

  if (completedProjects >= 100 && rating >= 4.9) {
    return {
      name: 'Top Rated Expert',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      hasTick: true,
      minProjects: 100,
      minRating: 4.9
    };
  }
  
  if (completedProjects >= 50 && rating >= 4.8) {
    return {
      name: 'Pro Seller',
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      hasTick: false,
      minProjects: 50,
      minRating: 4.8,
      nextTier: {
        name: 'Top Rated Expert',
        projectsNeeded: 100,
        ratingNeeded: 4.9
      }
    };
  }

  if (completedProjects >= 10 && rating >= 4.7) {
    return {
      name: 'Verified Provider',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      hasTick: false,
      minProjects: 10,
      minRating: 4.7,
      nextTier: {
        name: 'Pro Seller',
        projectsNeeded: 50,
        ratingNeeded: 4.8
      }
    };
  }

  if (completedProjects >= 0 && rating >= 4.5) {
    return {
      name: 'New Seller',
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
      hasTick: false,
      minProjects: 0,
      minRating: 4.5,
      nextTier: {
        name: 'Verified Provider',
        projectsNeeded: 10,
        ratingNeeded: 4.7
      }
    };
  }

  return {
    name: 'Rising Talent',
    color: 'bg-slate-400',
    textColor: 'text-slate-400',
    hasTick: false,
    minProjects: 0,
    minRating: 0,
    nextTier: {
      name: 'New Seller',
      projectsNeeded: 5,
      ratingNeeded: 4.5
    }
  };
};
