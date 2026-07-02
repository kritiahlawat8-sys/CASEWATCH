import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './TrackCasePage.css';

const TrackCasePage = ({ onProceed }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [crnNumber, setCrnNumber] = useState('');
  const [partyName, setPartyName] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [validationState, setValidationState] = useState('idle'); // 'idle' | 'valid' | 'error'
  const [isCooldown, setIsCooldown] = useState(false);

  const canvasRef = useRef(null);

  // Generate a random 6-character captcha string
  const generateNewCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
    setCaptchaInput('');
    setValidationState('idle');
  };

  // Generate captcha on mount
  useEffect(() => {
    generateNewCaptcha();
  }, []);

  // Canvas drawing lifecycle
  useEffect(() => {
    if (!captchaValue || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 500;
    const height = 78;

    // Fill backdrop utilizing the traditional parchment hex token: #ede8df
    ctx.fillStyle = '#ede8df';
    ctx.fillRect(0, 0, width, height);

    // Inject procedural noise pattern overlay (render 200 random tiny coordinate points in a loop)
    ctx.fillStyle = 'rgba(100, 90, 60, 0.07)';
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.beginPath();
      ctx.arc(rx, ry, 1 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw 6 intersecting vector tracking distractor lines across the canvas area using randomized deep earth tones
    const earthTones = [
      'rgba(74, 53, 37, 0.35)',
      'rgba(53, 53, 31, 0.35)',
      'rgba(82, 61, 41, 0.35)',
      'rgba(61, 41, 31, 0.35)',
      'rgba(92, 77, 56, 0.35)',
      'rgba(46, 56, 36, 0.35)'
    ];
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = earthTones[Math.floor(Math.random() * earthTones.length)];
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Draw 6 characters with independent jitter, rotation, scale, weight and shadows
    const chars = captchaValue.split('');
    const charSpacing = width / (chars.length + 1);

    ctx.shadowBlur = 2;

    chars.forEach((char, idx) => {
      // Dark ink HSL selection (lightness within 10% to 30%)
      const hue = Math.floor(Math.random() * 360);
      const saturation = 25 + Math.floor(Math.random() * 25); // 25% to 50%
      const lightness = 10 + Math.floor(Math.random() * 21); // 10% to 30%
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.shadowColor = `rgba(0, 0, 0, 0.35)`;

      const fontSize = 28 + Math.floor(Math.random() * 9); // 28px to 36px
      ctx.font = `900 ${fontSize}px var(--tc-font-mono), 'Courier New', monospace`;

      // Coordinates with independent jitter
      const x = charSpacing * (idx + 1) + (Math.random() - 0.5) * 14;
      const y = 44 + (Math.random() - 0.5) * 10;

      // Rotate offset (Math.random() - 0.5) * 0.55
      const angle = (Math.random() - 0.5) * 0.55;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  }, [captchaValue]);

  // Real-time Match Evaluation
  useEffect(() => {
    if (captchaInput.length === 6) {
      if (captchaInput === captchaValue) {
        setValidationState('valid');
      } else {
        setValidationState('error');
        setIsCooldown(true);
        const cooldownTimer = setTimeout(() => {
          setIsCooldown(false);
          generateNewCaptcha();
        }, 900);
        return () => clearTimeout(cooldownTimer);
      }
    }
  }, [captchaInput, captchaValue]);

  // Handle CRN input changes
  const handleCrnChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 20) {
      setCrnNumber(val);
    }
  };

  // Handle Captcha input changes
  const handleCaptchaChange = (e) => {
    if (isCooldown) return;
    const val = e.target.value.toUpperCase();
    if (val.length <= 6) {
      setCaptchaInput(val);
      if (val.length < 6) {
        setValidationState('idle');
      }
    }
  };

  // Handle party name input changes
  const handlePartyNameChange = (e) => {
    setPartyName(e.target.value);
  };

  // Handle Form Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validationState === 'valid' && crnNumber.trim()) {
      setIsVerified(true);
    }
  };

  // Execute proceeding callback
  const handleProceedClick = () => {
    if (onProceed) {
      onProceed(crnNumber);
    }
  };

  return (
    <div className="track-page-wrapper">
      {/* 1. Fixed Navigation Bar */}
      <nav className="track-navbar" aria-label="Main Page Navigation">
        <a href="#" className="track-nav-brand">
          <img src="/logo.png" alt="CaseWatch Logo" className="track-nav-logo" />
          <span>CASEWATCH</span>
        </a>
        <ul className="track-nav-links">
          <li><a href="#dashboard" className="track-nav-link">Dashboard</a></li>
          <li><a href="#tracking" className="track-nav-link active">Case Tracking</a></li>
          <li><a href="#about" className="track-nav-link">About Registry</a></li>
        </ul>
        <button className="track-nav-cta" onClick={() => window.location.reload()}>
          Reset Portal
        </button>
      </nav>

      {/* Main Page Area */}
      <main className="track-page-content">
        {/* 2. Breadcrumb Tracker */}
        <nav className="breadcrumb-tracker" aria-label="Breadcrumb navigation">
          <a href="#" className="breadcrumb-item">Home</a>
          <span className="breadcrumb-separator">›</span>
          <a href="#tracking" className="breadcrumb-item">Track My Case</a>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Enter CRN</span>
        </nav>

        {/* 3. Page Heading Block */}
        <header className="page-heading-block">
          <span className="tracking-badge">
            ⊙ Case Tracking
          </span>
          <h1 className="page-title-h1">Track Your Case</h1>
          <p className="page-lead-text">
            Verify your Case Reference Number (CRN) to access real-time judicial schedules, timeline updates, and automate affidavit generations.
          </p>
        </header>

        {/* 4. Progress Flow Steps */}
        <div className="progress-flow-container" aria-label="Tracking step progression">
          <div className="progress-step-item completed">
            <div className="progress-step-node">✓</div>
            <div className="progress-step-label">1. Select Court</div>
          </div>
          <div className="progress-step-item active">
            <div className="progress-step-node">2</div>
            <div className="progress-step-label">2. Enter CRN</div>
          </div>
          <div className="progress-step-item">
            <div className="progress-step-node">3</div>
            <div className="progress-step-label">3. Verify</div>
          </div>
          <div className="progress-step-item">
            <div className="progress-step-node">4</div>
            <div className="progress-step-label">4. Case Details</div>
          </div>
        </div>

        {/* 5. Core Interactive Container Card */}
        <section className="interactive-card">
          {!isVerified ? (
            /* STATE A: THE FORM LAYOUT PANEL */
            <div id="formState" className="form-panel">
              <form onSubmit={handleFormSubmit}>
                <div className="form-split-grid">
                  {/* Left Input Column */}
                  <div className="left-input-col">
                    <div className="field-group">
                      <label htmlFor="pg-crn-number" className="field-label">
                        CRN / Case Number
                      </label>
                      <div className="input-with-icon-wrapper">
                        {/* Receipt Icon */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-receipt-icon" aria-hidden="true">
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                          <path d="M16 8H8M16 12H8M13 16H8" />
                        </svg>
                        <input
                          id="pg-crn-number"
                          type="text"
                          className="pg-input with-icon mono"
                          placeholder="CRN-2024-00187"
                          value={crnNumber}
                          onChange={handleCrnChange}
                          maxLength={20}
                          disabled={isCooldown}
                          required
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label htmlFor="pg-party-name" className="field-label">
                        Party Name (Optional)
                      </label>
                      <input
                        id="pg-party-name"
                        type="text"
                        className="pg-input"
                        placeholder="Petitioner or Respondent matching"
                        value={partyName}
                        onChange={handlePartyNameChange}
                        disabled={isCooldown}
                      />
                    </div>
                  </div>

                  {/* Middle Column Divider */}
                  <div className="middle-divider-col" aria-hidden="true" />

                  {/* Right Captcha Column */}
                  <div className="right-captcha-col">
                    <div className="field-group">
                      <div className="captcha-header-row">
                        <label htmlFor="pg-captcha-input" className="field-label">
                          Security Verification
                        </label>
                        <button
                          type="button"
                          className="pg-refresh-btn"
                          onClick={generateNewCaptcha}
                          disabled={isCooldown}
                          title="Generate new image"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                          </svg>
                          New Image
                        </button>
                      </div>

                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={78}
                        className="canvas-captcha-box"
                        aria-label="CAPTCHA verification drawing"
                      />

                      <div className="captcha-solution-input-wrapper">
                        <input
                          id="pg-captcha-input"
                          type="text"
                          className={`pg-input mono ${validationState === 'valid' ? 'is-valid' : ''} ${validationState === 'error' ? 'has-error' : ''}`}
                          placeholder="ENTER CODE"
                          value={captchaInput}
                          onChange={handleCaptchaChange}
                          maxLength={6}
                          disabled={isCooldown}
                          autoComplete="off"
                          data-captcha={captchaValue}
                          required
                        />
                        <span className={`pg-verified-pill ${validationState === 'valid' ? 'show' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </span>
                      </div>

                      {validationState === 'error' && (
                        <div className="pg-field-error">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Verification failed. Generating new code in 900ms...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="card-footer-bar">
                  <div className="privacy-encrypted-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>
                      Queries are fully audited and encrypted. Your metadata is not cached. CaseWatch maintains zero logs of reference entries to guarantee user privacy.
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="pg-submit-btn"
                    disabled={validationState !== 'valid' || !crnNumber.trim()}
                  >
                    Track My Case
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STATE B: THE DESTINATION SCREEN PANEL */
            <div id="successState" className="success-panel">
              <div className="success-checkbox-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h2 className="success-h2">CRN Verified Successfully</h2>
              <p className="success-guidance">
                Judicial filing records match the reference CNR key. Real-time docket timelines, past hearings, and upcoming court schedules are ready to download.
              </p>

              <div className="confirmed-preview-badge">
                {crnNumber}
              </div>

              <div>
                <button type="button" className="view-details-btn" onClick={handleProceedClick}>
                  View Case Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 6. Footer Informational Strip */}
        <footer className="info-strip-grid" aria-label="Help and privacy resources">
          <div className="info-card-block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-card-icon" aria-hidden="true">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h3 className="info-card-title">Where is my CRN?</h3>
            <p className="info-card-desc">
              Your Case Receipt Number is printed on your court filing receipt issued at the registry window. It typically consists of 'CRN-' followed by the filing year and a 5-digit index sequence.
            </p>
          </div>

          <div className="info-card-block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-card-icon" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h3 className="info-card-title">Need help?</h3>
            <p className="info-card-desc">
              If your CNR record fails validation, double check the spelling of your CRN or use the government portal links to cross-verify. You can also contact support at registry@casewatch.gov.in.
            </p>
          </div>

          <div className="info-card-block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-card-icon" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 11 11 13 15 9" />
            </svg>
            <h3 className="info-card-title">Privacy assured</h3>
            <p className="info-card-desc">
              CaseWatch queries connect directly to public API endpoints using end-to-end TLS tunnels. We never persist reference history, document logs, or personal metadata details.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

TrackCasePage.propTypes = {
  onProceed: PropTypes.func
};

TrackCasePage.defaultProps = {
  onProceed: () => {}
};

export default TrackCasePage;
