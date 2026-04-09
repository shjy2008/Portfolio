import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BertSentiment.css';

const BertSentiment: React.FC = () => {
  const [text, setText] = useState('');
  const [task, setTask] = useState<'cfimdb' | 'sst5'>('cfimdb');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'https://junyishen.com';
    const endpoint = `${baseUrl}/api/bert/predict/${task}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: text }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Parse the response based on the task
      if (task === 'cfimdb') {
        const sentiment = data.pred === 1 ? 'Positive (1)' : 'Negative (0)';
        setResult(`Result: ${sentiment}`);
      } else {
        setResult(`Rating: ${data.pred + 1} / 5 Stars`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-page-container">
      <Link to="/#projects" className="back-link">← Back to Home</Link>
      <div className="project-header">
        <h1 className="project-title">BERT Sentiment Classifier</h1>
        <p className="project-subtitle">Natural Language Processing API</p>
      </div>

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

          <textarea
            className="text-input"
            placeholder="Type a sentence or movie review here to analyze its sentiment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />

          <button
            className="primary-button"
            onClick={analyzeSentiment}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className={`result-box ${result.includes('Positive') || result.includes('4') || result.includes('5') ? 'positive' : 'negative'}`}>
              <h3>{result}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BertSentiment;
