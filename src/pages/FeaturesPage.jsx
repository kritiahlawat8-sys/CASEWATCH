import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FeaturesPage.css';

export default function FeaturesPage() {
  const cardsRef = useRef([]);

  const featuresData = [
    {
      id: 1,
      title: "Case Tracking via CRN",
      description: "",
      bullets: [
        "Users can select a court jurisdiction from a search interface.",
        "Users can enter their Case Reference Number (CRN) and optionally a party name for cross-verification.",
        "Built-in secure reCAPTCHA verification.",
        "Real-time case lookups communicating with your backend (/api/cases/lookup) to display the case timeline."
      ],
      icon: "manage_search"
    },
    {
      id: 2,
      title: "Visual Step-by-Step Guidance",
      description: "An interactive, visual timeline interface that breaks down the process of tracking a case into four simple steps (Select Court, Enter CRN, Verify, Case Details) to help non-technical users navigate the platform.",
      icon: "steppers"
    },
    {
      id: 3,
      title: "Simplified Legal Hub",
      description: "A centralized information hub that breaks down complex legal topics, fundamental rights, and procedures into simple terms based on dynamic slugs.",
      icon: "menu_book"
    },
    {
      id: 4,
      title: "Grievance Redressal",
      description: "A dedicated page containing information and layouts for citizens to understand the grievance redressal process and file complaints.",
      icon: "report"
    },
    {
      id: 5,
      title: "Integrated Government Portals",
      description: "A dedicated navigation dropdown that links citizens directly to official, verified government portals:",
      bullets: [
        "e-Courts",
        "NALSA",
        "Supreme Court of India",
        "Lok Adalat (LSAMS)",
        "Consumer Disputes (NCDRC)"
      ],
      icon: "account_balance"
    },
    {
      id: 6,
      title: "Bilingual FAQ Support",
      description: "The capability to view frequently asked questions about the platform in both English and Hindi.",
      icon: "g_translate"
    }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    const cards = cardsRef.current.filter(Boolean);
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10) || 0;
          entry.target.style.transitionDelay = `${idx * 90}ms`;
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, observerOptions);

    cards.forEach(card => cardObserver.observe(card));

    return () => {
      cards.forEach(card => cardObserver.unobserve(card));
    };
  }, []);

  return (
    <div className="features-page-wrapper">
      <Navbar />
      
      <main className="features-page-content">
        <div className="features-header">
          <span className="features-badge">Platform Capabilities</span>
          <h1 className="features-title">Empowering Your Legal Journey</h1>
          <p className="features-subtitle">
            Discover the tools and resources we've built to make navigating the legal system transparent, accessible, and simple for everyone.
          </p>
        </div>

        <div className="fp-features-grid">
          {featuresData.map((feature, index) => (
            <div 
              className="fp-feature-card" 
              key={feature.id}
              ref={el => cardsRef.current[index] = el}
              data-index={index}
            >
              <div className="fp-feature-icon-wrapper">
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className="fp-feature-title">{feature.title}</h3>
              {feature.description && (
                <p className="fp-feature-desc">{feature.description}</p>
              )}
              {feature.bullets && (
                <ul className="fp-feature-desc" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                  {feature.bullets.map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
