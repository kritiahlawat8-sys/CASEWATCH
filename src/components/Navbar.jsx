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
          <div className="navbar-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="navbar-wordmark">CaseWatch</span>
        </a>
      </div>

      <div className={`navbar-center ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-links">
          <li><a href="#features" className="nav-item">Features <span className="chevron"></span></a></li>
          <li><a href="#how-it-works" className="nav-item">How It Works <span className="chevron"></span></a></li>
          <li><a href="#documents" className="nav-item">Documents <span className="chevron"></span></a></li>
          <li><a href="#government-links" className="nav-item">Government Links <span className="chevron"></span></a></li>
          <li><a href="#about" className="nav-item">About <span className="chevron"></span></a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <button className="btn-get-started">Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;
