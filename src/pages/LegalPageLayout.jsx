import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';
import { LAST_UPDATED_DATE } from '../config/constants';

export default function LegalPageLayout({ title, content, showDisclaimerNote = false }) {

  return (
    <div className="legal-page-container">
      <Navbar />
      
      <main className="legal-content-wrapper">
        


        {/* Main Content */}
        <article className="legal-main-content">
          <header className="legal-header">
            <h1 className="legal-title">{title}</h1>
            <div className="legal-last-updated">Last Updated: {LAST_UPDATED_DATE}</div>
          </header>



          {/* Render Sections */}
          {content.map((section) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>{section.title}</h2>
              <div 
                className="legal-section-content" 
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </section>
          ))}

          {/* TODO: Remove this once actual legal review is complete */}
          {showDisclaimerNote && (
            <div className="legal-disclaimer-note">
              <strong>Note:</strong> This is a template and has not yet been reviewed by legal counsel.
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
