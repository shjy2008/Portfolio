 "use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;

    event.preventDefault();
    window.history.replaceState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo" onClick={handleHomeClick}>SJY.</Link>
        <div className="navbar-links">
          <Link href="/" className="navbar-link" onClick={handleHomeClick}>Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

