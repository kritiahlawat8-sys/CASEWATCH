import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGovDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <li className="nav-dropdown-container" ref={dropdownRef}>
            <button 
              className="nav-item nav-dropdown-btn" 
              onClick={(e) => { e.preventDefault(); setIsGovDropdownOpen(!isGovDropdownOpen); }}
              aria-expanded={isGovDropdownOpen}
            >
              Government Links <span className={`chevron ${isGovDropdownOpen ? 'open' : ''}`}></span>
            </button>
            <ul className={`nav-dropdown-menu ${isGovDropdownOpen ? 'open' : ''}`}>
              <li><a href="https://ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">e-Courts</a></li>
              <li><a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">NALSA</a></li>
              <li><a href="https://main.sci.gov.in" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">Supreme Court</a></li>
              <li><a href="https://nalsa.gov.in/lsams" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">Lok Adalat</a></li>
              <li><a href="https://ncdrc.nic.in" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">Consumer Disputes (NCDRC)</a></li>
            </ul>
          </li>
          <li><Link to="/about" className="nav-item">About <span className="chevron"></span></Link></li>
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
