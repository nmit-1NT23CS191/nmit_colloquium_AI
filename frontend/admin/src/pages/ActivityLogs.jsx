import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/logs', {
        headers: { role: 'admin' }
      });
      setLogs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'UPLOAD': return <span className="badge bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">UPLOAD</span>;
      case 'DELETE': return <span className="badge bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">DELETE</span>;
      case 'UPDATE': return <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">UPDATE</span>;
      case 'FILE_DELETE': return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">FILE_DELETE</span>;
      default: return <span className="badge badge-gray">{action}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <header>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Activity Logs</h1>
        <p className="text-sm text-muted mt-1">Audit trail of all administrative actions</p>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-main">
                <th className="table-header">Timestamp</th>
                <th className="table-header">Admin</th>
                <th className="table-header">Action</th>
                <th className="table-header">Target</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-border-main/50">
                    <td className="px-6 py-4"><div className="skeleton h-4 w-1/3" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-1/4" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-6 w-16 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-1/2" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-muted">
                    No activity logs found.
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="table-row group">
                  <td className="table-cell text-xs font-mono text-muted">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="table-cell font-semibold text-text-main group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{log.admin_email}</td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="table-cell text-xs text-muted/80 italic">
                    {log.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
