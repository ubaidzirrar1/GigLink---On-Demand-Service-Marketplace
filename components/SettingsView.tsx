
import React, { useState } from 'react';
import { Worker, UserRole } from '../types';

interface SettingsViewProps {
  user: Worker;
  role: UserRole;
  onUpdate: (updated: Worker) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, role, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    mobile: user.mobile || '',
    cnic: user.cnic || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time password match logic
  const passwordsMatch = formData.newPassword !== '' && formData.newPassword === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword;

  // CNIC Masking Logic: 00000-0000000-0
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    
    let masked = value;
    if (value.length > 5 && value.length <= 12) {
      masked = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      masked = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
    }
    setFormData({ ...formData, cnic: masked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Verification Logic
    if (formData.currentPassword || formData.newPassword) {
      // Use the actual password from props, or fallback to the standard mock password
      // This ensures verification works even if the field was previously missing
      const userPassword = user.password || 'password123';
      
      if (formData.currentPassword !== userPassword) {
        newErrors.currentPassword = 'current password is incorrect';
      }
      
      if (!formData.newPassword || formData.newPassword.length < 8) {
        newErrors.newPassword = 'password must be at least 8 characters';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'passwords do not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    // Success Action
    const updatedWorker: Worker = {
      ...user,
      name: formData.name,
      mobile: formData.mobile,
      cnic: formData.cnic,
      password: formData.newPassword || user.password,
    };

    onUpdate(updatedWorker);
    setFieldErrors({});
    setIsSuccess(true);
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));

    // Scroll to top to see alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500 pb-32 relative">
      
      {/* Centered Top Alert */}
      {isSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center space-x-3 animate-in slide-in-from-top-10 duration-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span className="font-black text-sm uppercase tracking-widest">profile change successfully!</span>
          </div>
        </div>
      )}

      {/* Role Indicator */}
      <div className="mb-8 flex items-center justify-between bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${role === UserRole.WORKER ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {role === UserRole.WORKER ? '🛠️' : '🤝'}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Account Settings</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role} Profile Control</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-all">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <span className="mr-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">👤</span>
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
              <input 
                type="tel" 
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 dark:text-white"
                placeholder="0300-0000000"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">CNIC (National ID)</label>
              <input 
                type="text" 
                value={formData.cnic}
                onChange={handleCnicChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 focus:border-indigo-500 transition-all outline-none font-bold tracking-[0.2em] text-slate-800 dark:text-white"
                placeholder="00000-0000000-0"
              />
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-all">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <span className="mr-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">🔒</span>
            Security Credentials
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
              <input 
                type="password" 
                value={formData.currentPassword}
                onChange={(e) => {
                    setFormData({...formData, currentPassword: e.target.value});
                    if(fieldErrors.currentPassword) setFieldErrors({...fieldErrors, currentPassword: ''});
                }}
                className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 transition-all outline-none font-bold text-slate-800 dark:text-white ${fieldErrors.currentPassword ? 'border-red-500' : 'border-slate-50 dark:border-slate-800 focus:border-indigo-500'}`}
                placeholder="Enter current password"
              />
              {fieldErrors.currentPassword && (
                <p className="text-[11px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-2">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password" 
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 transition-all outline-none font-bold text-slate-800 dark:text-white ${passwordsMatch ? 'border-indigo-500 shadow-sm shadow-indigo-100' : passwordsMismatch ? 'border-red-500' : 'border-slate-50 dark:border-slate-800 focus:border-indigo-500'}`}
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 transition-all outline-none font-bold text-slate-800 dark:text-white ${passwordsMatch ? 'border-indigo-500 shadow-sm shadow-indigo-100' : passwordsMismatch ? 'border-red-500' : 'border-slate-50 dark:border-slate-800 focus:border-indigo-500'}`}
                  placeholder="Re-type new password"
                />
              </div>
            </div>
            
            {(passwordsMismatch || passwordsMatch) && (
                <div className="flex items-center space-x-2 ml-1 animate-in fade-in slide-in-from-top-2">
                    <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-indigo-500' : 'bg-red-500'}`}></div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${passwordsMatch ? 'text-indigo-600' : 'text-red-500'}`}>
                        {passwordsMatch ? 'Passwords are a match' : 'Passwords do not match yet'}
                    </p>
                </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-2xl active:scale-[0.98] transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 group"
          >
            <span>Update Profile</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsView;
