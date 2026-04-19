"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchHealthOnce } from '../lib/client/healthCheck';

// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules



const BertSentiment: React.FC = () => {
  type AnalyticsResult =
    | { task: 'cfimdb'; isPositive: boolean; confidence: number }
    | { task: 'sst5'; rating: number; confidence: number };

  const [text, setText] = useState('');
  const [task, setTask] = useState<'cfimdb' | 'sst5'>('cfimdb');
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelInitializing, setIsModelInitializing] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    fetchHealthOnce('/api/bert/health').then(({ initialized }) => {
      setIsModelInitializing(!initialized);
    });
  }, []);

  const analyzeSentiment = async (overrideText?: string) => {
    const textToProcess = typeof overrideText === 'string' ? overrideText : text;
    if (!textToProcess.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/bert/predict/${task}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: textToProcess }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        if (payload?.code === 'MODEL_INITIALIZING') {
          setIsModelInitializing(true);
          throw new Error(payload.message);
        }

        throw new Error(payload?.message || payload?.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      setIsModelInitializing(false);

      // Parse the response based on the task
      if (task === 'cfimdb') {
        setResult({ task: 'cfimdb', isPositive: data.pred === 1, confidence: data.confidence });
      } else {
        setResult({ task: 'sst5', rating: data.pred + 1, confidence: data.confidence });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the text.');
    } finally {
      setLoading(false);
    }
  };

  // Automatically analyze when the task is switched if there is text in the box
  useEffect(() => {
    if (text.trim()) {
      analyzeSentiment();
    }
    // We only want to trigger this when the task changes, not on every text change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  return (
    <div className="project-container">
      <div className="project-content">
        <div className="info-panel">
          <h3>About this Project</h3>
          <p>
            This interactive demo relies on a custom fine-tuned BERT model running on a live PyTorch backend.
            It supports two distinct NLP classification tasks:
          </p>
          <ul>
            <li><b>IMDB Binary Classification:</b> Trained on the CFIMDB dataset to predict whether a movie review is Positive or Negative. Improved accuracy from baseline <b>78.9%</b> to <b>98.4%</b> by performing random hyper-parameter tuning on learning rate, batch size, dropout, weight decay, and layer freezing.</li>
            <li><b>SST-5 Fine-Grained Classification:</b> Trained on the Stanford Sentiment Treebank to predict a sentiment rating from 1 to 5. Improved accuracy from <b>43.2%</b> to <b>59.4%</b> by implementing CORAL loss for ordinal ratings and pre-training on a 3M movie reviews before fine-tuning.</li>
            <li><b>Real-time Inference:</b> The backend performs classification via a REST API with FastAPI, deployed on Modal's serverless GPU infrastructure.</li>
          </ul>
        </div>

        <div className="demo-panel">
          <div className="task-selector">
            <label>
              <input
                type="radio"
                name="task"
                value="cfimdb"
                checked={task === 'cfimdb'}
                onChange={() => setTask('cfimdb')}
              />
              IMDB (Positive/Negative)
            </label>
            <label>
              <input
                type="radio"
                name="task"
                value="sst5"
                checked={task === 'sst5'}
                onChange={() => setTask('sst5')}
              />
              SST-5 (1-5 Star Rating)
            </label>
          </div>

          <div className="suggested-sentences">
            <span className="suggested-label">Try an example:</span>
            <div className="chips">
              {[
                "This movie was absolutely fantastic! I loved every minute of it.",
                "Terrible acting, the plot makes no sense. Complete waste of time.",
                "Visually stunning but the story was a bit lacking in depth.",
                "A masterpiece of modern cinema. Truly breathtaking.",
                "It was okay, not the best but watchable on a Sunday.",
                "The cinematography was great, but dialogue felt wooden.",
                "Absolute garbage. Don't waste your money.",
                "I was pleasantly surprised by how much I enjoyed this!",
                "The plot was predictable and the characters were flat.",
                "Not my cup of tea, but I can see why others like it."
              ].map((example, index) => (
                <button
                  key={index}
                  className="chip"
                  onClick={() => {
                    setText(example);
                    analyzeSentiment(example);
                  }}
                >
                  "{example.length > 30 ? example.substring(0, 30) + '...' : example}"
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="text-input"
            placeholder="Type a sentence here to analyze its sentiment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                analyzeSentiment();
              }
            }}
            rows={5}
          />

          <button
            className="primary-button"
            onClick={() => analyzeSentiment()}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>

          {isModelInitializing && (
            <div className="status-message">
              The sentiment model is initializing. This can take a few seconds during a cold start.
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div ref={resultRef} className={`result-box ${(result.task === 'cfimdb' && result.isPositive) || (result.task === 'sst5' && result.rating >= 3) ? 'positive' : 'negative'}`}>
              {result.task === 'cfimdb' ? (
                <h3>{result.isPositive ? 'Positive' : 'Negative'}</h3>
              ) : (
                <div className="rating-result">
                  <h3>
                    Rating: <span className="highlight-rating">{result.rating}</span> / 5
                  </h3>
                  <div className="stars">
                    {Array.from({ length: result.rating }).map((_, i) => (
                      <span key={i} className="star-icon">⭐</span>
                    ))}
                  </div>
                </div>
              )}
              {result.confidence !== undefined && (
                <div className="confidence-score">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BertSentiment;
