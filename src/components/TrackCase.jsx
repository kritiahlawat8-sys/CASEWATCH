import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './TrackCase.css';

const TrackCase = ({ onVerified }) => {
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

  // Canvas drawing logic
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

    // Draw each character with spacing, rotational offset, independent sizes, weights, dark HSL ink nodes, and shadows
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
      // Reset validation state from error or valid if user edits the value
      if (val.length < 6) {
        setValidationState('idle');
      }
    }
  };

  // Handle party name input changes
  const handlePartyNameChange = (e) => {
    setPartyName(e.target.value);
  };

  // Handle submitting the verified form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validationState === 'valid' && crnNumber.trim()) {
      setIsVerified(true);
    }
  };

  // Handle proceed trigger on Success view
  const handleProceed = () => {
    if (onVerified) {
      onVerified(crnNumber);
    }
  };

  return (
    <section className="track-case-section">
      {!isVerified ? (
        <div id="formState" className="track-case-container">
          <div className="track-case-header">
            <span className="track-case-step-tag">Step 02 / Enter CRN</span>
            <h2 className="track-case-title">Verify Filing Reference</h2>
          </div>

          <div className="two-col">
            {/* Left Column: Form Elements */}
            <div className="col-left">
              <form onSubmit={handleFormSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="form-group">
                    <label htmlFor="crn-number" className="form-label">
                      CRN Reference Number
                    </label>
                    <input
                      id="crn-number"
                      type="text"
                      className="form-input mono-input"
                      placeholder="CRN-2024-00187"
                      value={crnNumber}
                      onChange={handleCrnChange}
                      maxLength={20}
                      disabled={isCooldown}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="party-name" className="form-label">
                      Party Name (Optional)
                    </label>
                    <input
                      id="party-name"
                      type="text"
                      className="form-input"
                      placeholder="Petitioner or Respondent"
                      value={partyName}
                      onChange={handlePartyNameChange}
                      disabled={isCooldown}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="captcha-input" className="form-label">
                      Security Verification
                    </label>
                    
                    <div className="captcha-container">
                      <div className="captcha-canvas-wrapper">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={78}
                          className="captcha-canvas-el"
                          aria-label="CAPTCHA Image"
                        />
                        <button
                          type="button"
                          className="refresh-btn"
                          onClick={generateNewCaptcha}
                          disabled={isCooldown}
                          aria-label="Refresh Captcha"
                          title="Generate new image"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                          </svg>
                        </button>
                      </div>

                      <div className="captcha-input-wrapper">
                        <input
                          id="captcha-input"
                          type="text"
                          className={`form-input mono-input ${validationState === 'valid' ? 'is-valid' : ''} ${validationState === 'error' ? 'has-error' : ''}`}
                          placeholder="ENTER CODE"
                          value={captchaInput}
                          onChange={handleCaptchaChange}
                          maxLength={6}
                          disabled={isCooldown}
                          autoComplete="off"
                          data-captcha={captchaValue}
                          required
                        />
                        <span className={`verified-pill ${validationState === 'valid' ? 'show' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </span>
                      </div>

                      {validationState === 'error' && (
                        <div className="field-error">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Verification failed. Refreshing code in 900ms...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="tc-button-container">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={validationState !== 'valid' || !crnNumber.trim()}
                  >
                    Verify & Track Case
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Editorial guidelines */}
            <div className="col-right">
              <div className="editorial-panel">
                <div>
                  <div className="editorial-header">
                    <h3 className="editorial-title">Filing Reference Verification</h3>
                    <p className="editorial-desc">
                      District and High Court registries issue a unique Case Receipt Number (CRN) or CNR sequence to index and schedule every active filing.
                    </p>
                  </div>

                  <ul className="info-list">
                    <li className="info-item">
                      Ensure your CRN string matches the receipt header format exactly (e.g. CRN-YYYY-NNNNNN).
                    </li>
                    <li className="info-item">
                      Entering the party name (petitioner or respondent) acts as a secondary confirmation check to prevent mismatch issues.
                    </li>
                    <li className="info-item">
                      Security verification must match case-sensitive character nodes. Automated queries are blocked.
                    </li>
                  </ul>
                </div>

                <div className="legal-notice">
                  <strong>Notice of Confidentiality:</strong> CaseWatch verifies credentials against official judicial records but does not cache or retain legal records or party profiles without consent.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="successState" className="track-case-container success-state-container">
          <div className="success-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2 className="success-title">CNR Sequence Verified</h2>
          <p className="success-subtitle">
            The filing reference has been successfully verified against the CaseWatch index engine. You can now proceed to view case timelines, schedules, and active updates.
          </p>

          <div className="success-crn-box">
            {crnNumber}
          </div>

          <div>
            <button type="button" className="proceed-btn" onClick={handleProceed}>
              Proceed to Case Timeline
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

TrackCase.propTypes = {
  onVerified: PropTypes.func
};

TrackCase.defaultProps = {
  onVerified: () => {}
};

export default TrackCase;
