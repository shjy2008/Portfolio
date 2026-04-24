import React from 'react';
import Link from 'next/link';
// Styles (BertSentiment.css) are imported globally in pages/_app.tsx

const MedicalQA: React.FC = () => {
  return (
    <div className="project-page-container">
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
            The system achieved 76.5% accuracy on the MedQA dataset, outperforming all published open-weight models under 10B parameters.
          </p>
          <ul>
            <li><b>LLM Fine-tuning:</b> Conducted a two-phase fine-tuning on Microsoft's Phi-3-mini (3.8B parameters) using the 410k UltraMedical dataset for foundational knowledge and context-aware fine-tuning for document synthesis.</li>
            <li><b>RAG Pipeline:</b> A robust multi-stage retrieval system combining BM25, SPLADE sparse retrieval, dense embeddings, and point-wise/list-wise re-ranking.</li>
            <li><b>Ensemble Strategy:</b> Utilizes a majority voting ensemble across retrieved contexts to maximize answering accuracy.</li>
          </ul>
        </div>

        <div className="demo-panel" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩺</div>
          {/* <h2>Live Inference Coming Soon...</h2> */}
          <h2>Due to GPU resource limitations, live inference is not available</h2>
        </div>
      </div>
    </div>
  );
};

export default MedicalQA;
