import React from 'react';
import Link from 'next/link';
// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo">SJY.</Link>
        <div className="navbar-links">
          <Link href="/" className="navbar-link">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

