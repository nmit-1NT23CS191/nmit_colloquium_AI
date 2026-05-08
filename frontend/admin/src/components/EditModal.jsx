import React from 'react';

export default function EditModal({ isOpen, onClose, title, children, onSave, saveLabel = "Commit Changes" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-12 duration-500">
        {/* Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full"></div>
        
        <div className="p-12">
          <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{title}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Instance Configuration Interface</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {children}
          </div>

          <div className="flex items-center gap-4 mt-12 pt-10 border-t border-slate-50">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 h-16 text-lg font-black"
            >
              Discard
            </button>
            <button
              onClick={onSave}
              className="btn-primary flex-1 h-16 text-lg font-black"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
