import React, { useState, useRef, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080/api/chat/ask';

const SUGGESTIONS = [
  '📋 How do I create a booking?',
  '✅ How does approval work?',
  '❌ How do I cancel a booking?',
  '📊 What is the QR check-in?',
];

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m the Smart Campus assistant. Ask me anything about bookings!' }
  ]);
  const [history, setHistory] = useState([]); // sent to backend
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, no response received.';

      setMessages([...newMessages, { role: 'bot', text: reply }]);

      // update history for context
      setHistory([
        ...history,
        { role: 'user',      content: msg   },
        { role: 'assistant', content: reply },
      ]);

    } catch (e) {
      setMessages([...newMessages, { role: 'bot', text: '⚠️ Could not connect to the server. Is the backend running?' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => {
    setMessages([{ role: 'bot', text: '👋 Hi! I\'m the Smart Campus assistant. Ask me anything about bookings!' }]);
    setHistory([]);
    setInput('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-indigo-700 transition"
        aria-label="Toggle chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">AI</div>
              <div>
                <p className="text-white font-semibold text-sm">Smart Campus Bot</p>
                <p className="text-indigo-200 text-xs">Booking assistant · Online</p>
              </div>
            </div>
            <button onClick={reset} className="text-indigo-200 hover:text-white text-xs" title="Clear chat">
              ↺ Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0">AI</div>
                )}
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — show only at start */}
          {messages.length === 1 && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 grid grid-cols-2 gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2 py-2 hover:bg-indigo-100 transition text-left leading-tight">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about bookings..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
