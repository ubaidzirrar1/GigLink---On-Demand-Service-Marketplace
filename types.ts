
export enum UserRole {
  CLIENT = 'CLIENT',
  WORKER = 'WORKER',
  UNDECIDED = 'UNDECIDED'
}

export enum AppTab {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  MY_JOBS = 'MY_JOBS',
  SAVED = 'SAVED',
  FOR_PROS = 'FOR_PROS',
  ABOUT = 'ABOUT',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  column?: number;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  password?: string;
  isSaved?: boolean;
  rating: number;
  reviews: number;
  completedProjects: number;
  isVerified: boolean;
  isEmailVerified: boolean;
  isAvailable: boolean;
  distance: string;
  location?: { lat: number; lng: number };
  formattedAddress?: string; // e.g., "PK, Punjab, Lahore"
  preferredRadius?: number;
  specialties: string[];
  avatar: string;
  hourlyRate: number;
  bio?: string;
  skills?: string[];
  portfolio?: string[];
  lastLoginAt?: string;
  mobile?: string;
  cnic?: string;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  date: string;
  budget: number;
  distance?: string;
  location?: { lat: number; lng: number };
  description?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Notification {
  id: string;
  type: 'JOB_ALERT' | 'BID_RECEIVED' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AppState {
  role: UserRole;
  currentTab: AppTab;
  isSidebarOpen: boolean;
}
