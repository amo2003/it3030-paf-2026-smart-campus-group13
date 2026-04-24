import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const BASE_URL = 'http://localhost:8080/api/chat/ask';
const SUGGESTIONS = [
  '📋 How do I create a booking?',
  '✅ How does approval work?',
  '❌ How do I cancel a booking?',
  '📊 What is the QR check-in?',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! I'm the Smart Campus assistant. Ask me anything about bookings!" }
  ]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

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
      setHistory([...history, { role: 'user', content: msg }, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'bot', text: '⚠️ Could not connect to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => {
    setMessages([{ role: 'bot', text: "👋 Hi! I'm the Smart Campus assistant. Ask me anything about bookings!" }]);
    setHistory([]);
    setInput('');
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setOpen(!open)} aria-label="Toggle chat">
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">AI</div>
              <div>
                <div className="chatbot-header-title">Smart Campus Bot</div>
                <div className="chatbot-header-sub">
                  <span className="chatbot-online-dot" />
                  Booking assistant · Online
                </div>
              </div>
            </div>
            <button className="chatbot-clear-btn" onClick={reset}>↺ Clear</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.role === 'bot' && <div className="chat-msg-avatar">AI</div>}
                <div className={`chat-bubble ${m.role}`}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                <div className="chat-msg-avatar">AI</div>
                <div className="chat-typing-dots">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chatbot-suggestion-btn" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about bookings..."
              disabled={loading}
            />
            <button className="chatbot-send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
