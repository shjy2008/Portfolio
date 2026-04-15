import React from 'react';
import Link from 'next/link';
// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules

const Games: React.FC = () => {
  const gameProjects = [
    {
      id: 'onmyoji',
      title: 'Onmyoji & Onmyoji: Yokai Koya',
      role: 'Technical Lead | NetEase Games',
      description: 'Globally successful mobile games with over 250M+ downloads. Led the core gameplay development, developed cross-platform map SDKs (LBS), and engineered a complex physics-based pinball battle engine utilizing frame-synchronization to minimize server load.',
      tags: ['C++', 'Python', 'NeoX Engine', 'OpenGL']
    },
    {
      id: 'magic-road',
      title: 'Magic Road',
      role: 'Independent Developer',
      description: 'A 3D casual runner game where players navigate a dynamically generating magical pathway. Handles complex procedural generation and object pooling to maintain high performance on mobile devices.',
      tags: ['Unity', 'C#', '3D Math']
    },
    {
      id: 'bumper-car',
      title: 'Bumper Car',
      role: 'Independent Developer',
      description: 'An arena-based bumper car game featuring custom vehicle physics and collision detection, challenging players to knock opponents off the platform.',
      tags: ['Unity', 'C#', 'Physics']
    },
    {
      id: 'teeth-guardian',
      title: 'Teeth Guardian',
      role: 'Independent Developer',
      description: 'An educational oral health game built with CocosCreator. Implemented the complete front-end battle mechanics, UI systems, and REST API communication with the backend.',
      tags: ['TypeScript', 'CocosCreator', 'Web APIs']
    }
  ];

  return (
    <div className="project-page-container">
      <Link href="/#projects" className="back-link">← Back to Home</Link>
      <div className="project-header" style={{ marginBottom: '3rem' }}>
        <h1 className="project-title">Game Development Portfolio</h1>
        <p className="project-subtitle">10+ Years of Engineering Interactive Worlds</p>
      </div>

      <div className="games-grid">
        {gameProjects.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-card-content">
              <h2 className="game-title">{game.title}</h2>
              <div className="game-role">{game.role}</div>
              <p className="game-desc">{game.description}</p>
              <div className="game-tags">
                {game.tags.map(tag => (
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

