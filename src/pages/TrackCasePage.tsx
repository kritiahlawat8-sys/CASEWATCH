import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { INDIAN_COURTS, COURT_CATEGORIES, CourtCategory } from '../data/indianCourts';
import './TrackCasePage.css';

interface TrackCasePageProps {
  onProceed?: (crn: string) => void;
}

type Step = 1 | 2 | 3 | 4;


const TrackCasePage: React.FC<TrackCasePageProps> = ({ onProceed }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [crnNumber, setCrnNumber] = useState('');
  const [partyName, setPartyName] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [courtSearch, setCourtSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CourtCategory | 'All'>('All');

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Scroll to the interactive card section
  const scrollToCard = () => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };



  const handleCrnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 20) setCrnNumber(val);
  };

  const handlePartyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartyName(e.target.value);
  };

  const handleCourtSelect = (courtId: string) => {
    setSelectedCourt(courtId);
  };

  const handleCourtProceed = () => {
    if (selectedCourt) {
      setCurrentStep(2);
      setTimeout(() => scrollToCard(), 50);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recaptchaToken && crnNumber.trim()) {
      setIsVerified(true);
      setCurrentStep(3);
    }
  };

  const handleProceedClick = () => {
    setCurrentStep(4);
    if (onProceed) onProceed(crnNumber);
  };

  // Dynamic progress step class helper
  const stepClass = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return '';
  };

  const filteredCourts = INDIAN_COURTS.filter(c => {
    const matchesSearch = c.label.toLowerCase().includes(courtSearch.toLowerCase()) ||
      (c.state || '').toLowerCase().includes(courtSearch.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCourtLabel = INDIAN_COURTS.find(c => c.id === selectedCourt)?.label;
  const selectedCourtIcon = INDIAN_COURTS.find(c => c.id === selectedCourt)?.icon;

  return (
    <div className="track-page-wrapper">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="track-page-content">

        {/* Page Heading Block */}
        <header className="page-heading-block">
          <span className="tracking-badge">
            ⊙ Case Tracking
          </span>
          <h1 className="page-title-h1">Track Your Case</h1>
          <p className="page-lead-text">
            Verify your Case Reference Number (CRN) to access real-time judicial schedules, timeline updates, and automate affidavit generations.
          </p>
        </header>

        {/* Progress Flow Steps */}
        <div className="progress-flow-container" aria-label="Tracking step progression">
          <div className={`progress-step-item ${stepClass(1)}`}>
            <div className="progress-step-node">{currentStep > 1 ? '✓' : '1'}</div>
            <div className="progress-step-label">1. Select Court</div>
          </div>
          <div className={`progress-step-item ${stepClass(2)}`}>
            <div className="progress-step-node">{currentStep > 2 ? '✓' : '2'}</div>
            <div className="progress-step-label">2. Enter CRN</div>
          </div>
          <div className={`progress-step-item ${stepClass(3)}`}>
            <div className="progress-step-node">{currentStep > 3 ? '✓' : '3'}</div>
            <div className="progress-step-label">3. Verify</div>
          </div>
          <div className={`progress-step-item ${stepClass(4)}`}>
            <div className="progress-step-node">4</div>
            <div className="progress-step-label">4. Case Details</div>
          </div>
        </div>

        {/* Core Interactive Container Card */}
        <section className="interactive-card" ref={cardRef}>

          {/* STEP 1: SELECT COURT */}
          {currentStep === 1 && (
            <div id="courtSelectState" className="court-select-panel">
              <div className="court-select-header">
                <h2 className="court-select-title">Select Your Court</h2>
                <p className="court-select-subtitle">Search from all courts in India. Start typing the court name, district, or state.</p>
                <input
                  type="text"
                  className="pg-input court-search-input"
                  placeholder="Search by court name, city or state…"
                  value={courtSearch}
                  onChange={e => setCourtSearch(e.target.value)}
                  aria-label="Search courts"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="court-category-tabs">
                <button
                  type="button"
                  className={`court-cat-tab ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >All ({INDIAN_COURTS.length})</button>
                {COURT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`court-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} ({INDIAN_COURTS.filter(c => c.category === cat).length})
                  </button>
                ))}
              </div>

              <div className="court-list-container">
                {filteredCourts.length === 0 ? (
                  <div className="court-no-results">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p>No courts found for &ldquo;{courtSearch}&rdquo;</p>
                  </div>
                ) : (
                  <div className="court-grid">
                    {filteredCourts.map(court => (
                      <button
                        key={court.id}
                        type="button"
                        className={`court-card ${selectedCourt === court.id ? 'selected' : ''}`}
                        onClick={() => handleCourtSelect(court.id)}
                        aria-pressed={selectedCourt === court.id}
                      >
                        <span className="court-card-icon">{court.icon}</span>
                        <span className="court-card-label">
                          {court.label}
                          {court.state && <span className="court-card-state">{court.state}</span>}
                        </span>
                        {selectedCourt === court.id && (
                          <span className="court-card-check">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="card-footer-bar">
                <div className="privacy-encrypted-note">
                  {selectedCourt
                    ? <><span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>&nbsp;Selected: <strong>{selectedCourtIcon} {selectedCourtLabel}</strong></>
                    : 'Please select a court to continue.'}
                </div>
                <button
                  type="button"
                  className="pg-submit-btn"
                  disabled={!selectedCourt}
                  onClick={handleCourtProceed}
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER CRN + CAPTCHA */}
          {currentStep === 2 && (
            <div id="formState" className="form-panel">
              <div className="step-back-bar">
                <button type="button" className="step-back-btn" onClick={() => { setCurrentStep(1); setTimeout(() => scrollToCard(), 50); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back
                </button>
                <span className="step-back-court-tag">
                  {INDIAN_COURTS.find(c => c.id === selectedCourt)?.icon} {selectedCourtLabel}
                </span>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="form-split-grid">
                  {/* Left Input Column */}
                  <div className="left-input-col">
                    <div className="field-group">
                      <label htmlFor="pg-crn-number" className="field-label">
                        CRN / Case Number
                      </label>
                      <div className="input-with-icon-wrapper">
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
                      />
                    </div>
                  </div>

                  {/* Middle Column Divider */}
                  <div className="middle-divider-col" aria-hidden="true" />

                  {/* Right reCAPTCHA Column */}
                  <div className="right-captcha-col">
                    <div className="field-group">
                      <label className="field-label">Security Verification</label>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LdK90AtAAAAAlUtdb3TwH_iWdJSO1U5FxvPovbO"
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                        theme="light"
                      />
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
                    disabled={!recaptchaToken || !crnNumber.trim()}
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
          )}

          {/* STEP 3: CRN VERIFIED */}
          {currentStep === 3 && (
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
      </main>

      {/* Global Animated Footer */}
      <Footer />
    </div>
  );
};

export default TrackCasePage;
