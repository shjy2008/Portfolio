"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import arrow from '../assets/icon/arrow.png';

interface GameProject {
  id: string;
  title: string;
  role: string;
  description: string;
  officialUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  videoUrls?: string[];
  imageUrls?: string[];
  tags: string[];
  aspect?: 'portrait' | 'landscape';
}

const GameCard: React.FC<{ game: GameProject }> = ({ game }) => {
  const mediaItems = [
    ...(game.videoUrls || (game.videoUrl ? [game.videoUrl] : [])),
    ...(game.imageUrls || [])
  ];

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(mediaItems.length > 1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = () => {
    checkScroll();
  };

  const navigate = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const width = sliderRef.current.getBoundingClientRect().width;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -width : width,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mediaItems.length <= 1) return;
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeftState(sliderRef.current?.scrollLeft || 0);
  };

  const endDragging = () => {
    if (!isDragging || !sliderRef.current) return;

    const slider = sliderRef.current;
    const scrollX = slider.scrollLeft;
    const width = slider.getBoundingClientRect().width;

    setIsDragging(false);

    const targetIndex = Math.round(scrollX / width);
    slider.scrollTo({
      left: targetIndex * width,
      behavior: 'smooth'
    });
  };

  const handleMouseLeave = () => {
    endDragging();
  };

  const handleMouseUp = () => {
    endDragging();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className={`game-card ${game.id} ${mediaItems.length === 0 ? 'no-media' : ''} ${game.aspect || 'portrait'}`}>
      {mediaItems.length > 0 && (
        <div className="game-media-side">
          <div
            className={`game-media-slider ${isDragging ? 'dragging' : ''}`}
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {mediaItems.map((item, idx) => {
              const isVideo = item.toLowerCase().endsWith('.mp4');
              const posterImage = game.imageUrls?.[0];
              return (
                <div key={idx} className="game-media-item">
                  {isVideo ? (
                    <video 
                      className="game-media-video" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      poster={posterImage}
                    >
                      <source src={item} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={item} alt={`${game.title} screenshot ${idx + 1}`} className="game-media-img" />
                  )}
                </div>
              );
            })}
          </div>

          {canScrollLeft && (
            <button className="slider-arrow left" onClick={(e) => { e.stopPropagation(); navigate('left'); }}>
              <NextImage src={arrow} alt="Previous" />
            </button>
          )}
          {canScrollRight && (
            <button className="slider-arrow right" onClick={(e) => { e.stopPropagation(); navigate('right'); }}>
              <NextImage src={arrow} alt="Next" />
            </button>
          )}
        </div>
      )}

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
  );
};

