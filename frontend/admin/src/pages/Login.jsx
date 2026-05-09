// import React, { useState } from 'react';
// import axios from 'axios';

// export default function Login({ setAuth }) {
//   const [role, setRole]         = useState('admin');
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [showPwd, setShowPwd]   = useState(false);
//   const [error, setError]       = useState('');
//   const [loading, setLoading]   = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     try {
//       const res = await axios.post('http://localhost:8000/login', { email, password });
//       if (res.data.role === 'admin') {
//         setAuth({ role: 'admin', user: email });
//       } else {
//         setError('Access denied. Admin privileges required.');
//       }
//     } catch {
//       setError('Invalid credentials. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex font-sans overflow-hidden bg-white">

//       {/* ── Left branding panel ── */}
//       <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden"
//            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
//         {/* Blobs */}
//         <div className="absolute top-[-15%] right-[-15%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-800/30 rounded-full blur-3xl pointer-events-none" />

//         {/* Logo */}
//         <div className="relative z-10 flex items-center gap-3">
//           <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
//             <span className="text-white font-black text-lg">N</span>
//           </div>
//           <div>
//             <p className="text-white font-bold text-base leading-none">NMIT Colloquium</p>
//             <p className="text-indigo-200 text-xs font-medium mt-0.5">AI-Powered Management</p>
//           </div>
//         </div>

//         {/* Hero illustration area */}
//         <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
//           {/* Abstract SVG icon */}
//           <div className="w-32 h-32 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-8 border border-white/20">
//             <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//               <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//             </svg>
//           </div>
//           <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
//             Orchestrate Academic<br />
//             <span className="text-indigo-200">Intelligence</span>
//           </h2>
//           <p className="text-indigo-200 text-sm leading-relaxed mt-4 max-w-xs">
//             Manage colloquium events, extract insights from PDFs, and engage students with AI-powered search.
//           </p>
//         </div>

//         {/* Stats row */}
//         <div className="relative z-10 flex gap-8">
//           {[['99.2%', 'AI Accuracy'], ['4.2s', 'Extraction Time'], ['120+', 'Events Indexed']].map(([v, l]) => (
//             <div key={l}>
//               <p className="text-white font-black text-xl leading-none">{v}</p>
//               <p className="text-indigo-300 text-[11px] font-medium mt-1 uppercase tracking-wide">{l}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Right login form ── */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
//         <div className="w-full max-w-sm">

//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-black text-sm">N</span>
//             </div>
//             <p className="font-bold text-slate-800">NMIT Colloquium</p>
//           </div>

//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
//           <p className="text-sm text-slate-500 mt-1 mb-7">Sign in to your account to continue</p>

//           {/* Role toggle */}
//           <div className="flex p-1 bg-slate-100 rounded-xl mb-7 gap-1">
//             {['admin', 'student'].map(r => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => setRole(r)}
//                 className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
//                   role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 {r.charAt(0).toUpperCase() + r.slice(1)}
//               </button>
//             ))}
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="form-label">Email Address</label>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect width="20" height="16" x="2" y="4" rx="2"/>
//                     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
//                   </svg>
//                 </span>
//                 <input
//                   type="email" required autoComplete="email"
//                   placeholder={role === 'admin' ? 'admin@nmit.ac.in' : 'student@nmit.ac.in'}
//                   className="form-input !pl-10"
//                   value={email} onChange={e => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <div className="flex justify-between items-center mb-1.5">
//                 <label className="form-label !mb-0">Password</label>
//                 <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//                   </svg>
//                 </span>
//                 <input
//                   type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
//                   placeholder="••••••••"
//                   className="form-input !pl-10 !pr-10"
//                   value={password} onChange={e => setPassword(e.target.value)}
//                 />
//                 <button
//                   type="button" onClick={() => setShowPwd(!showPwd)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     {showPwd
//                       ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
//                       : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Remember me */}
//             <div className="flex items-center gap-2">
//               <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
//               <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
//                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
//                 <p className="text-xs text-red-600 font-medium">{error}</p>
//               </div>
//             )}

//             {/* Submit */}
//             <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-sm mt-1">
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
//                   Signing in...
//                 </span>
//               ) : 'Sign In'}
//             </button>
//           </form>

//           {/* Divider + Google */}
//           <div className="flex items-center gap-4 my-5">
//             <div className="flex-1 h-px bg-slate-200" />
//             <span className="text-xs text-slate-400 font-medium">or</span>
//             <div className="flex-1 h-px bg-slate-200" />
//           </div>

