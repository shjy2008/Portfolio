import React from 'react';
import Image from 'next/image';
import photograph from '../../assets/Photograph.jpg';
import skillsImg from '../../assets/Skills.png';
import BertSentiment from '../../projects/BertSentiment';
import FlowerVision from '../../projects/FlowerVision';
import Link from 'next/link';

const Home: React.FC = () => {
  const otherProjects = [
    {
      id: 'pubmed-search',
      name: 'BM25 Search Engine',
      description: 'C++ BM25 search engine over 23M PubMed abstracts. Deployed on AWS EC2 with inverted index files (50GB) and React front-end.',
      tag: 'C++ • AWS • React',
      path: '/search-engine',
    },
    {
      id: 'med-qa',
      name: 'LLM+RAG Medical Q&A',
      description: 'Phi-3-mini (3.8B) based system achieving 76.5% accuracy on MedQA, surpassing SOTA models under 10B parameters. Integrating SPLADE and dense embeddings.',
      tag: 'LLM • RAG • HuggingFace',
      path: '/medical-qa',
    },
    {
      id: 'game-dev',
      name: 'Game Development Portfolio',
      description: '10+ years of game dev including Technical Lead for Onmyoji (250M+ downloads), and multiple Unity/Cocos independent titles.',
      tag: 'Unity • C# • C++ • Cocos',
      path: '/games',
    },
  ];

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-flex">
          <div className="hero-avatar">
            <Image src={photograph} alt="Junyi Shen" width={250} height={250} className="hero-avatar-image" loading="eager" />
          </div>
          <div className="hero-text-content">
            <h1 className="hero-title">Junyi Shen</h1>
            <p className="hero-subtitle">Senior Software & AI Engineer</p>
            <div className="hero-contact">
              <a href="mailto:shjy2015@gmail.com">shjy2015@gmail.com</a> • <span>Auckland, NZ</span>
            </div>
            <div className="hero-badges">
              <a href="https://github.com/shjy2008" target="_blank" rel="noreferrer" className="badge">GitHub</a>
              <a href="https://linkedin.com/in/junyi-shen-4122a62b8" target="_blank" rel="noreferrer" className="badge">LinkedIn</a>
            </div>
          </div>
        </div>
      </header>

      <section id="interactive-projects" className="interactive-section">
        <h2 className="section-title">Deep Learning Showcases</h2>
        <div className="vertical-interactive-stack">
          <div className="interactive-panel-card">
            <div className="panel-header">
              <span className="project-tag">CV • PyTorch • Diffusion</span>
              <h3>Flower Classifier & Generator</h3>
              <p>End-to-end Computer Vision pipeline featuring a CNN classifier and a Latent Diffusion U-Net generator.</p>
            </div>
            <FlowerVision />
          </div>

          <div className="interactive-panel-card">
            <div className="panel-header">
              <span className="project-tag">NLP • PyTorch • BERT</span>
              <h3>BERT Sentiment Analysis</h3>
              <p>Fine-tuned BERT model for IMDB (Binary) and SST-5 (Fine-grained) sentiment classification task.</p>
            </div>
            <BertSentiment />
          </div>
        </div>
      </section>

      <main id="projects" className="projects-section">
        <h2 className="section-title">System & Game Projects</h2>
        <div className="projects-grid">
          {otherProjects.map((project) => (
            <Link key={project.id} href={project.path} className="project-card">
              <span className="project-tag">{project.tag}</span>
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-link">
                View Project <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <section className="my-skills-panel">
        <div className="skills-hero-content">
          <div className="hero-text-content">
            <h2 className="section-title">About Me & Skills</h2>
            <p className="hero-intro">
              10+ years Senior Software Engineer, including 7+ years at <b>NetEase Games</b> where I led a 10-engineer team to deliver the
              globally successful mobile game <b>Onmyoji</b> (250M+ downloads). Master of Applied Science with Distinction (GPA 8.6/9.0) from the University of Otago.
            </p>
          </div>
          <div className="skills-visual-side">
            <Image src={skillsImg} alt="Technical Skills Chart" className="skills-small-img" />
          </div>
        </div>
      </section>

      <section className="narrative-section">
        <h2 className="section-title">Career Milestones</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">2024 - 2025</div>
            <div className="timeline-content">
              <h3>Master of Applied Science @ University of Otago</h3>
              <p>Graduated with Distinction (GPA 8.6/9.0). Specialized in AI, Deep Learning, and Information Retrieval. Developed a Phi-3-based medical RAG system that surpassed industry SOTA benchmarks.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">2022 - Present</div>
            <div className="timeline-content">
              <h3>Independent Software Developer</h3>
              <p>Developed multiple 3D casual games in Unity (C#) and the front-end for 'Teeth Guardian' using TypeScript and CocosCreator.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">2015 - 2022</div>
            <div className="timeline-content">
              <h3>Senior Software Engineer / Tech Lead @ NetEase Games</h3>
              <p>Led a 10-engineer team for <i>Onmyoji: Yokai Koya</i>. Developed core cross-platform SDKs, UI systems, and optimized engine performance across CPU/GPU for 250M+ users. Inventor of 3 patents in game technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
