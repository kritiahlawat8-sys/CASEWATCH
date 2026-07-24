import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const navRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const location = useLocation();

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

  useEffect(() => {
    // Update sliding indicator position
    const activeKey = isGovDropdownOpen ? '/government' : location.pathname;
    const activeElement = navRefs.current[activeKey];
    
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [location.pathname, isGovDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activePath = isGovDropdownOpen ? '/government' : location.pathname;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          <img src="/logo.png" alt="CaseWatch Logo" className="logo-img" />
          <span className="navbar-wordmark">CASEWATCH</span>
        </a>
      </div>

      <div className={`navbar-center ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-links" style={{ position: 'relative' }}>
          <div className="nav-indicator" style={indicatorStyle}></div>
          <li ref={(el) => (navRefs.current['/features'] = el)}>
            <Link to="/features" className={`nav-item ${activePath === '/features' ? 'active' : ''}`}>Features <span className="chevron"></span></Link>
          </li>
          <li ref={(el) => (navRefs.current['/how-it-works'] = el)}>
            <Link to="/how-it-works" className={`nav-item ${activePath === '/how-it-works' ? 'active' : ''}`}>How It Works <span className="chevron"></span></Link>
          </li>
          <li ref={(el) => (navRefs.current['/documents'] = el)}>
            <Link to="/documents" className={`nav-item ${activePath === '/documents' ? 'active' : ''}`}>Documents <span className="chevron"></span></Link>
          </li>
          <li className="nav-dropdown-container" ref={(el) => { dropdownRef.current = el; navRefs.current['/government'] = el; }}>
            <button 
              className={`nav-item nav-dropdown-btn ${activePath === '/government' ? 'active' : ''}`} 
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
          <li ref={(el) => (navRefs.current['/about'] = el)}>
            <Link to="/about" className={`nav-item ${activePath === '/about' ? 'active' : ''}`}>About <span className="chevron"></span></Link>
          </li>
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
