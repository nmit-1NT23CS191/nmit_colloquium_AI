import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Sidebar from "./layout/Sidebar"
import Navbar from "./components/Navbar"
import Events from "./pages/Events"
import Upload from "./components/Upload"
import Analytics from "./pages/Analytics"
import Files from './pages/Files'
import ActivityLogs from './pages/ActivityLogs'
import AdminChat from './components/AdminChat'

export default function App() {

  const [auth, setAuth] = useState(false)
  const [page, setPage] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('admin-theme') === 'dark' || 
           (!localStorage.getItem('admin-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setAuth(false);
    setPage("dashboard");
    setSearch("");
    setShowLogoutModal(false);
  };

  const handleGlobalSearch = (val) => {
    setSearch(val);
    if (val.trim() && page !== "events") {
      setPage("events");
    }
  };

  if (!auth) return <Login setAuth={setAuth} />

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} />
      case "upload":    return <Upload />
      case "events":     return <Events search={search} setSearch={handleGlobalSearch} />
      case "analytics":  return <Analytics />
      case "files":      return <Files />
      case "logs":       return <ActivityLogs />
      default:          return <Dashboard setPage={setPage} />
    }
  }

  return (
    <div className="flex bg-main min-h-screen text-text-main transition-colors duration-200">
      {/* Dynamic Sidebar */}
      <Sidebar 
        setPage={setPage} 
        currentPage={page} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Global Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-scale-in border border-border-main">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="text-red-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text-main text-center">Logout</h3>
            <p className="text-sm text-muted text-center mt-1">Are you sure you want to end your session?</p>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-muted hover:bg-main rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/20 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          search={search}
          setSearch={handleGlobalSearch}
          onLogout={handleLogout}
          currentPage={page}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          {renderPage()}
        </main>
      </div>

      {/* Admin Assistant Bubble */}
      <AdminChat />
    </div>
  );
}


