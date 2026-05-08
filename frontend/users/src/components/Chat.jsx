import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Voice from './Voice';

// ── Lightweight markdown renderer ────────────────────────────
// Handles: **bold**, *italic*, newlines. No external lib needed.
function renderMarkdown(text) {
  // Split on newlines first
  return text.split('\n').map((line, li) => {
    // Parse inline: **bold** and *italic*
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
}

const SUGGESTIONS = [
  'What AI events are coming up?',
  'Tell me about Machine Learning talks',
  'Who is speaking this week?',
  'Show Robotics department events',
];

export default function Chat() {
  const [input, setInput]       = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm the NMIT Colloquium AI assistant. Ask me anything about upcoming events, speakers, departments, or venues.",
      timestamp: now(),
    },
  ]);
  const [loading, setLoading]   = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const voicesRef  = useRef([]);   // cached voice list

  // Pre-load voices (Chrome is async)
  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis?.getVoices() || []; };
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Text-to-Speech ──────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Strip markdown symbols for cleaner TTS
    const clean = text.replace(/[#*`_~>\[\]()]/g, '').replace(/👋|🎤|📅|⏰/g, '').trim();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang  = 'en-US';
    utterance.rate  = 0.95;
    utterance.pitch = 1.0;

    // Use cached voices (Chrome loads them async)
    const voices = voicesRef.current.length
      ? voicesRef.current
      : window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
      && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  // ── Ask AI ──────────────────────────────────────────────────
  // viaVoice = true  → auto-speak the AI reply
  const ask = async (text, viaVoice = false) => {
    const q = text.trim();
    if (!q) return;
    const userMsg = { role: 'user', text: q, timestamp: now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/ask/', {
        question: q,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.text })),
      });
      const answer = res.data.answer;
      setMessages([...updated, { role: 'assistant', text: answer, timestamp: now() }]);
      // ✅ Speak the reply when triggered by voice
      if (viaVoice) speak(answer);
    } catch {
      const errMsg = 'Sorry, something went wrong. Please try again.';
      setMessages([...updated, { role: 'assistant', text: errMsg, timestamp: now() }]);
      if (viaVoice) speak(errMsg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* ─ Navbar ─ */}
      <header className="h-16 bg-white border-b border-slate-100 px-5 flex items-center gap-3 shrink-0 z-10">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-none">NMIT AI Assistant</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <p className="text-[11px] text-slate-400">Online · Ask me about colloquium events</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: 'assistant', text: "Chat cleared! How can I help you?", timestamp: now() }])}
          className="btn-ghost text-xs"
        >
          Clear
        </button>
      </header>

      {/* ─ Messages ─ */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Suggestions (only at start) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center pb-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => ask(s)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-slide-up ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                m.role === 'assistant' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-800 text-white'
              }`}>
                {m.role === 'assistant' ? 'AI' : 'U'}
              </div>
              {/* Bubble + time + speak button */}
              <div className={`flex flex-col gap-1 max-w-[75%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  {m.role === 'assistant' ? renderMarkdown(m.text) : m.text}
                </div>
                <div className={`flex items-center gap-2 px-1 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                  {/* 🔊 Speaker button for AI messages */}
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => speaking ? stopSpeaking() : speak(m.text)}
                      title={speaking ? 'Stop speaking' : 'Read aloud'}
                      className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-indigo-500 transition-colors"
                    >
                      {speaking ? (
                        // Equalizer animation when speaking
                        <span className="flex items-end gap-px h-3">
                          <span className="w-0.5 bg-indigo-400 rounded-full dot-bounce"    style={{height:'40%'}} />
                          <span className="w-0.5 bg-indigo-400 rounded-full dot-bounce-1"  style={{height:'80%'}} />
                          <span className="w-0.5 bg-indigo-400 rounded-full dot-bounce-2"  style={{height:'60%'}} />
                          <span className="w-0.5 bg-indigo-400 rounded-full dot-bounce"    style={{height:'90%'}} />
                        </span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                AI
              </div>
              <div className="chat-bubble-ai flex items-center gap-1 py-3.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce-1" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce-2" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ─ Input bar ─ */}
      <footer className="bg-white border-t border-slate-100 px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none py-1.5 max-h-28 leading-relaxed"
              placeholder="Ask about colloquium events..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); }
              }}
            />
            <div className="flex items-center gap-1.5 pb-0.5 shrink-0">
              {/* viaVoice=true → AI will speak the reply automatically */}
              <Voice onResult={text => ask(text, true)} />
              <button
                onClick={() => ask(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </footer>
    </div>
  );
}