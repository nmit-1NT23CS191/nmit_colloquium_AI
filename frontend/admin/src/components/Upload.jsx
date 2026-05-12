import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [conflictData, setConflictData] = useState(null); // { status: 'duplicate', event: object }
  const inputRef = useRef();

  const showNotify = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const pick = (f) => {
    if (!f || (!f.type.includes('pdf') && !f.name.endsWith('.docx'))) { setError('Please upload a valid PDF or DOCX file.'); return; }
    setFile(f); setError(''); setExtracted(null);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const handleUpload = async (force = false) => {
    if (!file) return;
    setUploading(true); setProgress(5); setError('');
    setConflictData(null); // Fix: Clear modal immediately so progress is visible

    const fd = new FormData();
    fd.append('file', file);

    const timer = setInterval(() => setProgress(p => p < 88 ? p + 7 : p), 500);

    try {
      console.log(`Starting upload. Force: ${force}`);
      const url = `http://localhost:8000/upload/?force=${force ? 'true' : 'false'}`;
      const res = await axios.post(url, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'role': 'admin',
        },
      });
      clearInterval(timer);
      setProgress(100);

      if (res.data.status === 'duplicate') {
        setConflictData(res.data);
        showNotify('error', 'Duplicate event detected');
      } else if (res.data.status === 'error') {
        setError(res.data.message);
        showNotify('error', res.data.message);
      } else {
        setExtracted(res.data.event);
        setConflictData(null);
        showNotify('success', 'Event saved successfully!');
      }
    } catch {
      clearInterval(timer);
      setError('Upload failed. Please check your PDF and try again.');
      showNotify('error', 'Upload failed. Please try again.');
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 600);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-slide-in-right ${toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' : 'bg-white border-red-100 text-red-800'
          }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
            {toast.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            )}
          </div>
          <div className="pr-4">
            <p className="text-sm font-bold">{toast.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs opacity-80 font-medium">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Colloquium PDF / DOCX</h1>
        <p className="text-sm text-slate-500 mt-1">AI extracts event details automatically from your document</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`card relative cursor-pointer overflow-hidden transition-all duration-200 ${dragging
          ? 'border-2 border-dashed border-indigo-400 bg-indigo-50/50 scale-[1.01]'
          : file
            ? 'border-2 border-dashed border-emerald-300 bg-emerald-50/30'
            : 'border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
          }`}
      >
        <input
          ref={inputRef} type="file" accept=".pdf,.docx" hidden
          onChange={e => pick(e.target.files[0])}
        />

        <div className="py-12 px-8 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${file ? 'bg-emerald-100 text-emerald-600' : dragging ? 'bg-indigo-100 text-indigo-600 scale-110' : 'bg-slate-100 text-slate-400'
            }`}>
            {file ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="9 13 12 16 15 13" />
                <line x1="12" y1="16" x2="12" y2="11" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            )}
          </div>

          {file ? (
            <>
              <div>
                <p className="text-base font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <span className="badge badge-green">File selected</span>
            </>
          ) : (
            <>
              <div>
                <p className="text-base font-semibold text-slate-700">Drag & drop your PDF or DOCX here</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse files · up to 10 MB</p>
              </div>
            </>
          )}
        </div>

        {/* Progress bar at bottom */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* File actions */}
      {file && (
        <div className="flex gap-3">
          <button onClick={() => { setFile(null); setExtracted(null); setError(''); }} className="btn-secondary flex-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Remove
          </button>
          <button onClick={() => handleUpload()} disabled={uploading} className="btn-primary flex-1">
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Extracting with AI... {progress}%
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                Upload & Extract
              </>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
          <svg className="text-red-500 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Extracted preview */}
      {extracted && (
        <div className="animate-slide-up space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Event extracted successfully!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Review the details below and they've been saved automatically</p>
            </div>
          </div>

          {/* Data card */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Extracted Event Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Title', extracted.topic],
                ['Speaker', extracted.speaker],
                ['Department', extracted.department],
                ['Date', extracted.date],
                ['Time', extracted.time],
                ['Venue', extracted.venue],
              ].map(([k, v]) => v ? (
                <div key={k} className={k === 'Title' ? 'col-span-2' : ''}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{v}</p>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE WARNING MODAL */}
      {conflictData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setConflictData(null)} />
          <div className="relative bg-[#11141B] border border-slate-800 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="p-8">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="text-amber-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white text-center">Event Already Exists</h3>
              <p className="text-sm text-slate-400 text-center mt-3 leading-relaxed">
                An event with the same topic and date was found in the database. What would you like to do?
              </p>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={() => {
                    console.log("Proceed Anyway clicked!");
                    handleUpload(true);
                  }}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98]"
                >
                  Proceed Anyway
                </button>
                <button
                  onClick={() => setConflictData(null)}
                  className="w-full py-4 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  Cancel Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}