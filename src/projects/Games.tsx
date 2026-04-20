import React from 'react';
import Link from 'next/link';
// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules

const Games: React.FC = () => {
  const gameProjects = [
    {
      id: 'onmyoji',
      title: 'Onmyoji',
      role: 'Senior Software Engineer — NetEase Games (May 2015 – Oct 2022)',
      description:
        'Large-scale mobile RPG (250M+ downloads). Early-stage engineer contributing from concept to launch and live operation. Led development of front-end systems (UI: chat, friends, guild), optimized CPU/GPU/memory performance for low-end devices, and implemented a cross-platform LBS Map SDK (iOS/Android/Web) with OpenGL context conflict solutions, interactive markers, and 3D model rendering. Solution was adopted across multiple NetEase projects.',
      officialUrl: 'https://yys.163.com',
      tags: ['C++', 'Python', 'NeoX Engine', 'OpenGL', 'LBS']
    },
    {
      id: 'yokai-koya',
      title: 'Onmyoji: Yokai Koya',
      role: 'Technical Lead — NetEase Games',
      description:
        'Top-5 China App Store title (2020). Responsible for full development of the core battle system — a physics-based pinball mechanic — using frame-synchronization to reduce server load and smooth gameplay. As Technical Lead, managed a team of 10 engineers, designed system architecture, mentored junior engineers, and handled full lifecycle development with Git and SVN.',
      officialUrl: 'https://yysygw.163.com',
      tags: ['C++', 'NeoX Engine', 'Physics', 'Real-time Sync']
    },
    {
      id: 'magic-road',
      title: 'Magic Road',
      role: 'Independent — Unity / C#',
      description:
        '3D casual runner featuring procedural track generation, object pooling, and mobile performance optimizations. Implemented gameplay logic, asset streaming, and polish for smooth frame rates on constrained devices.',
      githubUrl: 'https://github.com/junyishen/DrawRoadGame',
      tags: ['Unity', 'C#', '3D']
    },
    {
      id: 'bumper-car',
      title: 'Bumper Car',
      role: 'Independent — Unity / C#',
      description:
        'Arena-based bumper car experience with custom vehicle physics and responsive collision handling. Focused on deterministic interactions and performant simulation.',
      githubUrl: 'https://github.com/junyishen/BumperCar',
      tags: ['Unity', 'C#', 'Physics']
    },
    {
      id: 'fight-2048',
      title: 'Fight 2048',
      role: 'Independent — Unity / C#',
      description:
        'Casual competitive mash-up combining 2048-like merging mechanics with real-time combat and progression systems.',
      githubUrl: 'https://github.com/junyishen/Fight2048',
      tags: ['Unity', 'C#', 'Game Design']
    },
    {
      id: 'card-battle',
      title: 'Card Battle',
      role: 'Independent — Unity / C#',
      description: 'A collectible card game prototype with deck-building and battle resolution systems.',
      githubUrl: 'https://github.com/junyishen/CardBattle',
      tags: ['Unity', 'C#', 'Systems']
    },
    {
      id: 'teeth-guardian',
      title: 'Teeth Guardian',
      role: 'Independent — TypeScript / CocosCreator',
      description:
        'Oral health educational game. Implemented the full front-end battle mechanics, UI systems, and REST API integration to communicate with back-end services.',
      tags: ['TypeScript', 'CocosCreator', 'Web APIs']
    }
  ];

  return (
    <div className="project-page-container">
      <Link href="/?from=projects" className="back-link">← Back to Home</Link>
      <div className="project-header" style={{ marginBottom: '3rem' }}>
        <h1 className="project-title">Game Development Portfolio</h1>
      </div>

      <div className="games-grid">
        {gameProjects.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-card-content">
              <h2 className="game-title">{game.title}</h2>
              <div className="game-role">{game.role}</div>
              <p className="game-desc">{game.description}</p>

              <div className="game-links">
                {game.officialUrl && (
                  <a href={game.officialUrl} target="_blank" rel="noopener noreferrer" className="game-link">Official Site</a>
                )}
                {game.githubUrl && (
                  <a href={game.githubUrl} target="_blank" rel="noopener noreferrer" className="game-link">GitHub</a>
                )}
              </div>

              <div className="game-tags">
                {game.tags.map((tag) => (
                  <span key={tag} className="game-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;

