import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">SJY.</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

