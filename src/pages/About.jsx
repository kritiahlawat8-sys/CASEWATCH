import React, { useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis root>
      <Navbar />
      <div className="about-page">
        {/* 1. Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">About CaseWatch</h1>
            <p className="about-tagline">Simplifying Law For Every Indian</p>
          </div>
        </section>

        {/* 2. What is CaseWatch */}
        <section className="about-section about-what-is">
          <div className="about-container">
            <h2 className="section-title">What is CaseWatch?</h2>
            <p className="section-text">
              CaseWatch is a digital platform built to help common people in India navigate the complex Indian judicial system. It helps users track their court cases, stay informed about hearing dates, find document guidance, and connect directly to official government portals.
            </p>
          </div>
        </section>

        {/* 3. The Problem We Solve */}
        <section className="about-section about-problem bg-light">
          <div className="about-container">
            <h2 className="section-title">The Problem We Solve</h2>
            <p className="section-text">
              Millions of Indians miss court hearing dates, remain uninformed about required documents, and fall victim to legal fraud and fake agents due to the lack of a centralized, reliable platform. CaseWatch was built specifically to solve these problems.
            </p>
          </div>
        </section>

        {/* 4. What We Offer */}
        <section className="about-section about-offer">
          <div className="about-container">
            <h2 className="section-title">What We Offer</h2>
            <div className="about-features-grid">
              <div className="about-feature-card">
                <div className="about-feature-icon">🔍</div>
                <h3 className="about-feature-title">Court Case Tracking</h3>
                <p className="about-feature-desc">Easily monitor your case status and get timely updates.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">📄</div>
                <h3 className="about-feature-title">Document Guidance</h3>
                <p className="about-feature-desc">Know exactly which documents are required for your case.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">🏛️</div>
                <h3 className="about-feature-title">Direct Government Links</h3>
                <p className="about-feature-desc">Access official portals safely without any middlemen.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">🛡️</div>
                <h3 className="about-feature-title">Fraud Prevention</h3>
                <p className="about-feature-desc">Stay safe from fake agents and legal misinformation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Our Mission */}
        <section className="about-section about-mission bg-dark text-white">
          <div className="about-container">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text mission-statement">
              "Our mission is to make the Indian legal system accessible, understandable, and navigable for every citizen regardless of their background or education."
            </p>
          </div>
        </section>

        {/* 6. FAQ & 7. Contact */}
        <section className="about-section about-footer-actions">
          <div className="about-container">
            <div className="actions-grid">
              <div className="action-box">
                <h3 className="action-title">Have more questions?</h3>
                <Link to="/#faq" className="btn-primary">
                  Visit our FAQ
                </Link>
              </div>
              <div className="action-box">
                <h3 className="action-title">Need to reach out?</h3>
                <a href="mailto:support@casewatch.in" className="btn-secondary">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </ReactLenis>
  );
}
