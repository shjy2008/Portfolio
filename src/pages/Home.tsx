import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import photograph from '../assets/Photograph.jpg';
import skillsImg from '../assets/Skills.png';

const Home: React.FC = () => {
  const projects = [
    {
      id: 'pubmed-search',
      name: 'BM25 Search Engine',
      description: 'C++ BM25 search engine over 23M PubMed abstracts. Deployed on AWS EC2 with inverted index files (50GB) and React front-end.',
      tag: 'C++ • AWS • React',
      path: '/search-engine'
    },
    {
      id: 'bert-sentiment',
      name: 'BERT Sentiment Analysis',
      description: 'Fine-tuned BERT NLP model achieving 98.4% accuracy on IMDB. Interactive multi-task sentiment prediction for binary and 5-star ratings.',
      tag: 'NLP • PyTorch • BERT',
      path: '/sentiment-analysis'
    },
    {
      id: 'flower-cv',
      name: 'Flower Classifier & Generator',
      description: 'CNN image classifier and Latent Diffusion generator using autoencoder and U-Net denoising architecture.',
      tag: 'CV • PyTorch • Diffusion',
      path: '/flower-vision'
    },
    {
      id: 'med-qa',
      name: 'LLM+RAG Medical Q&A',
      description: 'Phi-3-mini (3.8B) based system achieving 76.5% accuracy on MedQA, surpassing SOTA models under 10B parameters. Integrating SPLADE and dense embeddings.',
      tag: 'LLM • RAG • HuggingFace',
      path: '/medical-qa'
    },
    {
      id: 'game-dev',
      name: 'Game Development Portfolio',
      description: '10+ years of game dev including Technical Lead for Onmyoji (250M+ downloads), and multiple Unity/Cocos independent titles.',
      tag: 'Unity • C# • C++ • Cocos',
      path: '/games'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-flex">
          <div className="hero-avatar">
            <img src={photograph} alt="Junyi Shen" />
          </div>
          <div className="hero-text-content">
            <h1 className="hero-title">Junyi Shen</h1>
            <p className="hero-subtitle">Senior Software Engineer & AI Researcher</p>
            <div className="hero-contact">
              <a href="mailto:shjy2015@gmail.com">shjy2015@gmail.com</a> • <span>Auckland, NZ</span>
            </div>
            <p className="hero-intro">
              10+ years Senior Software Engineer, including 7+ years at <b>NetEase Games</b> where I led a 10-engineer team to deliver the
              globally successful mobile game <b>Onmyoji</b> (250M+ downloads). Inventor of 3 technical patents.
              Master of Applied Science with Distinction from the University of Otago. Expert in C++ and Python, with a strong foundation in LLMs and RAG.
            </p>
            <div className="hero-badges">
              <a href="https://github.com/shjy2008" target="_blank" rel="noreferrer" className="badge">GitHub</a>
              <a href="https://linkedin.com/in/junyi-shen-4122a62b8" target="_blank" rel="noreferrer" className="badge">LinkedIn</a>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <main id="projects" className="projects-section">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <Link key={project.id} to={project.path} className="project-card">
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

      {/* Skills Section */}
      <section className="skills-section">
        <h2 className="section-title">Technical Expertise</h2>
        <div className="skills-content">
          <div className="skills-text">
            <div className="skill-group">
              <h3>Programming Languages</h3>
              <p>C++, Python, TypeScript, C#, Java, GLSL, SQL</p>
            </div>
            <div className="skill-group">
              <h3>AI & Data Science</h3>
              <p>LLMs, RAG, PyTorch, HuggingFace, BERT, NLP, CV, Information Retrieval</p>
            </div>
            <div className="skill-group">
              <h3>Infrastructure & Cloud</h3>
              <p>AWS (EC2, S3, CloudFront), Docker, MongoDB, Redis, Linux</p>
            </div>
            <div className="skill-group">
              <h3>Specialties</h3>
              <p>Game Engines (Unity, Cocos, NeoX), Graphics (OpenGL), High-Performance Systems</p>
            </div>
          </div>
          <div className="skills-visual">
            <img src={skillsImg} alt="Technical Skills Chart" />
          </div>
        </div>
      </section>

      {/* Career Narrative */}
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