//           <button type="button" className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
//             <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l7 5.1C15 16 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.6-5l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.2 0-9.5-3.1-11.3-7.5l-7 5.4C9.5 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.7 6l6.3 5.3C40.6 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
//             Continue with Google
//           </button>

//           <p className="text-center text-xs text-slate-400 mt-6">
//             Don't have an account?{' '}
//             <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contact Admin</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import axios from 'axios';
import heroImage from '../assets/nitte-logo.jpg';

function HeroImageBadge({ size = 'sm', className = '' }) {
  const badgeSize = size === 'lg' ? 'w-16 h-16' : size === 'xl' ? 'w-40 h-40' : 'w-10 h-10';

  return (
    <div className={`${badgeSize} rounded-2xl bg-white border border-blue-100 shadow-[0_12px_28px_-14px_rgba(15,23,42,0.2)] overflow-hidden p-1.5 ${className}`}>
      <img src={heroImage} alt="NMIT hero image" className="w-full h-full object-contain" />
    </div>
  );
}

function HeroImageStage() {
  return (
    <div className="hero-logo-stage w-full max-w-[420px] rounded-[2rem] border border-blue-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(239,246,255,0.92)_100%)] backdrop-blur-2xl shadow-[0_20px_50px_-24px_rgba(37,99,235,0.24)] p-5 sm:p-6">
      <div className="relative flex items-center justify-center min-h-[220px] sm:min-h-[250px] perspective-3d">
        <div className="absolute inset-x-14 top-8 h-24 rounded-full bg-blue-500/18 blur-3xl" />
        <div className="absolute inset-y-12 left-10 w-16 rounded-full bg-[#3f3bd8]/12 blur-3xl" />
        <div className="absolute inset-y-12 right-10 w-16 rounded-full bg-blue-500/12 blur-3xl" />

        <div className="relative animate-logo-float">
          <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-[#3f3bd8]/14 via-transparent to-blue-500/14 blur-2xl scale-110" />
          <div className="relative rounded-[1.6rem] bg-white border border-blue-100 shadow-[0_16px_34px_-18px_rgba(15,23,42,0.22)] p-4 sm:p-5 transform-gpu animate-logo-tilt">
            <div className="rounded-[1.2rem] bg-white border border-blue-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] p-2 sm:p-3">
              <HeroImageBadge size="xl" className="hero-logo-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      if (res.data.role === 'admin') {
        setAuth({ role: 'admin', user: email });
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-white">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 overflow-hidden bg-[#243385]">
        <div className="absolute top-[-14%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-12%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.10] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]" />

        {/* Hero image */}
        <div className="relative z-10 flex items-center gap-3">
          <HeroImageBadge />
          <div>
            <p className="text-white font-extrabold text-base leading-none">NMIT Colloquium</p>
            <p className="text-white/80 text-xs font-medium mt-0.5">AI-Powered Management</p>
          </div>
        </div>

        {/* Hero illustration area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 lg:px-8">
          <div className="mb-7 w-full flex flex-col items-center">
            <HeroImageBadge size="xl" className="hero-logo-image mb-5" />
            <h2 className="text-4xl xl:text-5xl text-white leading-tight tracking-tight max-w-2xl drop-shadow-sm text-center">
               
              <span className="block font-medium uppercase text-2xl mt-1">NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY</span>
              
              <span className="block font-semibold uppercase mt-1">COLLOQUIUM AI</span>
            </h2>
          </div>
          <br />
          <p className="text-white text-sm leading-relaxed mt-4 max-w-md text-center">
            Manage colloquium events, extract insights from PDFs, and engage students with AI-powered search.
          </p>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8 bg-white">
        <div className="w-full max-w-[400px] rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.12)] p-6 sm:p-7">

          {/* Mobile hero image */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <HeroImageBadge />
            <p className="font-bold text-slate-800 uppercase">NITTE</p>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1 mb-7">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email" required autoComplete="email"
                  placeholder="admin@nmit.ac.in"
                  className="form-input !pl-10"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label !mb-0">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••"
                  className="form-input !pl-10 !pr-10"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPwd
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-sm mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider + Google */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button type="button" className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l7 5.1C15 16 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.6-5l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.2 0-9.5-3.1-11.3-7.5l-7 5.4C9.5 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.7 6l6.3 5.3C40.6 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}