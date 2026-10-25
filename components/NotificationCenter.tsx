
import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';

const NotificationCenter: React.FC = () => {
  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
        <button className="text-xs font-bold text-indigo-600">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map(notif => (
          <div key={notif.id} className={`p-4 rounded-2xl border flex items-start space-x-4 ${notif.read ? 'bg-white border-slate-100' : 'bg-indigo-50/30 border-indigo-100'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              notif.type === 'JOB_ALERT' ? 'bg-orange-100 text-orange-600' :
              notif.type === 'BID_RECEIVED' ? 'bg-indigo-100 text-indigo-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {notif.type === 'JOB_ALERT' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
              {notif.type === 'BID_RECEIVED' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              {notif.type === 'SYSTEM' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
