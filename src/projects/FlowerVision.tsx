import React from 'react';
import { Link } from 'react-router-dom';
import './BertSentiment.css'; // Reuse common project styling

const FlowerVision: React.FC = () => {
  return (
    <div className="project-page-container">
      <Link to="/#projects" className="back-link">← Back to Home</Link>
      <div className="project-header">
        <h1 className="project-title">Flower Vision & Generation</h1>
        <p className="project-subtitle">Computer Vision Pipeline (Backend Under Maintenance)</p>
      </div>

      <div className="project-content">
        <div className="info-panel">
          <h3>About this Project</h3>
          <p>
            An end-to-end Computer Vision project combining image classification and generative AI.
          </p>
          <ul>
            <li><b>CNN Classifier:</b> Trained on the Oxford Flower dataset using PyTorch, achieving 81% accuracy on the 10-class dataset and 72% on the 102-class dataset.</li>
            <li><b>Latent Diffusion Model:</b> A generative AI implementation utilizing an autoencoder and U-Net denoising architecture to synthesize realistic flower images from noise.</li>
          </ul>
        </div>

        <div className="demo-panel" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
          <h2>Interactive Demo Coming Soon</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            The Web UI for the Latent Diffusion generator is currently being wired to the PyTorch backend. 
            Check back later to generate realistic flower images on the fly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlowerVision;
