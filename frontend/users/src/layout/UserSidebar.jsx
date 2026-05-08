import React from 'react';

const icons = {
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  message: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  user: (
    <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-[12px] font-black text-white shadow-xl shadow-indigo-600/20">S</div>
  ),
  more: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  ),
  archive: (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  )
};

export default function UserSidebar({ onNewChat, onLogout }) {
  const history = [
    { id: 1, title: 'AI in Healthcare extraction', time: 'Today' },
    { id: 2, title: 'Colloquium Schedule Q3', time: 'Yesterday' },
    { id: 3, title: 'Quantum Computing Abstract', time: 'Yesterday' },
    { id: 4, title: 'Department of ISE events', time: 'Last Week' },
  ];

  return (
    <div className="w-80 bg-white/40 backdrop-blur-3xl h-screen flex flex-col px-6 py-8 text-slate-600 border-r border-indigo-50/50 shadow-[20px_0_40px_rgba(79,70,229,0.02)] transition-all duration-300 shrink-0">
      
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-2 py-4 mb-10">
         <div className="w-10 h-10 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-600/10">N</div>
         <div>
            <span className="font-black text-slate-900 text-lg tracking-tight leading-none block">Discovery Hub</span>
            <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1 block">Zenith Node</span>
         </div>
      </div>

      {/* Primary Action */}
      <button 
        onClick={onNewChat}
        className="flex items-center justify-between w-full p-4 bg-indigo-600 text-white rounded-[1.75rem] font-black text-sm hover:bg-slate-900 hover:scale-[0.98] active:scale-[0.96] transition-all duration-300 shadow-2xl shadow-indigo-600/20 group mb-12"
      >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                {icons.plus}
            </div>
            New Research
        </div>
        <kbd className="hidden lg:block text-[9px] bg-white/20 px-2 py-1 rounded-lg text-white font-black opacity-60">⌘N</kbd>
      </button>

      {/* History List - Spaced & Floating */}
      <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar px-1">
        
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-3 mb-6">Neural Registry</p>
            {history.map((item) => (
            <button 
                key={item.id}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 text-left truncate group border border-transparent hover:border-indigo-50"
            >
                <span className="text-slate-200 group-hover:text-indigo-400 shrink-0">{icons.message}</span>
                <span className="truncate flex-1 tracking-tight">{item.title}</span>
                <span className="text-[9px] text-slate-300 font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter whitespace-nowrap">{item.time}</span>
            </button>
            ))}
        </div>

        <div className="space-y-3 pt-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-3 mb-6">Deep Archives</p>
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[13px] font-bold text-slate-300 hover:text-slate-600 transition-all text-left group">
                <span className="shrink-0">{icons.archive}</span>
                Encrypted Vaults
            </button>
        </div>
      </div>

      {/* Profile & Controls */}
      <div className="mt-auto pt-8 px-1 pb-4 border-t border-indigo-50/50">
        <div className="flex items-center gap-4 px-4 py-4 bg-slate-50/50 hover:bg-white rounded-3xl transition-all duration-500 cursor-pointer group mb-6 border border-transparent hover:border-indigo-50 hover:shadow-2xl hover:shadow-indigo-600/5">
            {icons.user}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate mb-1">Prajwal M</p>
                <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest leading-none">Engineering Student</p>
            </div>
            <span className="text-slate-300 group-hover:text-slate-900 transition-transform group-hover:rotate-90">{icons.more}</span>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => window.speechSynthesis.cancel()}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-red-500 hover:border-red-100 transition-all duration-300 shadow-sm"
            >
                Silence
            </button>
            <button 
                onClick={onLogout}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-red-500 hover:border-red-100 transition-all duration-300 shadow-sm"
            >
                Exit
            </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
