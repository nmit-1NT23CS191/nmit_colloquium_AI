import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setAuth }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:8000/login', { email, password });
      if (res.data.role === 'user') {
        setAuth({ role: 'user', username: email });
      } else {
        setError('Student access only. Please use your student credentials.');
      }
    } catch {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-white">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-indigo-800/30 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">N</span>
          </div>
          <div>
            <p className="text-white font-bold leading-none">NMIT Colloquium</p>
            <p className="text-indigo-200 text-xs mt-0.5">Student Discovery Portal</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-28 h-28 bg-white/15 backdrop-blur rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight">
            Discover Colloquium<br />
            <span className="text-indigo-200">Events with AI</span>
          </h2>
          <p className="text-indigo-200 text-sm mt-4 max-w-xs leading-relaxed">
            Chat with our AI assistant to find upcoming talks, browse speakers, and explore departments.
          </p>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {['S', 'R', 'A', 'K'].map((c, i) => (
              <div key={i} className="w-9 h-9 bg-indigo-400 border-2 border-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {c}
              </div>
            ))}
          </div>
          <p className="text-indigo-100 text-xs font-medium">1,200+ active students</p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <p className="font-bold text-slate-800">NMIT Colloquium</p>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1 mb-7">Sign in with your student account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Student Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email" required placeholder="student@nmit.ac.in"
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPwd ? 'text' : 'password'} required placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPwd ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-1">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{animation:'spin 1s linear infinite'}} />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Having trouble?{' '}
            <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contact your department</span>
          </p>
        </div>
      </div>
    </div>
  );
}