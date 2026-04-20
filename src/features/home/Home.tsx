"use client";

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import photograph from '../../assets/Photograph.jpg';
import skillsImg from '../../assets/Skills.png';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import PreWarmApis from './PreWarmApis';
import tryDemoIcon from '../../assets/icon/try-demo.png';
import { otherProjects } from './projectsData';

const FlowerVision = dynamic(() => import('../../projects/FlowerVision'), { loading: () => <div className="loading-placeholder">Loading Showcase...</div> });
const BertSentiment = dynamic(() => import('../../projects/BertSentiment'), { loading: () => <div className="loading-placeholder">Loading Showcase...</div> });

// --- Sub-components for better React reconciliation ---

const Hero: React.FC = () => (
  <header className="hero-section">
    <div className="hero-flex">
      <div className="hero-avatar">
        <Image src={photograph} alt="Junyi Shen" width={250} height={250} className="hero-avatar-image" loading="eager" />
      </div>
      <div className="hero-text-content">
        <h1 className="hero-title">Junyi Shen</h1>
        <p className="hero-subtitle">
          Software Engineer | AI Engineer | Full Stack Developer
          <br />
          Master of Computer Science, University of Otago
        </p>
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
);

const InteractiveProjects: React.FC = () => (
  <section id="interactive-projects" className="interactive-section">
    <h2 className="section-title">Deep Learning Showcases</h2>
    <div className="vertical-interactive-stack">
      <div className="interactive-panel-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-2.5rem', left: '-3rem', zIndex: 15 }}>
          <Image src={tryDemoIcon} alt="Try Demo" width={160} height={80} className="try-demo-badge" style={{ objectFit: 'contain' }} />
        </div>
        <div className="panel-header">
          <h3>Flower Classifier & Generator</h3>
          <span className="project-tag">Computer Vision • CNN • Diffusion</span>
        </div>
        <FlowerVision />
      </div>

      <div className="interactive-panel-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-2.5rem', left: '-3rem', zIndex: 15 }}>
          <Image src={tryDemoIcon} alt="Try Demo" width={160} height={80} className="try-demo-badge" style={{ objectFit: 'contain' }} />
        </div>
        <div className="panel-header">
          <h3>BERT Sentiment Analysis</h3>
          <span className="project-tag">NLP • PyTorch • BERT</span>
        </div>
        <BertSentiment />
      </div>
    </div>
  </section>
);

const ProjectCard: React.FC<{ project: typeof otherProjects[0] }> = ({ project }) => (
  <Link href={project.path} className="project-card">
    {project.showDemoBadge && (
      <div style={{ position: 'absolute', top: '-1.8rem', left: '-2.2rem', zIndex: 15 }}>
        <Image src={tryDemoIcon} alt="Try Demo" width={140} height={70} className="try-demo-badge" style={{ objectFit: 'contain' }} />
      </div>
    )}
    <div className="project-card-content">
      <span className="project-tag">{project.tag}</span>
      <h3 className="project-name">{project.name}</h3>
      <p className="project-desc">{project.description}</p>
      <div className="project-link">
        View Project <span>→</span>
      </div>
    </div>
  </Link>
);

const ProjectsGrid: React.FC = () => (
  <main id="projects" className="projects-section">
    <h2 className="section-title">System & Game Projects</h2>
    <div className="projects-grid">
      {otherProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  </main>
);

const AboutAndSkills: React.FC = () => (
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
        <Image src={skillsImg} alt="Technical Skills Chart" className="skills-small-img" width={650} height={650} priority={false} />
      </div>
    </div>
  </section>
);

const CareerMilestones: React.FC = () => (
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
          <h3>Software Developer (Contract / Remote)</h3>
          <ul>
            <li>Delivered <b>commercial software</b> and game-development projects for external clients, from feature planning to release.</li>
            <li>Developed Unity (C#) projects: Magic Road, Bumper Car, Fight 2048, and Card Battle.</li>
            <li>Implemented Teeth Guardian using <b>TypeScript</b> and CocosCreator with REST API integration.</li>
            <li>Collaborated with client stakeholders to convert product requirements into production-ready deliverables with maintainable code and on-time delivery.</li>
          </ul>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-date">2015 - 2022</div>
        <div className="timeline-content">
          <h3>Senior Software Engineer / Tech Lead @ NetEase Games (NASDAQ: NTES)</h3>
          <ul>
            <li><b>Onmyoji</b> (<a className="timeline-link" href="https://yys.163.com/" target="_blank" rel="noreferrer">Official Site</a>): 250M+ downloads; developed core front-end systems, implemented a cross-platform LBS Map SDK integration, and optimized CPU/GPU/memory performance.</li>
            <li><b>Onmyoji: Yokai Koya</b> (<a className="timeline-link" href="https://yysygw.163.com/" target="_blank" rel="noreferrer">Official Site</a>): Top 5 on App Store; developed the physics-based pinball battle system using frame synchronization between front-end and back-end.</li>
            <li>Led a team of 10 engineers, responsible for system architecture, and <b>invented 3 patents</b>.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const Home: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'projects') {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        router.replace('/', { scroll: false });
      }
    }
  }, [searchParams, router]);

  return (
    <div className="home-container">
      <PreWarmApis />
      <Hero />
      <InteractiveProjects />
      <ProjectsGrid />
      <AboutAndSkills />
      <CareerMilestones />
      <section className="portfolio-stack-section">
        <div className="stack-content">
          <h2 className="section-title">Portfolio Tech Stack</h2>
          <ul>
            <li><strong>Front-end:</strong> Next.js, React, TypeScript, CSS</li>
            <li><strong>Back-end:</strong> Next.js API routes, FastAPI</li>
            <li><strong>Deployment:</strong> Vercel and Modal</li>
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
