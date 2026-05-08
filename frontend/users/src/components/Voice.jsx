import React, { useState, useEffect } from 'react';

export default function Voice({ onResult }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [rec, setRec] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SR) { setSupported(false); return; }

    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = 'en-US';

    r.onresult = (e) => {
      const text = Array.from(e.results).map(res => res[0].transcript).join('');
      setTranscript(text);
      if (e.results[0].isFinal) {
        onResult(text);
        setListening(false);
        setTranscript('');
      }
    };
    r.onerror = () => { setListening(false); setTranscript(''); };
    r.onend   = () => { setListening(false); };

    setRec(r);
  }, [onResult]);

  const toggle = () => {
    if (!rec) return;
    if (listening) { rec.stop(); setListening(false); setTranscript(''); }
    else           { rec.start(); setListening(true); setTranscript(''); }
  };

  if (!supported) return null;

  return (
    <div className="relative">
      {/* Transcript popover */}
      {listening && (
        <div className="absolute bottom-full mb-2 right-0 w-56 animate-fade-in">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl">
            <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest mb-1.5">Listening...</p>
            <p className="text-xs leading-relaxed">{transcript || 'Speak now...'}</p>
            {/* Waveform bars */}
            <div className="flex items-end gap-0.5 h-3 mt-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-indigo-500 rounded-full dot-bounce"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${30 + Math.random() * 70}%`,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Arrow */}
          <div className="w-3 h-3 bg-slate-900 rotate-45 ml-auto mr-2 -mt-1.5 rounded-sm" />
        </div>
      )}

      {/* Pulse rings */}
      {listening && (
        <>
          <div className="absolute inset-0 rounded-xl bg-red-400 pulse-ring opacity-50" />
          <div className="absolute inset-0 rounded-xl bg-red-400 pulse-ring opacity-30" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      <button
        onClick={toggle}
        title={listening ? 'Stop listening' : 'Voice input'}
        className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
          listening
            ? 'bg-red-500 text-white shadow-md shadow-red-500/30 scale-105'
            : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        {listening ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect width="12" height="12" x="6" y="6" rx="2"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        )}
      </button>
    </div>
  );
}