import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton, { TableSkeleton } from '../components/Skeleton';

export default function Events({ search, setSearch }) {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dept, setDept]           = useState('All Departments');
  const [page, setPage]           = useState(1);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const PER_PAGE = 8;

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try { 
      const r = await axios.get('http://localhost:8000/events/'); 
      setEvents(r.data); 
    }
    catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8000/export/${type}`, {
        headers: {'role': 'admin'},
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `colloquium_events.${type === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error(e);
      alert("Export failed");
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
    if (!isNaN(parsed)) return parsed;
    return null;
  };

  const isUpcoming = (dateStr) => {
    const d = parseEventDate(dateStr);
    if (!d || isNaN(d)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/delete/${deleteId}`, {
        headers: { 'role': 'admin' },
      });
      setEvents(prev => prev.filter(e => e.id !== deleteId));
    } catch (e) { console.error(e); } finally { setDeleteId(null); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:8000/update/${editEvent.id}`, editEvent, {
        headers: { 'role': 'admin' },
      });
      setEvents(prev => prev.map(e => e.id === editEvent.id ? editEvent : e));
      setEditEvent(null);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const dynamicDepts = [
    'All Departments',
    ...new Set(events.map(e => e.department).filter(Boolean).sort())
  ];

  const filtered = events.filter(e => {
    const matchSearch = (e.topic || '').toLowerCase().includes(search.toLowerCase())
      || (e.speaker || '').toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All Departments' || e.department === dept;
    return matchSearch && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Colloquium Events</h1>
          <p className="text-sm text-muted mt-1">{events.length} total events indexed</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary px-4 py-2 text-xs flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button onClick={() => handleExport('excel')} className="btn-primary px-4 py-2 text-xs flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-main border border-border-main rounded-xl px-3.5 py-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <svg className="text-muted shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="bg-transparent text-sm text-text-main placeholder:text-muted outline-none w-full"
            placeholder="Search by title or speaker..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="form-input !w-auto min-w-[220px] bg-main border-border-main text-text-main p-2"
          value={dept}
          onChange={e => { setDept(e.target.value); setPage(1); }}
        >
          {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-main">
                <th className="table-header">Title</th>
                <th className="table-header">Speaker</th>
                <th className="table-header hidden md:table-cell">Department</th>
                <th className="table-header hidden lg:table-cell">Date</th>
                <th className="table-header hidden lg:table-cell">Time</th>
                <th className="table-header hidden xl:table-cell">Venue</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12">
                    <TableSkeleton rows={PER_PAGE} cols={8} />
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-muted">No events found</td>
                </tr>
              ) : paged.map((e) => (
                <tr key={e.id} className="table-row">
                  <td className="table-cell font-medium text-text-main">
                    <p className="whitespace-normal break-words leading-snug">{e.topic}</p>
                  </td>
                  <td className="table-cell text-muted">{e.speaker || '—'}</td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="badge badge-indigo">{e.department || '—'}</span>
                  </td>
                  <td className="table-cell hidden lg:table-cell text-muted">{e.date}</td>
                  <td className="table-cell hidden lg:table-cell text-muted text-xs">{e.time || '—'}</td>
                  <td className="table-cell hidden xl:table-cell text-muted text-xs">
                    <p className="whitespace-normal break-words leading-snug">{e.venue || '—'}</p>
                  </td>
                  <td className="table-cell">
                    {isUpcoming(e.date)
                      ? <span className="badge badge-green">Upcoming</span>
                      : <span className="badge badge-gray">Completed</span>}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditEvent({ ...e })} className="btn-icon text-indigo-500 hover:bg-indigo-50/50">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button onClick={() => setDeleteId(e.id)} className="btn-icon text-red-400 hover:bg-red-50/50">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border-main bg-main/30 font-medium">
            <p className="text-xs text-muted">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-icon disabled:opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 text-xs rounded-lg font-semibold transition-all ${page === n ? 'bg-indigo-600 text-white' : 'text-muted hover:bg-main'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-icon disabled:opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditEvent(null)} />
          <div className="relative bg-card border border-border-main rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-text-main">Edit Event</h2>
                <button onClick={() => setEditEvent(null)} className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Title</label>
                  <input className="form-input border-border-main" value={editEvent.topic || ''} onChange={e => setEditEvent(p => ({ ...p, topic: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Speaker</label>
                  <input className="form-input border-border-main" value={editEvent.speaker || ''} onChange={e => setEditEvent(p => ({ ...p, speaker: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input className="form-input border-border-main" value={editEvent.department || ''} onChange={e => setEditEvent(p => ({ ...p, department: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input className="form-input border-border-main" value={editEvent.date || ''} onChange={e => setEditEvent(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <input className="form-input border-border-main" value={editEvent.time || ''} onChange={e => setEditEvent(p => ({ ...p, time: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Venue</label>
                  <input className="form-input border-border-main" value={editEvent.venue || ''} onChange={e => setEditEvent(p => ({ ...p, venue: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-5 border-t border-border-main">
                <button onClick={() => setEditEvent(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border-main rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            </div>
            <h3 className="text-base font-bold text-text-main">Delete Event?</h3>
            <p className="text-sm text-muted mt-1.5 mb-5">This action is permanent.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 btn-danger !bg-red-500 !text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}