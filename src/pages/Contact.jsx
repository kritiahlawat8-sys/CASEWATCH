import React, { useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contact.css';

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    "Nihal Kumar",
    "Kriti Ahlawat",
    "Sourav Yadav",
    "Nancy Sihag"
  ];

  return (
    <ReactLenis root>
      <Navbar />
      <main className="contact-page" id="contact-main">
        <div className="contact-container">
          <span className="contact-eyebrow">Get in Touch</span>
          <h1 className="contact-heading">Contact Us</h1>
          
          <div className="contact-card">
            <h2 className="contact-subheading">Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  {member}
                </div>
              ))}
            </div>
            
            <hr className="contact-divider" />
            
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <div className="contact-value">
                <a href="mailto:casewatch.contact@gmail.com">casewatch.contact@gmail.com</a>
              </div>
            </div>
            
            <div className="contact-row">
              <span className="contact-label">GitHub</span>
              <div className="contact-value">
                <a 
                  href="https://github.com/kritiahlawat8-sys/CASEWATCH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  kritiahlawat8-sys/CASEWATCH
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ReactLenis>
  );
}
