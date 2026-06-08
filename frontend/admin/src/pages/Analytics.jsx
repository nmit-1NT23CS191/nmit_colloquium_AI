import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DEPT_COLORS = {
  'Computer Science': 'bg-indigo-500',
  'AI & ML':          'bg-violet-500',
  'Robotics':         'bg-sky-500',
  'Data Science':     'bg-emerald-500',
  'Cloud Computing':  'bg-amber-500',
};
const PALETTE = ['#4F46E5','#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444'];

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    axios.get('http://localhost:8000/events/')
      .then(r => setEvents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  now.setHours(0,0,0,0);

  // Monthly distribution
  const monthlyCounts = MONTHS.map((_, mi) =>
    events.filter(e => { 
      const d = parseEventDate(e.date); 
      return d && d.getMonth() === mi && d.getFullYear() === now.getFullYear(); 
    }).length
  );
  const maxMonth = Math.max(...monthlyCounts, 1);

  // Department distribution
  const deptMap = {};
  events.forEach(e => { const d = e.department || 'Other'; deptMap[d] = (deptMap[d] || 0) + 1; });
  const depts = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
  const total = events.length || 1;

  // Top speakers
  const speakerMap = {};
  events.forEach(e => { if (e.speaker) speakerMap[e.speaker] = (speakerMap[e.speaker] || 0) + 1; });
  const topSpeakers = Object.entries(speakerMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const upcomingEvents = events.filter(e => {
    const d = parseEventDate(e.date);
    return d && d >= now;
  });

  const kpis = [
    { label: 'Total Events',      value: events.length,         icon: '📅', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Events This Month', value: monthlyCounts[now.getMonth()], icon: '📆', color: 'bg-violet-50 text-violet-700' },
    { label: 'Upcoming Events',   value: upcomingEvents.length, icon: '⏰', color: 'bg-sky-50 text-sky-700' },
    { label: 'Total Speakers',    value: Object.keys(speakerMap).length, icon: '🎤', color: 'bg-emerald-50 text-emerald-700' },
  ];

  const upcoming = [...upcomingEvents].sort((a, b) => {
    const da = parseEventDate(a.date) || new Date(0);
    const db = parseEventDate(b.date) || new Date(0);
    return da - db;
  }).slice(0, 4);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Analytics</h1>
        <p className="text-sm text-muted mt-1">Event telemetry and department distribution for {now.getFullYear()}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${k.color}`}>{k.icon}</div>
            <div>
              <p className="text-xs text-muted">{k.label}</p>
              <p className="text-2xl font-bold text-text-main tracking-tight">{loading ? '—' : k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-text-main">Events Per Month</h2>
              <p className="text-xs text-muted mt-0.5">{now.getFullYear()} yearly overview</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-xs text-muted">Events</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-44">
            {monthlyCounts.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full relative flex-1 flex items-end">
                  <div
                    className="w-full bg-indigo-500 rounded-t-md group-hover:bg-indigo-600 transition-all duration-200 relative"
                    style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                    title={`${count} events`}
                  >
                    {count > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted leading-none">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dept Donut */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-semibold text-text-main mb-1">Department Split</h2>
          <p className="text-xs text-muted mb-5">Distribution by department</p>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-500 rounded-full animate-spin-slow" />
            </div>
          ) : depts.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">No data yet</p>
          ) : (
            <div className="space-y-3">
              {depts.slice(0, 6).map(([d, c], i) => (
                <div key={d} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-text-main truncate max-w-[70%]">{d}</span>
                    <span className="text-muted font-semibold">{Math.round((c / total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-main rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(c / total) * 100}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Speakers */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-text-main mb-4">Top Speakers</h2>
          {topSpeakers.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No speaker data yet</p>
          ) : (
            <div className="space-y-3">
              {topSpeakers.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-text-main truncate">{name}</p>
                      <p className="text-xs text-muted ml-2 shrink-0">{count} event{count > 1 ? 's' : ''}</p>
                    </div>
                    <div className="h-1.5 bg-main rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(count / (topSpeakers[0]?.[1] || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Timeline */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-text-main mb-4">Upcoming Timeline</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No upcoming events</p>
          ) : (
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border-main">
              {upcoming.map((e, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-card border-2 border-indigo-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-indigo-500 font-semibold mb-0.5">{e.date}</p>
                  <p className="text-sm font-medium text-text-main leading-snug">{e.topic}</p>
                  <p className="text-xs text-muted mt-0.5">{e.speaker || 'TBA'} • {e.venue || 'TBA'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
