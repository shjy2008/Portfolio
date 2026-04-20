import React from 'react';
import Image from 'next/image';
import photograph from '../../assets/Photograph.jpg';
import skillsImg from '../../assets/Skills.png';
import BertSentiment from '../../projects/BertSentiment';
import FlowerVision from '../../projects/FlowerVision';
import Link from 'next/link';
import PreWarmApis from './PreWarmApis';

const Home: React.FC = () => {
  const otherProjects = [
    {
      id: 'pubmed-search',
      name: 'Medical Search Engine',
      description: 'C++ BM25 search engine over 23M PubMed abstracts, achieving sub-100ms response times on a 50GB index stored in AWS S3 and Modal Volume.',
      tag: 'C++ • Information Retrieval',
      path: '/search-engine',
    },
    {
      id: 'med-qa',
      name: 'LLM+RAG Medical Q&A',
      description: 'Phi-3-mini (3.8B) based system achieving 76.5% accuracy on MedQA, surpassing SOTA models under 10B parameters.',
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
      <PreWarmApis />
      <header className="hero-section">
        <div className="hero-flex">
          <div className="hero-avatar">
            <Image src={photograph} alt="Junyi Shen" width={250} height={250} className="hero-avatar-image" loading="eager" />
          </div>
          <div className="hero-text-content">
            <h1 className="hero-title">Junyi Shen</h1>
            <p className="hero-subtitle">Senior Software Engineer & AI Engineer</p>
            <p> 
              A high-output engineer bridging domains: from commercial game architecture and full-stack development to training PyTorch models and end-to-end AI deployment.</p>
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
              Senior Software Engineer and AI Engineer with 10+ years of experience delivering high-impact products. Former senior software engineer and tech lead at <b>NetEase Games</b>, where I developed large-scale products like Onmyoji (250M+ downloads).
              Master of Applied Science with Distinction from the University of Otago (GPA 8.6/9.0), focused on AI, deep learning, and information retrieval.
              A high-output engineer bridging domains: from commercial game architecture and full-stack development to training PyTorch models and end-to-end AI deployment.
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
              <h3>Master of Applied Science, University of Otago</h3>
              <p>Graduated with Distinction (GPA <b>8.6/9.0</b>), specializing in AI, Deep Learning, and Information Retrieval. Built a Phi-3-mini (3.8B) LLM+RAG medical QA system that improved MedQA accuracy from 53.4% to 76.5%, surpassing all published models under 10B parameters.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">2022 - Present</div>
            <div className="timeline-content">
              <h3>Independent Software Developer (Contract / Outsourcing)</h3>
              <ul>
                <li>Delivered <b>commercial software</b> and game-development projects for external clients as a freelance/outsourcing engineer, from feature planning to release.</li>
                <li>
                  Developed <b>Unity (C#)</b> game projects including{' '}
                  Magic Road{' '}
                  <a className="timeline-link" href="https://github.com/shjy2008/DrawRoadGame" target="_blank" rel="noreferrer">[GitHub]</a>,{' '}
                  Bumper Car{' '}
                  <a className="timeline-link" href="https://github.com/shjy2008/BumperCar" target="_blank" rel="noreferrer">[GitHub]</a>,{' '}
                  Fight 2048{' '}
                  <a className="timeline-link" href="https://github.com/shjy2008/Fight2048" target="_blank" rel="noreferrer">[GitHub]</a>, and{' '}
                  Card Battle{' '}
                  <a className="timeline-link" href="https://github.com/shjy2008/CardBattle" target="_blank" rel="noreferrer">[GitHub]</a>, implementing gameplay logic, graphics, and user interactions.
                </li>
                <li>Implemented the full front-end of <i>Teeth Guardian</i> using <b>TypeScript</b> and CocosCreator, including battle mechanics and UI, with <b>REST API</b> integration.</li>
                <li>Collaborated with client stakeholders to convert product requirements into production-ready deliverables with maintainable code and on-time delivery.</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">2015 - 2022</div>
            <div className="timeline-content">
              <h3>Senior Software Engineer / Tech Lead @ NetEase Games (NASDAQ: NTES)</h3>
              <ul>
                <li><b>Onmyoji</b> (<a className="timeline-link" href="https://yys.163.com/" target="_blank" rel="noreferrer">Official Site</a>): <b>250M+ downloads</b>, App Store and Google Play <b>Best of 2017</b>; contributed from early concept through launch and live operations.</li>
                <li>Led front-end system development with <b>Python</b> and <b>C++</b> on NetEase NeoX engine, delivering core UI systems (chat, friend, guild) and optimizing <b>CPU/GPU/memory</b> performance for low-end mobile devices.</li>
                <li>Implemented a cross-platform <b>LBS Map SDK</b> integration (iOS/Android/Web), including OpenGL context conflict resolution, map interaction, marker rendering, and 3D model display; solution was reused across NetEase projects.</li>
                <li><b>Onmyoji: Yokai Koya</b> (<a className="timeline-link" href="https://yysygw.163.com/" target="_blank" rel="noreferrer">Official Site</a>): reached Top 5 on China App Store in 2020; owned full development of the physics-based pinball battle system and used frame synchronization to reduce server load and improve gameplay smoothness.</li>
                <li>As <b>Technical Lead</b>, led a team of 10 engineers, owned system architecture and complex technical problem-solving, mentored junior engineers, and managed full-lifecycle delivery with Git and SVN.</li>
                <li><b>Inventor of 3 patents</b>: CN201910792871.4, CN201610664229.4, CN201610630096.9 (<a className="timeline-link" href="https://pss-system.cponline.cnipa.gov.cn/conventionalSearch" target="_blank" rel="noreferrer">CNIPA Search</a>).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-stack-section">
        <div className="stack-content">
          <h2 className="section-title">Portfolio Tech Stack</h2>
          <ul>
            <li><strong>Front-end:</strong> Next.js, React, TypeScript, CSS</li>
            <li><strong>Back-end:</strong> Next.js API routes, FastAPI</li>
            <li><strong>Current deployment:</strong> Vercel and Modal</li>
            <li><strong>AWS experience:</strong> EC2, ECS/Fargate, S3, CloudFront</li>
            <li><strong>CI/CD:</strong> GitHub Actions</li>
            <li><strong>AI services:</strong> Custom PyTorch models exposed through FastAPI</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
