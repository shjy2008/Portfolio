"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { fetchHealthOnce } from '../lib/client/healthCheck';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ALL_SUGGESTED_QUESTIONS = [
  "What are the common symptoms of a cold vs the flu?",
  "How can I improve my sleep quality?",
  "What are the best ways to lower high blood pressure naturally?",
  "What should I do if I have a persistent headache?",
  "How many glasses of water should I drink every day?",
  "What are some healthy snacks for weight loss?",
  "How can I tell if a wound is infected?",
  "What are the early signs of pregnancy?",
  "How do I relieve seasonal allergy symptoms?",
  "What are the benefits of regular exercise?",
  "How can I manage daily stress and anxiety?",
  "What are the first aid steps for a minor burn?"
];

const getRandomSuggestions = (count: number) => {
  const shuffled = [...ALL_SUGGESTED_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const MedicalQA: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelInitializing, setIsModelInitializing] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setCurrentSuggestions(getRandomSuggestions(4));
  }, []);

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
    // Check if user is at the bottom (with a more generous 30px margin for reliability)
    const atBottom = scrollHeight - scrollTop - clientHeight < 30;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
    // Use a stable-length dependency array to prevent React hook errors
  }, [messages.length, messages[messages.length - 1], isAtBottom, currentSuggestions.length, loading]);

  const handleSend = async (overrideMessage?: string) => {
    const userMessage = (overrideMessage || input).trim();
    if (!userMessage || loading) return;

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
              content: accumulatedContent.trimStart()
            };
          }
          return updated;
        });
      }

      // Refresh suggestions after completion
      setCurrentSuggestions(getRandomSuggestions(4));

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
        <p className="project-subtitle">Beyond SOTA accuracy with fine-tuned Phi-3-mini + multi-stage RAG</p>
      </div>

      <div className="project-content">
        <div className="info-panel">
          <h3>Architectural Overview</h3>
          <p>
            <strong>Beyond SOTA Accuracy:</strong> Built a Phi-3-mini (3.8B) LLM+RAG pipeline that improved accuracy from 53.4% to <b>76.5% on MedQA dataset</b>, surpassing all published models under 10B parameters.
          </p>
          <ul>
            <li>
              <b>LLM:</b> Applied a two-phase fine-tuning strategy using Hugging Face Transformers:
              (1) domain-specific fine-tuning on the 410k UltraMedical dataset to provide foundational medical knowledge, and
              (2) context-aware fine-tuning to improve utilization of retrieved documents.
            </li>
            <li>
              <b>RAG:</b> Built a C++ BM25 search engine over 23M PubMed abstracts and a multi-stage retrieval pipeline integrating BM25, SPLADE sparse retrieval, dense embeddings, and pointwise/listwise re-ranking, with a majority-voting ensemble.
            </li>
            <li><b>Real-time Inference:</b> vLLM serving on Modal's serverless GPU for low-latency responses.</li>
          </ul>
        </div>

        <div className="demo-panel">
          {isModelInitializing ? (
            <div className="initialization-overlay">
              <div className="pulse-icon">🩺</div>
              <div className="status-message">
                The Medical Q&A model is initializing. This can take about 60 seconds during a cold start.
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
                  <div className="empty-chat-state">
                    <p>Ask a medical question to start the conversation.</p>
                    <div className="suggested-questions">
                      {currentSuggestions.map((q, i) => (
                        <button
                          key={i}
                          className="suggestion-chip"
                          onClick={() => handleSend(q)}
                          disabled={loading}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                    {msg.content}
                  </div>
                ))}
                {!loading && messages.length > 0 && (
                  <div className="follow-up-suggestions">
                    <p className="suggestion-label">Suggested questions:</p>
                    <div className="suggested-questions">
                      {currentSuggestions.map((q, i) => (
                        <button
                          key={i}
                          className="suggestion-chip"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
