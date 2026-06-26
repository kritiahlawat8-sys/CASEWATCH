import React, { useEffect, useRef } from 'react';
import './WhyCaseWatch.css';

const WhyCaseWatch = () => {
  const sectionRef = useRef(null);
  const paragraphRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  // Split content segments for cleaner React-native word wrapping
  const segments = [
    { text: "With over 50 million pending cases across India, navigating the legal system can feel overwhelming. ", bold: false },
    { text: "CaseWatch changes this. ", bold: true },
    { text: "It is an open-source, AI-powered platform that tracks court cases, decodes complex legal documents, and automates affidavit generation using just a CNR number. No complicated logins, no expensive legal fees—just transparent, automated legal intelligence.", bold: false }
  ];

  // Build the list of tokens to render
  const tokens = [];
  let wordCounter = 0;
  
  segments.forEach((segment) => {
    const parts = segment.text.split(/(\s+)/);
    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        tokens.push({ type: 'space', text: part });
      } else if (part !== '') {
        tokens.push({
          type: 'word',
          text: part,
          bold: segment.bold,
          wordIndex: wordCounter++
        });
      }
    });
  });

  const totalWordsCount = wordCounter;

  useEffect(() => {
    const whySection = sectionRef.current;
    const revealEl   = paragraphRef.current;

    if (!whySection || !revealEl) return;

    // Retrieve references to DOM elements rendered by React
    const words = Array.from(revealEl.querySelectorAll('.reveal-word'));
    const totalWords = words.length;

    if (totalWords === 0) return;

    const clamp = (val, lo, hi) => Math.max(lo, Math.min(hi, val));

    // Layout Cache Variables
    let textElementTopOnPage = 0;
    let windowHeight = 0;

    let lastLitCount = -1;

    const cacheLayout = () => {
      const rect = revealEl.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      textElementTopOnPage = rect.top + scrollTop;
      windowHeight = window.innerHeight;
    };

    // Run initial cache measurement
    cacheLayout();
    window.addEventListener('resize', cacheLayout, { passive: true });
    window.addEventListener('load', cacheLayout, { passive: true });

    // Scroll progress animation update
    const updateProgress = () => {
      const scrollTop = window.scrollY || window.pageYOffset;

      // Reveal starts when top of paragraph enters the bottom of the viewport,
      // and completes when the top of the paragraph reaches the middle (50vh)
      const startScroll = textElementTopOnPage - windowHeight;
      const endScroll   = textElementTopOnPage - windowHeight * 0.5;
      const scrollRange = endScroll - startScroll;

      if (scrollRange <= 0) return;

      const progress = clamp((scrollTop - startScroll) / scrollRange, 0, 1);

      // Word-by-word reveal highlight
      const litCount = Math.round(progress * totalWords);

      if (litCount !== lastLitCount) {
        for (let i = 0; i < totalWords; i++) {
          if (i < litCount) {
            if (!words[i].classList.contains('is-lit')) {
              words[i].classList.add('is-lit');
            }
          } else {
            if (words[i].classList.contains('is-lit')) {
              words[i].classList.remove('is-lit');
            }
          }
        }
        lastLitCount = litCount;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    // IntersectionObserver entrance animations for Cards
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    const headerEl = headerRef.current;
    let headerObserver;
    if (headerEl) {
      headerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, { ...observerOptions, threshold: 0.2 });
      headerObserver.observe(headerEl);
    }

    const cards = cardsRef.current.filter(Boolean);
    const cardObserver = new IntersectionObserver((entries, obs) => {
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
      window.removeEventListener('resize', cacheLayout);
      window.removeEventListener('load', cacheLayout);
      window.removeEventListener('scroll', onScroll);
      if (headerObserver && headerEl) headerObserver.unobserve(headerEl);
      cards.forEach(card => cardObserver.unobserve(card));
    };
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────
           SECTION A · Why CaseWatch (scroll-driven reveal)
      ───────────────────────────────────────────── */}
      <section ref={sectionRef} id="why-casewatch" className="why-section" aria-label="Why CaseWatch">
        <div className="why-inner">
          <p className="why-eyebrow" aria-hidden="true">Why CaseWatch?</p>
          <p
            ref={paragraphRef}
            className="why-body"
            id="why-reveal-text"
            aria-label="With over 50 million pending cases across India, navigating the legal system can feel overwhelming. CaseWatch changes this. It is an open-source, AI-powered platform that tracks court cases, decodes complex legal documents, and automates affidavit generation using just a CNR number. No complicated logins, no expensive legal fees—just transparent, automated legal intelligence."
          >
            {tokens.map((token, i) => {
              if (token.type === 'space') {
                return token.text;
              }
              return (
                <span
                  key={i}
                  className="reveal-word"
                  data-word-index={token.wordIndex}
                >
                  <span
                    className="reveal-word-inner"
                    style={{ fontWeight: token.bold ? '800' : 'normal' }}
                  >
                    {token.text}
                  </span>
                </span>
              );
            })}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
           SECTION B · Overview (Cards Grid)
      ───────────────────────────────────────────── */}
      <section id="overview" className="overview-section" aria-label="CaseWatch Overview">
        <div className="overview-inner">
          
          <header ref={headerRef} className="overview-header js-fade-in-up">
            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-12 w-full">
              <div className="w-full md:w-3/5 lg:w-2/3">
                <p className="overview-eyebrow">Overview</p>
                <h2 className="overview-heading">Why Choose<br/>CaseWatch?</h2>
                <p className="overview-lede">
                  Tracking Indian court cases across multiple platforms is slow, complex, and prone to missed updates. CaseWatch centralizes this process. By leveraging AI and official CNR data, it provides real-time hearing updates, decodes dense legal documents, and automates administrative tasks like affidavit generation—all without requiring a user login.
                </p>
              </div>
              <div className="flex w-full md:w-2/5 lg:w-1/3 justify-center items-center opacity-80 my-8 md:my-0" aria-hidden="true">
                <img src="/ashoka.png" alt="Ashoka Stambh" className="w-[240px] md:w-[280px] lg:w-[350px] h-auto object-contain mix-blend-multiply scale-[1.35] translate-x-[70px] md:translate-x-[140px] lg:translate-x-[250px]" />
              </div>
            </div>
          </header>

          <ul className="features-grid" role="list" aria-label="Core features">
            <li
              ref={el => cardsRef.current[0] = el}
              className="feature-card"
              data-index="0"
            >
              <div className="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Automated Case Tracking</h3>
              <p className="feature-desc">Enter a CNR number to receive instant, automated updates on case statuses, upcoming hearings, and historical court orders.</p>
            </li>

            <li
              ref={el => cardsRef.current[1] = el}
              className="feature-card"
              data-index="1"
            >
              <div className="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">AI Document Decoding</h3>
              <p className="feature-desc">Our AI engine analyzes and simplifies complex legal jargon, making dense court documents easy to understand for both citizens and professionals.</p>
            </li>

            <li
              ref={el => cardsRef.current[2] = el}
              className="feature-card"
              data-index="2"
            >
              <div className="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Affidavit Generation</h3>
              <p className="feature-desc">Automate the creation of standard legal affidavits with integrated templates, saving hours of manual drafting and formatting.</p>
            </li>

            <li
              ref={el => cardsRef.current[3] = el}
              className="feature-card"
              data-index="3"
            >
              <div className="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Frictionless Access</h3>
              <p className="feature-desc">An entirely open-source platform designed for public utility. Track cases and access legal intelligence without any mandatory logins or paywalls.</p>
            </li>
          </ul>

        </div>
      </section>
    </>
  );
};

export default WhyCaseWatch;
