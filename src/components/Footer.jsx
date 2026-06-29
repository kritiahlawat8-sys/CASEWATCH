import React from 'react';
import { Link } from 'react-router-dom';
import { govPortalsLinks } from '../config/govPortalsLinks';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="casewatch-footer">
      {/* Subtle top border accent with Indian tricolor colors */}
      <div className="footer-top-accent"></div>
      
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Column 1: Brand About (Logo, Description, Socials) */}
          <div className="footer-column brand-col">
            <a href="#" className="footer-logo-wrapper">
              <img src="/logo.png" alt="CaseWatch Logo" className="logo-img" />
              <span className="logo-text">CASEWATCH</span>
            </a>
            
            <p className="brand-desc">
              A secure legal tech platform helping citizens monitor case statuses, receive updates, and understand court proceedings.
            </p>
            
            {/* Social Icons */}
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Twitter" title="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: CASEWATCH */}
          <div className="footer-column">
            <h3 className="column-title">CASEWATCH</h3>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#case-types">Case Types</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          {/* Column 3: Legal INFO */}
          <div className="footer-column">
            <h3 className="column-title">Legal INFO</h3>
            <ul className="footer-links">
              <li><a href="#property">Property</a></li>
              <li><a href="#criminal">Criminal</a></li>
              <li><a href="#family">Family</a></li>
              <li><a href="#consumer">Consumer</a></li>
              <li><a href="#civil">Civil</a></li>
              <li><a href="#labour">Labour</a></li>
            </ul>
          </div>
          
          {/* Column 4: GOV PORTALS */}
          <div className="footer-column">
            <h3 className="column-title">GOV PORTALS</h3>
            <ul className="footer-links">
              {govPortalsLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 5: LEGAL */}
          <div className="footer-column">
            <h3 className="column-title">LEGAL</h3>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use">Terms of Use</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
              <li><Link to="/grievance">Grievance</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Copyright & Small Print */}
        <div className="footer-bottom">
          <div className="footer-bottom-flex">
            <p className="copyright">
              &copy; 2026 CaseWatch - Not a law firm - Free public platform - <Link to="/privacy-policy">Privacy Policy</Link> - <Link to="/terms-of-use">Terms</Link>
            </p>
            <div className="govt-affiliation">
              <span className="flag-icon">
                <span className="flag-stripe saffron"></span>
                <span className="flag-stripe white"><span className="wheel"></span></span>
                <span className="flag-stripe green"></span>
              </span>
              <span>An Initiative for Accessible Legal Services in India</span>
            </div>
          </div>
          
          <div className="footer-disclaimer">
            <p>CaseWatch is an independent platform and is not affiliated with, endorsed by, or operated by the Government of India, the Indian Judiciary, or any of the bodies linked above. Links are provided for the convenience of users.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
