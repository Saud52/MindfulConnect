import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';

const ChatbotCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .chat-btn-floating {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 65px;
    height: 65px;
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    font-size: 28px;
  }
  .chat-btn-floating:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
  }
  
  .chat-window {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 400px;
    height: 600px;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow-mid);
    border: 1px solid rgba(122,158,126,0.1);
    display: flex;
    flex-direction: column;
    z-index: 1001;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    transform-origin: bottom right;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }
  .chat-header {
    background: var(--sage-pale);
    color: var(--ink-mid);
    padding: 20px 24px;
    font-family: 'Fraunces', serif;
    font-size: 1.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(122,158,126,0.15);
  }
  .chat-close {
    background: none;
    border: none;
    color: var(--ink-mid);
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    line-height: 1;
    padding: 0;
  }
  .chat-close:hover {
    color: var(--sage);
  }
  .chat-body {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--cream);
    scroll-behavior: smooth;
  }
  .chat-msg-bot {
    align-self: flex-start;
    background: var(--white);
    border: 1px solid var(--cream-warm);
    border-radius: 12px 12px 12px 2px;
    padding: 12px 16px;
    max-width: 85%;
    font-size: 0.95rem;
    color: var(--ink-mid);
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .chat-msg-user {
    align-self: flex-end;
    background: var(--sage-pale);
    border: 1px solid var(--sage-light);
    color: var(--ink-mid);
    border-radius: 12px 12px 2px 12px;
    padding: 12px 16px;
    max-width: 85%;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 12px;
    background: var(--white);
    border-radius: 10px;
    width: fit-content;
    margin-bottom: 8px;
  }
  .dot {
    width: 6px;
    height: 6px;
    background: var(--sage-light);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .chat-input-area {
    padding: 16px;
    background: var(--white);
    border-top: 1px solid var(--cream-warm);
    display: flex;
    gap: 10px;
  }
  .chat-input {
    flex-grow: 1;
    border: 1.5px solid var(--cream-warm);
    border-radius: 100px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .chat-input:focus {
    border-color: var(--sage);
  }
  .chat-send-btn {
    background: var(--sage);
    color: var(--white);
    border: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .chat-send-btn:hover {
    background: #5a8a5f;
    transform: scale(1.05);
  }
  .chat-send-btn:disabled {
    background: var(--sage-light);
    cursor: not-allowed;
  }
  .chat-send-btn svg {
    width: 18px;
    height: 18px;
    margin-left: 2px;
  }
`;

const Chatbot = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { text: "Hi! I'm your mindful assistant. How are you feeling today? I'm here to listen and support you.", type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = ChatbotCSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen) return; // Only fetch when opening
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/chatbot/history`, {
          headers: { 'x-auth-token': token }
        });
        
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          setHistory(res.data.messages);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    
    fetchHistory();
  }, [isOpen]); // Re-fetch when chat is opened


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input.trim(), type: 'user' };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/chatbot`, {
        messages: newHistory,
        zone: props.zone
      }, {
        headers: { 'x-auth-token': token }
      });

      setHistory([...newHistory, { text: res.data.text, type: 'bot' }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setHistory([...newHistory, { 
        text: error.response?.data?.msg || "I'm having trouble connecting right now. Please try again later.", 
        type: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };



  if (!isOpen) {
    return (
      <div className="chat-btn-floating" onClick={() => setIsOpen(true)}>
        <span>🌿</span>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Mindful Assistant</span>
        <button onClick={() => setIsOpen(false)} className="chat-close">×</button>
      </div>
      <div className="chat-body" ref={scrollRef}>
        {history.map((item, index) => (
          <div key={index} className={item.type === 'bot' ? 'chat-msg-bot' : 'chat-msg-user'}>
            {item.text}
          </div>
        ))}
        {isLoading && (
          <div className="chat-msg-bot">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Type your message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim() || isLoading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chatbot;