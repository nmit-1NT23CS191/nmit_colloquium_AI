import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
const renderMarkdown = (text) => {
  return text.split('\n').map((line, li) => {
    const parts = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) parts.push(line.slice(last, match.index));
      if (match[1] !== undefined) parts.push(<strong key={match.index}>{match[1]}</strong>);
      else if (match[2] !== undefined) parts.push(<em key={match.index}>{match[2]}</em>);
      last = regex.lastIndex;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <span key={li}>
        {parts}
        {li < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
};

export default function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Admin! I can help you with analytics and event management. Ask me something like "Which department has the most events?"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // We use the same /ask/ endpoint but we can refine the prompt on the backend logic if needed
      const res = await axios.post('http://localhost:8000/ask/', { 
        question: `[ADMIN CONTEXT] ${input}`,
        history: messages.slice(-5).map(m => ({ role: m.role, text: m.content }))
      });
      
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't process that query right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-[#11141B] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold leading-none">Admin Assistant</p>
                <p className="text-[10px] text-indigo-100 mt-0.5">Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  {m.role === 'ai' ? renderMarkdown(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask administrative query..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group"
      >
        <svg className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <path d="M18 6 6 18M6 6l12 12"/>
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          )}
        </svg>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
        )}
      </button>
    </div>
  );
}
