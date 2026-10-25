
import { Worker, UserRole, Job } from '../types';

// Storage Versioning
const STORAGE_VERSION = '3'; // Increment this when changing schemas
const VERSION_KEY = 'giglink_app_version';

const AUTH_KEY = 'giglink_session_v3';
const USERS_KEY = 'giglink_users_v3';
const JOBS_KEY = 'giglink_jobs_v3';
const BACKUP_KEY = 'giglink_data_backup';

export interface AuthSession {
  isLoggedIn: boolean;
  role: UserRole;
  user: Worker;
  isEmailVerified: boolean;
}

/**
 * Robust JSON parsing with error handling
 */
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Storage corruption detected for key: ${key}. Attempting recovery...`);
    // Integrity check: if data exists but is corrupt, move to backup before clearing
    const raw = localStorage.getItem(key);
    if (raw) localStorage.setItem(`${key}_corrupt_${Date.now()}`, raw);
    return fallback;
  }
};

/**
 * Migration Logic: Handles data transformation between app versions
 */
export const runMigrations = () => {
  const currentVersion = localStorage.getItem(VERSION_KEY) || '2';
  
  if (currentVersion === STORAGE_VERSION) return;

  console.log(`Migrating data from v${currentVersion} to v${STORAGE_VERSION}...`);

  // Migration from v2 to v3 (Example: Moving keys and adding metadata)
  if (currentVersion === '2') {
    const v2Session = safeParse('giglink_session_v2', null);
    const v2Users = safeParse('giglink_users_v2', []);
    const v2Jobs = safeParse('giglink_jobs_v2', []);

    if (v2Session) localStorage.setItem(AUTH_KEY, JSON.stringify(v2Session));
    if (v2Users.length > 0) localStorage.setItem(USERS_KEY, JSON.stringify(v2Users));
    if (v2Jobs.length > 0) localStorage.setItem(JOBS_KEY, JSON.stringify(v2Jobs));
    
    // Create an initial backup after migration
    createBackup();
  }

  localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  console.log('Migration complete.');
};

/**
 * Data Integrity: Creates a snapshot of all critical application data
 */
export const createBackup = () => {
  const data = {
    session: localStorage.getItem(AUTH_KEY),
    users: localStorage.getItem(USERS_KEY),
    jobs: localStorage.getItem(JOBS_KEY),
    timestamp: new Date().toISOString(),
    version: STORAGE_VERSION
  };
  localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
};

// --- Session Management ---
export const getSession = (): AuthSession | null => {
  return safeParse<AuthSession | null>(AUTH_KEY, null);
};

export const saveSession = (session: AuthSession) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    // Auto-sync user to users database
    saveUser(session.user);
  } catch (e) {
    console.error("Failed to save session", e);
  }
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY);
};

// --- User Profile Management ---
export const getStoredUsers = (): Worker[] => {
  return safeParse<Worker[]>(USERS_KEY, []);
};

export const getUserByEmail = (email: string): Worker | null => {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const saveUser = (user: Worker) => {
  try {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    
    // Prevent profile corruption: ensure required fields exist
    const sanitizedUser = {
      ...user,
      lastLoginAt: user.lastLoginAt || new Date().toISOString()
    };

    if (index >= 0) {
      users[index] = { ...users[index], ...sanitizedUser };
    } else {
      users.push(sanitizedUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save user", e);
  }
};

// --- Job Persistence ---
export const getStoredJobs = (): Job[] => {
  return safeParse<Job[]>(JOBS_KEY, []);
};

export const saveJob = (job: Job) => {
  try {
    const jobs = getStoredJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error("Failed to save job", e);
  }
};

export const deleteJob = (jobId: string) => {
  try {
    const jobs = getStoredJobs();
    const filtered = jobs.filter(j => j.id !== jobId);
    localStorage.setItem(JOBS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete job", e);
  }
};

// --- Favorite Workers Persistence ---
const FAVORITES_KEY = 'giglink_favorites_v1';

export const getFavoriteWorkers = (): string[] => {
  return safeParse<string[]>(FAVORITES_KEY, ['w1']);
};

export const toggleFavoriteWorker = (workerId: string): string[] => {
  try {
    const favs = getFavoriteWorkers();
    const exists = favs.includes(workerId);
    const updated = exists ? favs.filter(id => id !== workerId) : [...favs, workerId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to toggle favorite", e);
    return [];
  }
};

export const isWorkerFavorite = (workerId: string): boolean => {
  return getFavoriteWorkers().includes(workerId);
};
