import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BertSentiment.css';

interface BertSentimentProps {
  isEmbedded?: boolean;
}

const BertSentiment: React.FC<BertSentimentProps> = ({ isEmbedded = false }) => {
  type AnalyticsResult =
    | { task: 'cfimdb'; isPositive: boolean; confidence: number }
    | { task: 'sst5'; rating: number; confidence: number };

  const [text, setText] = useState('');
  const [task, setTask] = useState<'cfimdb' | 'sst5'>('cfimdb');
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const isDev = false; // Now simply use Modal even when dev, so set to false //import.meta.env.DEV;
  const baseUrl = isDev ? 'http://localhost:8000' : 'https://shjy2015--bert-sentiment-classifier-web-app.modal.run';

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    // Trigger cold start on load
    fetch(`${baseUrl}/api/bert/health`).catch(() => {
      // Ignore errors, we just want to wake it up
    });
  }, [baseUrl]);

  const analyzeSentiment = async (overrideText?: string) => {
    const textToProcess = typeof overrideText === 'string' ? overrideText : text;
    if (!textToProcess.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const endpoint = `${baseUrl}/api/bert/predict/${task}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: textToProcess }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

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

  return (
    <div className={isEmbedded ? "embedded-project-container" : "project-page-container"}>
      {!isEmbedded && (
        <>
          <Link to="/#projects" className="back-link">← Back to Home</Link>
          <div className="project-header">
            <h1 className="project-title">BERT Sentiment Classifier</h1>
            <p className="project-subtitle">Natural Language Processing API</p>
          </div>
        </>
      )}

      <div className="project-content">
        <div className="info-panel">
          <h3>About this Project</h3>
          <p>
            This interactive demo relies on a custom fine-tuned BERT model running on a live PyTorch backend.
            It supports two distinct NLP classification tasks:
          </p>
          <ul>
            <li><b>IMDB Binary Classification:</b> Trained on the CFIMDB dataset to predict whether a movie review is Positive or Negative. Achieved 98.4% accuracy.</li>
            <li><b>SST-5 Fine-Grained Classification:</b> Trained on the Stanford Sentiment Treebank to predict a sentiment rating on a 1 to 5 scale. Achieved 59.4% accuracy.</li>
            <li><b>Real-time Inference:</b> The backend performs classification instantly via a REST API, deployed on Modal's serverless GPU infrastructure.</li>
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
              <button
                className="chip"
                onClick={() => {
                  const example = "This movie was absolutely fantastic! I loved every minute of it.";
                  setText(example);
                  analyzeSentiment(example);
                }}
              >
                "This movie was absolutely fantastic..."
              </button>
              <button
                className="chip"
                onClick={() => {
                  const example = "Terrible acting, the plot makes no sense. Complete waste of time.";
                  setText(example);
                  analyzeSentiment(example);
                }}
              >
                "Terrible acting, the plot makes..."
              </button>
              <button
                className="chip"
                onClick={() => {
                  const example = "It was okay, not the best but watchable on a Sunday afternoon.";
                  setText(example);
                  analyzeSentiment(example);
                }}
              >
                "It was okay, not the best..."
              </button>
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
