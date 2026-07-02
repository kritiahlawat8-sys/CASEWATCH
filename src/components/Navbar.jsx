import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          <img src="/logo.png" alt="CaseWatch Logo" className="logo-img" />
          <span className="navbar-wordmark">CASEWATCH</span>
        </a>
      </div>

      <div className={`navbar-center ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-links">
          <li><a href="#features" className="nav-item">Features <span className="chevron"></span></a></li>
          <li><a href="#how-it-works" className="nav-item">How It Works <span className="chevron"></span></a></li>
          <li><a href="#documents" className="nav-item">Documents <span className="chevron"></span></a></li>
          <li><a href="#government-links" className="nav-item">Government Links <span className="chevron"></span></a></li>
          <li><a href="#about" className="nav-item">About <span className="chevron"></span></a></li>
          <li className="mobile-only-btn">
            <Link to="/track-case.html" className="btn-get-started mobile-btn">Get Started</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/track-case.html" className="btn-get-started">Get Started</Link>
        <button 
          className="hamburger" 
          aria-label="Toggle navigation menu" 
          aria-expanded={isMenuOpen} 
          onClick={toggleMenu}
        >
          <span className="hamburger-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
