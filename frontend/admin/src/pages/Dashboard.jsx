import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KPI = ({ label, value, sub, icon, color }) => (
  <div className="card p-6 flex items-start gap-4 transition-all duration-300 hover:border-indigo-500/30">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color} shadow-sm`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted font-bold uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-text-main mt-1 tracking-tight leading-none">{value}</p>
      {sub && <p className="text-[11px] text-muted/70 mt-2 font-medium truncate">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/events/');
      setEvents(res.data || []);
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const parseEventDate = (raw) => {
    if (!raw) return null;
    const s = raw.trim();
    const dmy = s.match(/^(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})$/);
    if (dmy) return new Date(`${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`);
    const iso = s.match(/^\d{4}-\d{2}-\d{2}$/);
    if (iso) return new Date(s);
    const parsed = new Date(s);
    return isNaN(parsed) ? null : parsed;
  };

  const now = new Date();
  now.setHours(0,0,0,0);

  const thisMonth = events.filter(e => {
    const d = parseEventDate(e.date);
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const upcoming = events.filter(e => {
    const d = parseEventDate(e.date);
    return d && d >= now;
  }).sort((a, b) => {
    const da = parseEventDate(a.date) || new Date(0);
    const db = parseEventDate(b.date) || new Date(0);
    return da - db;
  });

  const kpis = [
    {
      label: 'Total Events',
      value: loading ? '—' : events.length,
      sub: 'Total colloquiums indexed',
      color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      label: 'Monthly Events',
      value: loading ? '—' : thisMonth,
      sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
    {
      label: 'Upcoming',
      value: loading ? '—' : upcoming.length,
      sub: 'Actionable events scheduled',
      color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    },
    {
      label: 'Speakers',
      value: loading ? '—' : new Set(events.map(e => e.speaker).filter(Boolean)).size,
      sub: 'Distinct experts engaged',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
  ];

  return (
    <div className="space-y-10 animate-slide-up">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted font-medium mt-1.5 opacity-80">Monitoring NMIT Colloquium operations and engagement.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest">{new Date().toDateString()}</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => <KPI key={i} {...k} />)}
      </div>

      {/* Upcoming Events Container */}
      <div className="card border-none shadow-xl shadow-indigo-600/5">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border-main/50 bg-main/30">
          <div>
            <h2 className="text-lg font-bold text-text-main">Scheduled Colloquiums</h2>
            <p className="text-xs text-muted font-medium mt-0.5">Top upcoming sessions by priority</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tighter">Live Monitor</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin-slow" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted space-y-4">
            <div className="w-16 h-16 bg-main rounded-2xl flex items-center justify-center border border-border-main">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round opacity-30">
                <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-text-main">No Sessions Found</p>
              <p className="text-xs max-w-[200px] mx-auto mt-1 leading-relaxed">Upload a source document to extract and schedule new colloquium events.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border-main/30">
            {upcoming.slice(0, 6).map((e, i) => (
              <div key={i} className="flex items-center justify-between px-8 py-5 hover:bg-main/50 transition-all group cursor-default">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-12 h-12 bg-main border border-border-main rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg width="20" height="20" className="text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-main group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate mb-1">{e.topic}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted font-medium">
                      <span className="px-1.5 py-0.5 bg-main rounded border border-border-main">{e.speaker || 'TBA'}</span>
                      <span className="opacity-40">•</span>
                      <span>{e.venue || 'TBA'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 shrink-0 ml-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-text-main tracking-tight">{e.date}</p>
                    <p className="text-[10px] text-muted mt-0.5 font-semibold uppercase tracking-tighter">{e.time || 'Schedule TBA'}</p>
                  </div>
                  <span className="badge border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 !px-3 !py-1 text-[10px] font-black uppercase tracking-widest hidden lg:block">
                    {e.department || 'General'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) }
      </div>
    </div>
  );
}