
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CHAT } from '../constants';

interface ChatUIProps {
  contactName: string;
}

const ChatUI: React.FC<ChatUIProps> = ({ contactName }) => {
  const [messages, setMessages] = useState(MOCK_CHAT);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([...messages, {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: timeString,
      isMe: true
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 animate-in fade-in duration-500">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src="https://picsum.photos/seed/chat/100" className="w-10 h-10 rounded-2xl object-cover" alt="Contact" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{contactName}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active now</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        <div className="flex justify-center my-4">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full uppercase">Today</span>
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`group relative max-w-[85%] rounded-[24px] p-4 shadow-sm transition-all hover:shadow-md ${
              m.isMe 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
              <div className={`text-[9px] mt-2 font-bold uppercase tracking-tighter flex items-center justify-end space-x-1 ${
                m.isMe ? 'text-indigo-200' : 'text-slate-400'
              }`}>
                <span>{m.timestamp}</span>
                {m.isMe && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-end space-x-2 bg-slate-50 border border-slate-100 rounded-[28px] p-2 pl-4">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
          </button>
          <textarea 
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 outline-none resize-none max-h-32"
          />
          <button 
            onClick={send} 
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all active:scale-90 ${
              input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
