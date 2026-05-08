import { useState } from "react"
import Login from "./pages/Login"
import Chat from "./components/Chat"
import UserSidebar from "./layout/UserSidebar"

export default function App() {

  const [auth, setAuth] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatKey, setChatKey] = useState(0) // Used to force-reset chat component

  const handleNewChat = () => {
    setChatKey(prev => prev + 1)
    setIsSidebarOpen(false)
  }

  const handleLogout = () => {
    setAuth(false)
  }

  return auth ? (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      
      {/* Sidebar - Mobile Responsive */}
      <div className={`fixed inset-0 z-50 lg:relative lg:inset-auto transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <UserSidebar onNewChat={handleNewChat} onLogout={handleLogout} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Mobile Navbar Toggle */}
        <div className="lg:hidden absolute top-4 left-4 z-30">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
        </div>

        <Chat key={chatKey} />
      </div>

    </div>
  ) : (
    <Login setAuth={setAuth} />
  )
}