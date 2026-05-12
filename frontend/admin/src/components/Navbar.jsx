import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({ onMenuClick, search, setSearch, onLogout, currentPage, isDark, setIsDark }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (id) => {
    const map = {
      dashboard: 'Dashboard',
      upload: 'Upload Document',
      events: 'Events Management',
      analytics: 'Analytics',
      files: 'File Manager',
      logs: 'Activity Logs'
    };
    return map[id] || 'Admin';
  };

  return (
    <header className="h-16 bg-card border-b border-border-main px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-200">
      {/* Left: hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-icon"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-muted font-medium tracking-tight">Admin</span>
          <svg className="text-muted/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-tight">{getPageTitle(currentPage)}</span>
        </div>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-main border border-border-main rounded-xl px-3.5 py-2 w-64 group focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all ml-4">
          <svg className="text-muted shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="bg-transparent text-sm text-text-main placeholder:text-muted/70 outline-none w-full"
            placeholder="Quick Search..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="btn-icon"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border-main mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-main transition-colors group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-main leading-none">Admin User</p>
              <p className="text-[11px] text-muted mt-0.5 font-medium">admin@nmit.ac.in</p>
            </div>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:bg-indigo-700 transition-colors overflow-hidden">
              AD
            </div>
            <svg 
              className={`text-muted transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Menu Card */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-card rounded-2xl shadow-2xl border border-border-main p-2 animate-in fade-in zoom-in slide-in-from-top-4 duration-200 z-50">
              <div className="px-3 py-2 pb-3 mb-2 border-b border-border-main">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Account</p>
              </div>
              
              <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-main hover:bg-main rounded-xl transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Admin Settings
              </button>
              
              <button 
                onClick={() => { setShowMenu(false); onLogout(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

  );
}
