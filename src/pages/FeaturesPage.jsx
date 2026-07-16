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
      description: "Track any court case in seconds — just select your court, enter your Case Reference Number, and optionally add the party name for extra confirmation. Get instant, up-to-date case status without visiting the court or standing in queues, along with the complete hearing timeline showing past and upcoming dates.",
      icon: "manage_search"
    },
    {
      id: 2,
      title: "AI-Powered Case Summaries",
      description: "Automatically converts complex case data — hearing history, case stage, and party details into a clear, easy-to-read summary. Explains what the case is about, where it currently stands, and what the next hearing means, along with practical next steps. Grounded strictly in real case data, with nothing invented or assumed.",
      icon: "summarize"
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
      description: "Skip the hassle of searching for the right government website. We give you direct, verified links to e-Courts, NALSA, the Supreme Court of India, Lok Adalat, and Consumer Disputes — all official and trustworthy, so you never land on a fake or outdated site.",
      icon: "account_balance"
    },
    {
      id: 6,
      title: "Bilingual FAQ Support",
      description: "Have a question about your case, your privacy, or how to spot a fake court notice? Our FAQ section covers everything from understanding court tracking and case status, to keeping your data safe and identifying fraud — all explained in simple words, in both English and Hindi.",
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
