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

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    fetchHealthOnce('/api/phi3/health').then(({ initialized }) => {
      setIsModelInitializing(!initialized);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          max_tokens: 512,
          temperature: 0.7
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

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response || data.text || 'No response received.' }]);
      setIsModelInitializing(false);
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
              <div className="chat-history">
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
                {loading && (
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