const Games: React.FC = () => {
  const gameProjects: GameProject[] = [
    {
      id: 'onmyoji',
      title: 'Onmyoji',
      role: 'Senior Software Engineer — NetEase Games',
      description:
        'Large-scale mobile RPG (250M+ downloads). Early-stage engineer from concept to launch and live operation. Led development of front-end systems, battle logic, optimized CPU/GPU/memory performance, and implemented a cross-platform LBS Map SDK (iOS/Android/Web).',
      officialUrl: 'https://yys.163.com',
      videoUrls: ['/assets/projects/onmyoji/video.mp4'],
      imageUrls: [
        '/assets/projects/onmyoji/home.jpg',
        '/assets/projects/onmyoji/prepare.jpg',
        '/assets/projects/onmyoji/battle.jpg',
        '/assets/projects/onmyoji/battle2.jpg',
        '/assets/projects/onmyoji/hero.jpg',
        '/assets/projects/onmyoji/level.jpg',
        '/assets/projects/onmyoji/scene.jpg',
        '/assets/projects/onmyoji/lbs2.jpg',
        '/assets/projects/onmyoji/lbs_style.jpg',
      ],
      tags: ['C++', 'Python', 'NeoX Engine', 'LBS'],
      aspect: 'landscape'
    },
    {
      id: 'yokai-koya',
      title: 'Onmyoji: Yokai Koya',
      role: 'Senior Software Engineer — NetEase Games',
      description:
        'Top-5 China App Store title (2020). Responsible for full development of the core battle system — a physics-based pinball mechanic — using frame-synchronization to reduce server load and smooth gameplay. As Technical Lead, managed a team of 10 engineers, designed system architecture, mentored junior engineers, and handled full lifecycle development with Git and SVN.',
      officialUrl: 'https://yysygw.163.com',
      videoUrls: [
        '/assets/projects/yokaikoya/battle.mp4',
        '/assets/projects/yokaikoya/papercut.mp4'
      ],
      imageUrls: [
        '/assets/projects/yokaikoya/screenshot1.jpeg',
        '/assets/projects/yokaikoya/screenshot2.jpeg',
        '/assets/projects/yokaikoya/screenshot3.jpeg'
      ],
      tags: ['Real-time Sync Battle System', 'Python', 'C++', 'NeoX Engine', 'Physics'],
      aspect: 'portrait'
    },
    {
      id: 'magic-road',
      title: 'Magic Road',
      role: 'Contract — Unity / C#',
      description:
        '3D casual runner featuring procedural track generation, object pooling, and mobile performance optimizations. Implemented gameplay logic, asset streaming, and polish for smooth frame rates on constrained devices.',
      githubUrl: 'https://github.com/junyishen/DrawRoadGame',
      videoUrls: [
        '/assets/projects/magic_road/video1.MP4',
        '/assets/projects/magic_road/video2.mp4'
      ],
      imageUrls: [
      ],
      tags: ['Unity', 'C#', '3D'],
      aspect: 'portrait'
    },
    {
      id: 'bumper-car',
      title: 'Bumper Car',
      role: 'Contract — Unity / C#',
      description:
        'Arena-based bumper car experience with custom vehicle physics and responsive collision handling. Focused on deterministic interactions and performant simulation.',
      githubUrl: 'https://github.com/junyishen/BumperCar',
      videoUrls: [
        '/assets/projects/bumper_car/video.mp4'
      ],
      imageUrls: [
      ],
      tags: ['Unity', 'C#', 'Physics'],
      aspect: 'portrait'
    },
    {
      id: 'fight-2048',
      title: "Oulabu's Dream",
      role: 'Contract — Unity / C#',
      description:
        'A merge-RPG where players combine units to evolve their power. Features include character upgrades, multiple levels, and strategic mid-battle skill boosts.',
      officialUrl: 'https://www.taptap.cn/app/219376?os=android',
      videoUrls: [
        '/assets/projects/fight_2048/video.mp4'
      ],
      tags: ['Unity', 'C#', 'Game Design']
    },
    {
      id: 'teeth-guardian',
      title: 'Teeth Guardian',
      role: 'Contract — TypeScript / CocosCreator',
      description:
        'Oral health educational game. Implemented the full front-end battle mechanics, UI systems, and REST API integration to communicate with back-end services.',
      imageUrls: [
        '/assets/projects/teeth_guardian/main.jpg',
        '/assets/projects/teeth_guardian/level.jpg',
        '/assets/projects/teeth_guardian/battle.jpg',
        '/assets/projects/teeth_guardian/win.jpg',
        '/assets/projects/teeth_guardian/shop.jpg',
        '/assets/projects/teeth_guardian/calender.jpg',
        '/assets/projects/teeth_guardian/daily.jpg',
        '/assets/projects/teeth_guardian/science.jpg',
        '/assets/projects/teeth_guardian/question.jpg',
        '/assets/projects/teeth_guardian/chapter.jpg',
      ],
      tags: []
    },
    {
      id: 'card-battle',
      title: 'Card Battle',
      role: 'Contract — Unity / C#',
      description: 'A card game prototype with deck-building and battle systems.',
      // githubUrl: 'https://github.com/junyishen/CardBattle',
      imageUrls: [
        '/assets/projects/card_game/image2.jpg',
        '/assets/projects/card_game/image3.jpg',
        '/assets/projects/card_game/image1.jpg',
      ],
      tags: []
    },
  ];

  return (
    <div className="project-page-container">
      <Link href="/?from=projects" className="back-link">← Back to Home</Link>
      <div className="project-header" style={{ marginBottom: '3rem' }}>
        <h1 className="project-title">Game Development Portfolio</h1>
      </div>

      <div className="games-grid">
        {gameProjects.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default Games;

