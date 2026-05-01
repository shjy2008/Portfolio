"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { fetchHealthOnce } from '../lib/client/healthCheck';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const MedicalQA: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelInitializing, setIsModelInitializing] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    fetchHealthOnce('/api/phi3/health').then(({ initialized }) => {
      setIsModelInitializing(!initialized);
    });
  }, []);

  // Handle manual scrolling to toggle auto-scroll
  const handleScroll = () => {
    const container = chatHistoryRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Check if user is at the bottom (with a small 5px margin for rounding)
    const atBottom = scrollHeight - scrollTop - clientHeight < 5;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/phi3/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          max_tokens: 1024,
          temperature: 0.0
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        if (payload?.code === 'MODEL_INITIALIZING') {
          setIsModelInitializing(true);
          throw new Error(payload.message);
        }
        throw new Error(payload?.message || 'Failed to get response from model');
      }

      if (!response.body) {
        throw new Error('No response body received from stream');
      }

      // Add an empty bot message placeholder
      setMessages(prev => [...prev, { role: 'bot', content: '' }]);
      setIsModelInitializing(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Update the last message (the bot placeholder) with the newly arrived chunk
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulatedContent
            };
          }
          return updated;
        });
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-page-container medical-qa-container">
      <Link href="/?from=projects" className="back-link">← Back to Home</Link>
      <div className="project-header">
        <h1 className="project-title">LLM+RAG Medical Q&A</h1>
        <p className="project-subtitle">Beyond SOTA: Phi-3-mini Augmented Medical Bot</p>
      </div>

      <div className="project-content">
        <div className="info-panel">
          <h3>Architectural Overview</h3>
          <p>
            A high-performance Retreival-Augmented Generation (RAG) system built to answer complex medical questions.
          </p>
          <ul>
            <li><b>LLM Fine-tuning:</b> Two-phase fine-tuning on Microsoft's Phi-3-mini (3.8B) using the 410k UltraMedical dataset.</li>
            <li><b>RAG Pipeline:</b> Multi-stage retrieval combining BM25, SPLADE, and dense embeddings with re-ranking.</li>
            <li><b>Real-time Inference:</b> vLLM serving on Modal's serverless GPU for low-latency responses.</li>
          </ul>
        </div>

        <div className="demo-panel">
          {isModelInitializing ? (
            <div className="initialization-overlay">
              <div className="pulse-icon">🩺</div>
              <div className="status-message">
                The Medical QA model is initializing. This can take about 60 seconds during a cold start.
              </div>
            </div>
          ) : (
            <>
              <div 
                className="chat-history" 
                ref={chatHistoryRef}
                onScroll={handleScroll}
              >
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    <p>Ask a medical question to start the conversation.</p>
                    <p style={{ fontSize: '0.8rem' }}>Example: "What are the common treatments for diabetes?"</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                    {msg.content}
                  </div>
                ))}
                {loading && (messages.length === 0 || messages[messages.length - 1].role !== 'bot') && (
                  <div className="message bot-message loading">
                    Thinking...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

              <div className="chat-input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type your medical question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                />
                <button
                  className="send-button"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalQA;
