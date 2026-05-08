import React, { useState } from 'react';

const LOGO = (
  <div className="flex items-center gap-2.5 px-5 py-4 mb-2">
    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-600/30">
      <span className="text-white font-black text-sm">N</span>
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900 leading-none">NMIT Colloquium</p>
      <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Admin Portal</p>
    </div>
  </div>
);

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Upload PDF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/>
        <polyline points="9 15 12 12 15 15"/>
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'files',
    label: 'File Manager',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/><polyline points="10 2 10 10 13 7 16 10 16 2"/>
      </svg>
    ),
  },
  {
    id: 'logs',
    label: 'Activity Logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
      </svg>
    ),
  },
];

export default function Sidebar({ setPage, currentPage, onLogout }) {
  return (
    <aside className="w-60 h-screen bg-card border-r border-border-main flex flex-col py-3 shrink-0 transition-colors">
        <div className="flex items-center gap-2.5 px-5 py-4 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-600/30">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <div>
            <p className="text-sm font-bold text-text-main leading-none">NMIT Colloquium</p>
            <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`nav-item w-full text-left ${currentPage === item.id ? 'nav-item-active' : ''}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-3 border-t border-border-main pt-3">
          <button
            onClick={onLogout}
            className="nav-item w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>
    );
}