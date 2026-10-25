
import React, { useState, useRef } from 'react';
import { UserRole, Worker } from '../types';
import { getStoredUsers, saveUser } from '../lib/storage';
import { MOCK_WORKERS } from '../constants';

interface AuthUIProps {
  onLoginSuccess: (role: UserRole, emailVerified: boolean, user: Worker) => void;
  onCancel?: () => void;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'RESET_SUCCESS' | 'NEW_PASSWORD' | 'EMAIL_VERIFICATION';

const AuthUI: React.FC<AuthUIProps> = ({ onLoginSuccess, onCancel }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [signupStep, setSignupStep] = useState(1);
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.CLIENT);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idCard: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    skills: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    
    await new Promise(r => setTimeout(r, 1000));
    
    const localUsers = getStoredUsers();
    const allUsers = [...localUsers, ...MOCK_WORKERS];
    
    const userFound = allUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (!userFound) {
      setIsLoading(false);
      setErrors({ email: 'No account found with this email address.' });
      return;
    }

    const validPassword = userFound.password || 'password123';
    
    if (formData.password === validPassword) {
      setIsLoading(false);
      // BUG FIX: Removed destructuring that was stripping the password field
      // This ensures SettingsView can verify the "Current Password"
      onLoginSuccess(authRole, true, userFound as Worker);
    } else {
      setIsLoading(false);
      setErrors({ password: 'The password you entered is incorrect.' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
        setErrors(prev => ({ ...prev, avatar: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    setErrors({});
    if (signupStep === 1) {
      if (!formData.avatar) return setErrors({ avatar: 'Profile photo is required' });
      if (!formData.name) return setErrors({ name: 'Name is required' });
      if (!validateEmail(formData.email)) return setErrors({ email: 'Invalid email' });
      
      const localUsers = getStoredUsers();
      const allUsers = [...localUsers, ...MOCK_WORKERS];
      if (allUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        return setErrors({ email: 'This email is already registered.' });
      }

      setSignupStep(2);
      return;
    }

    if (signupStep === 2) {
      if (formData.password.length < 8) return setErrors({ password: 'Min 8 characters required' });
      if (formData.password !== formData.confirmPassword) return setErrors({ confirm: 'Passwords do not match' });
      setSignupStep(3);
      return;
    }

    if (signupStep === 3) {
      if (authRole === UserRole.WORKER) {
        setSignupStep(4);
      } else {
        setView('EMAIL_VERIFICATION');
      }
      return;
    }

    if (signupStep === 4) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      setIsLoading(false);
      setView('EMAIL_VERIFICATION');
    }
  };

  const simulateEmailVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: Worker = {
        id: `u_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rating: 0,
        reviews: 0,
        completedProjects: 0,
        isVerified: false,
        isEmailVerified: true,
        isAvailable: true,
        distance: '0 km',
        specialties: authRole === UserRole.WORKER ? ['Service Provider'] : ['Client'],
        avatar: formData.avatar || `https://i.pravatar.cc/150?u=${formData.email}`,
        hourlyRate: 0,
        skills: formData.skills
      };
      saveUser(newUser);
      setIsLoading(false);
      // BUG FIX: Pass the full user object including password for session use
      onLoginSuccess(authRole, true, newUser as Worker);
    }, 1500);
  };

  const renderProgress = () => {
    const totalSteps = authRole === UserRole.WORKER ? 4 : 3;
    const progress = (signupStep / totalSteps) * 100;
    return (
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  const renderLogin = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end mb-4">
        {onCancel && (
          <button onClick={onCancel} className="p-2 -mr-2 text-slate-300 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
          <span className="text-white text-3xl font-black">G</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Welcome Back</h2>
        <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Secure Entry</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8 border border-slate-200 dark:border-slate-700 shadow-inner">
        <button 
          onClick={() => setAuthRole(UserRole.CLIENT)}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${authRole === UserRole.CLIENT ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
        >
          Client
        </button>
        <button 
          onClick={() => setAuthRole(UserRole.WORKER)}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${authRole === UserRole.WORKER ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
        >
          Worker
        </button>
      </div>

      <div className="space-y-4">
        <AuthInput 
          label="Email Address" 
          type="email" 
          placeholder="name@example.com" 
          value={formData.email}
          onChange={(v) => setFormData({...formData, email: v})}
          error={errors.email}
        />
        <AuthInput 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={(v) => setFormData({...formData, password: v})}
          error={errors.password}
        />
      </div>

      <div className="flex items-center justify-between mt-6 px-1">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600" 
          />
          <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-tight">Remember Me</span>
        </label>
        <button 
          onClick={() => setView('FORGOT_PASSWORD')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
        >
          Forgot?
        </button>
      </div>

      <button 
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full mt-10 bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center space-x-2 mb-6"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <p className="text-center mt-4 mb-8 text-sm text-slate-500 font-medium pb-4">
        New to GigLink? {' '}
        <button onClick={() => setView('SIGNUP')} className="text-indigo-600 font-black hover:underline">Create Account</button>
      </p>
    </div>
  );

  const renderSignup = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <button onClick={() => view === 'SIGNUP' && signupStep === 1 ? setView('LOGIN') : setSignupStep(s => s - 1)} className="text-slate-400 mb-6 flex items-center space-x-2 font-bold uppercase text-[10px] tracking-widest">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
          {signupStep === 1 ? 'Identity' : signupStep === 2 ? 'Security' : signupStep === 3 ? 'Role' : 'Professional Profile'}
        </h2>
        <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Step {signupStep} of {authRole === UserRole.WORKER ? 4 : 3}</p>
      </div>

      {renderProgress()}

      {signupStep === 1 && (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all shadow-lg ${formData.avatar ? 'border-indigo-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'}`}
            >
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar Preview" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span className="text-[9px] font-black uppercase">Add Photo</span>
                </div>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {errors.avatar && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.avatar}</p>}
          </div>

          <div className="space-y-4">
            <AuthInput 
              label="Full Name" 
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={(v) => setFormData({...formData, name: v})}
              error={errors.name}
            />
            <AuthInput 
              label="Email" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(v) => setFormData({...formData, email: v})}
              error={errors.email}
            />
          </div>
        </div>
      )}

      {signupStep === 2 && (
        <div className="space-y-4">
          <AuthInput 
            label="ID Card No. (Optional)" 
            type="text" 
            placeholder="XXXXX-XXXXXXX-X" 
            value={formData.idCard}
            onChange={(v) => setFormData({...formData, idCard: v})}
          />
          <AuthInput 
            label="Password" 
            type="password" 
            placeholder="Min 8 characters" 
            value={formData.password}
            onChange={(v) => setFormData({...formData, password: v})}
            error={errors.password}
          />
          <AuthInput 
            label="Confirm Password" 
            type="password" 
            placeholder="Re-type password" 
            value={formData.confirmPassword}
            onChange={(v) => setFormData({...formData, confirmPassword: v})}
            error={errors.confirm}
          />
        </div>
      )}

      {signupStep === 3 && (
        <div className="space-y-4">
          <button 
            onClick={() => setAuthRole(UserRole.CLIENT)}
            className={`w-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all flex items-center space-x-4 ${authRole === UserRole.CLIENT ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xl sm:text-2xl shrink-0">🤝</div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs sm:text-sm tracking-tight">I want to Hire</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Post jobs and find talent</p>
            </div>
          </button>
          <button 
            onClick={() => setAuthRole(UserRole.WORKER)}
            className={`w-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all flex items-center space-x-4 ${authRole === UserRole.WORKER ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xl sm:text-2xl shrink-0">🛠️</div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs sm:text-sm tracking-tight">I want to Work</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Provide services and earn</p>
            </div>
          </button>
        </div>
      )}

      {signupStep === 4 && (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skills & Portfolio Link</label>
            <textarea 
              rows={4}
              className="w-full p-5 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-sm font-medium shadow-inner text-slate-800 dark:text-white"
              placeholder="List your expertise... (e.g. Master Plumber, Electrician)"
              onChange={(e) => setFormData({...formData, skills: e.target.value.split(',')})}
            />
          </div>
        </div>
      )}

      <button 
        onClick={handleSignup}
        disabled={isLoading}
        className="w-full mt-10 mb-12 bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        {isLoading ? 'Processing...' : signupStep === (authRole === UserRole.WORKER ? 4 : 3) ? 'Finalize Registration' : 'Continue'}
      </button>
    </div>
  );

  const renderEmailVerification = () => (
    <div className="text-center animate-in zoom-in-95 duration-500 py-8 sm:py-0">
      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Verify Email</h2>
      <p className="text-slate-400 font-medium mt-4 max-w-xs mx-auto">We sent a verification link to <span className="text-indigo-600 font-bold">{formData.email}</span>. Click it to activate your account.</p>
      
      <button 
        onClick={simulateEmailVerify}
        disabled={isLoading}
        className="w-full mt-12 bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        {isLoading ? 'Checking...' : 'I\'ve Verified My Email'}
      </button>

      <button className="mt-6 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Resend Verification Email</button>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <button onClick={() => setView('LOGIN')} className="text-slate-400 mb-6 flex items-center space-x-2 font-bold uppercase text-[10px] tracking-widest">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          <span>Return</span>
        </button>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Forgot Password</h2>
        <p className="text-slate-400 font-bold text-sm mt-2">Enter your email for a recovery link.</p>
      </div>

      <AuthInput label="Email Address" type="email" placeholder="name@example.com" />

      <button 
        onClick={() => setView('RESET_SUCCESS')}
        className="w-full mt-10 mb-12 bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        Send Instructions
      </button>
    </div>
  );

  const renderResetSuccess = () => (
    <div className="text-center animate-in zoom-in-95 duration-500 py-8 sm:py-0">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Reset Link Sent</h2>
      <p className="text-slate-400 font-medium mt-4 max-w-xs mx-auto">Check your inbox for password recovery instructions.</p>
      
      <button 
        onClick={() => setView('NEW_PASSWORD')}
        className="w-full mt-12 bg-slate-900 dark:bg-slate-700 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest mb-12"
      >
        Set New Password
      </button>
    </div>
  );

  const renderNewPassword = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Secure Account</h2>
        <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Define New Credentials</p>
      </div>

      <div className="space-y-4">
        <AuthInput label="New Password" type="password" placeholder="••••••••" />
        <AuthInput label="Confirm New Password" type="password" placeholder="••••••••" />
      </div>

      <button 
        onClick={() => setView('LOGIN')}
        className="w-full mt-10 mb-12 bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        Save and Login
      </button>
    </div>
  );

  return (
    <div className="min-h-full bg-white dark:bg-slate-900 sm:bg-[#fbfcff] dark:sm:bg-slate-950 flex flex-col justify-start sm:justify-center px-4 sm:px-6 py-6 sm:py-12">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 sm:p-10 md:p-12 sm:rounded-[40px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.03)] sm:border sm:border-slate-50 dark:sm:border-slate-800 pb-20 sm:pb-12">
        {view === 'LOGIN' && renderLogin()}
        {view === 'SIGNUP' && renderSignup()}
        {view === 'EMAIL_VERIFICATION' && renderEmailVerification()}
        {view === 'FORGOT_PASSWORD' && renderForgotPassword()}
        {view === 'RESET_SUCCESS' && renderResetSuccess()}
        {view === 'NEW_PASSWORD' && renderNewPassword()}
      </div>
    </div>
  );
};

const AuthInput: React.FC<{label: string, type: string, placeholder: string, value?: string, onChange?: (v: string) => void, error?: string}> = ({ label, type, placeholder, value, onChange, error }) => (
  <div className="space-y-1.5 sm:space-y-2">
    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-4 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 transition-all outline-none font-bold text-slate-800 dark:text-white shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-600 ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-slate-50 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700'}`}
    />
    {error && <p className="text-[10px] font-bold text-red-500 ml-2 uppercase">{error}</p>}
  </div>
);

export default AuthUI;
