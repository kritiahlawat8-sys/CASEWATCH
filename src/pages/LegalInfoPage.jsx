import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { legalInfoContent } from '../config/legalInfoContent';
import './LegalPage.css'; // Reusing standard legal layout
import './LegalInfoPage.css';

export default function LegalInfoPage() {
  const { slug } = useParams();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const content = legalInfoContent.find(c => c.slug === slug);

  if (!content) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="legal-page-container">
      <Navbar />
      
      <main className="legal-content-wrapper">
        <div className="legal-main-content">
          <header className="legal-header">
            <h1 className="legal-title">{content.title}</h1>
          </header>

          {content.tonePriority && content.reassuringText && (
            <div className="legal-info-reassurance">
              <p>{content.reassuringText}</p>
            </div>
          )}

          <section className="legal-section">
            <h2>What this covers</h2>
            <div className="legal-section-content">
              <p>{content.whatItCovers}</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Common situations</h2>
            <div className="legal-section-content">
              <ul>
                {content.commonSituations.map((situation, idx) => (
                  <li key={idx}>{situation}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>Where this typically goes</h2>
            <div className="legal-section-content">
              <p>{content.whereThisGoes}</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Related Gov Portal</h2>
            <div className="gov-portal-card">
              <a 
                href={content.govPortalCrossLink.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="gov-portal-card-link"
              >
                <div className="gov-portal-card-content">
                  <h3>{content.govPortalCrossLink.label}</h3>
                  <p>{content.govPortalCrossLink.subtitle}</p>
                </div>
                <div className="gov-portal-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </a>
            </div>
          </section>

          <section className="legal-section translator-crosslink">
            <h2>Still confused about jargon?</h2>
            <div className="legal-section-content">
              <p>Legal documents can be hard to understand. Try our <a href="#translator">AI Legal Translator</a> to simplify complex legal terms into plain English.</p>
            </div>
          </section>

          <div className="legal-disclaimer-note">
            This page is for general understanding only and is not legal advice. Laws and procedures vary by state and case. Always consult a qualified advocate for guidance specific to your situation.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
