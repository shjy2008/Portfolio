"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchHealthOnce } from '../lib/client/healthCheck';
import NextImage from 'next/image';
import tryMeIcon from '../assets/icon/try.png';

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
            Fine-tuned BERT model for IMDB (Binary) and SST-5 (Fine-grained) sentiment classification.
          </p>
          <ul>
            <li><b>Binary Classification:</b> Trained on the IMDB dataset to predict whether a movie review is Positive or Negative. Improved accuracy from baseline <b>78.9%</b> to <b>98.4%</b> by performing random hyper-parameter tuning on learning rate, batch size, dropout, weight decay, and layer freezing.</li>
            <li><b>Fine-grained Classification:</b> Pre-trained on 3 million movie reviews and fine-tuned on the <a href="https://huggingface.co/datasets/SetFit/sst5" target="_blank" rel="noopener noreferrer" className="dataset-link">Stanford Sentiment Treebank</a> to predict a sentiment rating from 1 to 5. Improved accuracy from <b>43.2%</b> to <b>59.4%</b> by implementing CORAL loss for ordinal ratings.</li>
            <li><b>Real-time Inference:</b> FastAPI endpoint deployed on Modal's serverless CPU.</li>
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

          <div className="sentiment-main-layout">
            <div className="sentiment-left-side">
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
            </div>

            <div className="sentiment-right-side">
              <div className="suggested-sentences">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', marginBottom: '0.5rem', marginLeft: '-1rem' }}>
                  <NextImage src={tryMeIcon} alt="Try me" width={100} height={50} className="floating-icon" style={{ objectFit: 'contain' }} />
                  <span className="suggested-label">Click an example</span>
                </div>
                <div className="chips">
                  {[
                    "This movie was absolutely fantastic! I loved every minute of it.",
                    "Terrible acting, the plot makes no sense. Complete waste of time.",
                    "It was okay, not the best but watchable on a Sunday.",
                    "The cinematography was great, but dialogue felt wooden.",
                  ].map((example, index) => (
                    <button
                      key={index}
                      className="chip"
                      onClick={() => {
                        setText(example);
                        analyzeSentiment(example);
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {(isModelInitializing || error) && (
            <div className="sentiment-status-container">
              {isModelInitializing && (
                <div className="status-message">
                  The sentiment model is initializing. This can take a few seconds during a cold start.
                </div>
              )}
              {error && <div className="error-message" style={{ marginTop: '0.5rem' }}>{error}</div>}
            </div>
          )}

          {(result || loading) && (
            <div className="sentiment-result-container">
              <div
                ref={resultRef}
                className={`result-box bert-result ${loading ? 'loading-pulse' : (result?.task === 'cfimdb' ? (result.isPositive ? 'positive' : 'negative') : (result?.rating && result.rating >= 3 ? 'positive' : 'negative'))}`}
              >
                {result ? (
                  <>
                    {result.task === 'cfimdb' ? (
                      <h3 className="prediction-class">{result.isPositive ? 'POSITIVE' : 'NEGATIVE'}</h3>
                    ) : (
                      <div className="rating-result">
                        <h3 className="prediction-class">
                          RATING: <span className="highlight-rating">{result.rating}</span> / 5
                        </h3>
                      </div>
                    )}

                    <div className="prediction-details">
                      {result.task === 'sst5' && (
                        <div className="detail-item">
                          <span className="detail-label">Sentiment</span>
                          <div className="stars" style={{ display: 'flex', gap: '0.2rem' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="star-icon" style={{ opacity: i < (result.rating || 0) ? 1 : 0.2 }}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.confidence !== undefined && (
                        <div className="detail-item">
                          <span className="detail-label">Confidence</span>
                          <span className="detail-value">{(result.confidence * 100).toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : loading ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <h3 className="prediction-class" style={{ opacity: 0.7 }}>
                      {isModelInitializing ? 'INITIALIZING...' : 'PROCESSING...'}
                    </h3>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BertSentiment;
