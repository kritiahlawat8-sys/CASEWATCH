import React, { useEffect, useRef, useState } from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  const steps = [
    {
      id: 1,
      number: "1",
      icon: "account_balance",
      title: "Select Court",
      description: "Choose the court type and jurisdiction from all courts in India, including Supreme Court, High Courts, District Courts, and Tribunals.",
      image: "/step_select_court.png"
    },
    {
      id: 2,
      number: "2",
      icon: "keyboard",
      title: "Enter CRN",
      description: "Enter your Case Reference Number (CRN-YYYY-NNNNNN). Optionally provide a party name for cross-verification.",
      image: "/step_enter_crn.png"
    },
    {
      id: 3,
      number: "3",
      icon: "verified_user",
      title: "Verify",
      description: "Complete a secure reCAPTCHA verification to confirm the request is from a human user.",
      image: "/step_case_details.png"
    },
    {
      id: 4,
      number: "4",
      icon: "assignment",
      title: "Case Details",
      description: "Review the submitted case information before continuing to the case timeline and tracking interface."
    }
  ];

  // Dynamic SVG path sizing
  const updatePath = () => {
    if (lineRef.current && containerRef.current) {
      const height = containerRef.current.offsetHeight;
      lineRef.current.setAttribute('d', `M 2 0 L 2 ${height}`);
    }
  };

  useEffect(() => {
    // Initial path generation
    const timer = setTimeout(() => {
      updatePath();
    }, 150);

    window.addEventListener('resize', updatePath);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePath);
    };
  }, []);

  return (
    <section className="how-it-works-section" id="how-it-works">
      {/* Intro Header */}
      <div className="how-header">
        <span className="how-eyebrow">HOW IT WORKS</span>
        <h2 className="how-title">
          Your Legal Journey,<br />Simplified.
        </h2>
        <p className="how-subtitle">
          See exactly how CaseWatch turns scattered court information into
one clear, real-time view of your case — from start to finish.
        </p>
      </div>

      {/* Timeline Steps Container */}
      <div className="timeline-steps-container" ref={containerRef}>
        {/* SVG Drawing Line */}
        <div className="timeline-svg-wrapper">
          <svg className="timeline-svg" preserveAspectRatio="none">
            <path className="timeline-path-active" ref={lineRef} d="M 2 0 L 2 1200" fill="none" strokeWidth="2"></path>
          </svg>
        </div>

        {/* Steps */}
        <div className="steps-list">
          {steps.map((step, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div 
                key={step.id} 
                className={`step-container ${isEven ? 'step-even' : 'step-odd'} active`} 
                id={`step-${step.id}`}
              >
                {/* Text Card Column */}
                <div className="step-card-col">
                  <div className="glass-card">
                    <div className="step-card-icon-wrapper">
                      <span className="material-symbols-outlined icon-main">{step.icon}</span>
                    </div>
                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.description}</p>
                  </div>
                </div>

                {/* Node Center Circle Column */}
                <div className="step-node-col">
                  <div className="step-circle">
                    <span className="step-number">{step.number}</span>
                  </div>
                </div>

                {/* Image Column */}
                {step.image ? (
                  <div className="step-image-col">
                    <div className="step-image-card">
                      <img src={step.image} alt={step.title} className="step-screenshot" />
                    </div>
                  </div>
                ) : (
                  <div className="step-image-col empty-image-col"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Security Badge */}
      <div className="how-bottom-badge">
        <div className="badge-content">
          <span className="material-symbols-outlined badge-icon">security</span>
          <span className="badge-text">Secure & Privacy-First</span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
