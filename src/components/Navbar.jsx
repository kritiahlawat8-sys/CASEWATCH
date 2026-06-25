import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-left">
        <button 
          className="hamburger" 
          aria-label="Toggle navigation menu" 
          aria-expanded={isMenuOpen} 
          onClick={toggleMenu}
        >
          <span className="hamburger-icon"></span>
        </button>

        <a href="/" className="navbar-logo-link" aria-label="CaseWatch Home">
          <div className="navbar-logo-mark">C</div>
          <span className="navbar-wordmark">CaseWatch</span>
        </a>

        <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#documents">Documents</a></li>
          <li><a href="#government-links">Government Links</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <button className="btn-get-started">Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;
