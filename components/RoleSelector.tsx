
import React from 'react';
import { UserRole } from '../types';

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col justify-center items-center text-center">
      <div className="mb-10">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
          <span className="text-white text-4xl font-bold">G</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to GigLink</h1>
        <p className="text-slate-500 mt-2">Connect with skill. Get things done.</p>
      </div>

      <div className="w-full space-y-4 max-w-sm">
        <button 
          onClick={() => onSelect(UserRole.CLIENT)}
          className="group relative w-full p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">I want to Hire</h3>
              <p className="text-sm text-slate-500">I need help with a project or task</p>
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <button 
          onClick={() => onSelect(UserRole.WORKER)}
          className="group relative w-full p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <span className="text-2xl">🛠️</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">I want to Work</h3>
              <p className="text-sm text-slate-500">I want to offer my services</p>
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-400">By continuing, you agree to our Terms and Privacy Policy.</p>
    </div>
  );
};

export default RoleSelector;
