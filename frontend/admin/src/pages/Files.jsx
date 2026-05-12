import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/files/list', {
        headers: { role: 'admin' }
      });
      setFiles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove the file from the server.`)) return;
    try {
      await axios.delete(`http://localhost:8000/files/delete/${name}`, {
        headers: { role: 'admin' }
      });
      setFiles(prev => prev.filter(f => f.name !== name));
    } catch (e) {
      alert("Error deleting file");
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <header>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">File Manager</h1>
        <p className="text-sm text-muted mt-1">Manage physically uploaded source files</p>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-main">
                <th className="table-header">Filename</th>
                <th className="table-header">Size</th>
                <th className="table-header">Upload Date</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border-main/50">
                    <td className="px-6 py-4"><div className="skeleton h-4 w-3/4" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-1/4" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-1/3" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-8 w-8 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-muted">
                    No files found in the uploads directory.
                  </td>
                </tr>
              ) : files.map((file) => (
                <tr key={file.name} className="table-row group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <span className="text-sm font-semibold text-text-main group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{file.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-xs font-mono text-muted">{formatSize(file.size)}</td>
                  <td className="table-cell text-xs text-muted">{new Date(file.modified * 1000).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteFile(file.name)}
                      className="p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete File"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
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
