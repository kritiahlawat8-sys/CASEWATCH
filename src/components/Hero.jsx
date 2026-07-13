import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [cnr, setCnr] = useState('');
  const navigate = useNavigate();

  const handleCnrSearch = (e) => {
    e.preventDefault();
    if (cnr.trim()) {
      localStorage.setItem('cnr_search', cnr.trim());
      navigate(`/track-case.html?cnr=${encodeURIComponent(cnr.trim())}`);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-grid-bg"></div>
      
      <div className="hero-content">
        {/* Floating Decorative Images */}
        <img src="/contract.png" alt="" className="floating-img floating-left" />
        <img src="/stamp.png" alt="" className="floating-img floating-right" />
        
        <div className="hero-text-box">
          <div className="anchor tl"></div>
          <div className="anchor tr"></div>
          <div className="anchor bl"></div>
          <div className="anchor br"></div>
          <div className="handle">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M4 4L20 12L4 20V4Z" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="2" strokeLinejoin="round"/>
             </svg>
          </div>
          <h1 className="hero-title">CASEWATCH</h1>
          <h2 className="hero-subtitle">India's Legal Navigator</h2>
        </div>
        
        <div className="hero-buttons">
          <Link 
            to="/track-case.html"
            className="btn-dark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Track My Case
          </Link>
          
          <button className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore features
          </button>
        </div>

        <form onSubmit={handleCnrSearch} className="hero-cnr-search">
          <input
            type="text"
            className="cnr-search-input"
            placeholder="Enter CNR Number (e.g. ABCD010012342026)"
            value={cnr}
            onChange={(e) => setCnr(e.target.value)}
            required
          />
          <button type="submit" className="btn-dark cnr-search-submit">
            Track Case &rarr;
          </button>
        </form>
        
        <p className="hero-description">
          With over 50 million pending cases across India, navigate the legal system effortlessly. <br />
          CaseWatch is your unified platform to decode complex court documents, <br />
          and track yours.
        </p>
      </div>
    </section>
  );
};

export default Hero;
