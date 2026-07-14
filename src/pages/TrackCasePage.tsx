import React, { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CaseDetails from '../components/CaseDetails';
import { searchCourts, getCategories, Court } from '../data/indianCourts';
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
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [courts, setCourts] = useState<Court[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCourtData, setSelectedCourtData] = useState<Court | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 4 State
  const [caseData, setCaseData] = useState<any>(null);
  const [caseLoading, setCaseLoading] = useState(false);
  const [caseError, setCaseError] = useState<string | null>(null);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const cats = await getCategories();
        if (active) {
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  // Fetch courts when search query or category filter changes
  useEffect(() => {
    let active = true;
    const timeoutId = setTimeout(() => {
      async function fetchCourts() {
        setLoading(true);
        setError(null);
        try {
          const categoryFilter = activeCategory === 'All' ? '' : activeCategory;
          const results = await searchCourts(courtSearch, categoryFilter);
          if (active) {
            setCourts(results);
          }
        } catch (err) {
          console.error('Failed to fetch courts:', err);
          if (active) {
            setError('Failed to connect to the backend server. Please verify the backend is running.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
      fetchCourts();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [courtSearch, activeCategory]);

  // Handle auto-lookup from homepage CNR search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let cnrVal = params.get('cnr');
    if (!cnrVal) {
      cnrVal = localStorage.getItem('cnr_search');
      if (cnrVal) {
        localStorage.removeItem('cnr_search');
      }
    }

    if (cnrVal) {
      const sanitizedCnr = cnrVal.trim().toUpperCase();
      setCrnNumber(sanitizedCnr);
    }
  }, []);

  // Fetch Case Details when reaching Step 4
  useEffect(() => {
    let active = true;
    if (currentStep === 3 && (!caseData || caseData.cnr !== crnNumber)) {
      async function fetchCase() {
        setCaseLoading(true);
        setCaseError(null);
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://casewatch.onrender.com';
          const res = await fetch(`${apiUrl}/api/cases/lookup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cnr: crnNumber, party_name: partyName })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.detail || 'Failed to fetch case details');
          }
          if (active) setCaseData(data);
        } catch (err: any) {
          if (active) setCaseError(err.message || 'An error occurred while fetching case data.');
        } finally {
          if (active) setCaseLoading(false);
        }
      }
      fetchCase();
    }
    return () => { active = false; };
  }, [currentStep, crnNumber, partyName, caseData]);

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
    const court = courts.find(c => c.id === courtId);
    if (court) {
      setSelectedCourtData(court);
    }
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

  const handleCnrRetry = async () => {
    if (!crnNumber.trim()) return;
    setCaseLoading(true);
    setCaseError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://casewatch.onrender.com';
      const res = await fetch(`${apiUrl}/api/cases/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnr: crnNumber.trim().toUpperCase(), party_name: partyName })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to fetch case details');
      }
      setCaseData(data);
      setCurrentStep(4);
    } catch (err: any) {
      setCaseError(err.message || 'An error occurred while fetching case data.');
    } finally {
      setCaseLoading(false);
    }
  };

  // Dynamic progress step class helper
  const stepClass = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return '';
  };

  const selectedCourtLabel = selectedCourtData?.label;
  const selectedCourtIcon = selectedCourtData?.icon;

  return (
    <div className="track-page-wrapper">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className={currentStep === 4 ? "track-page-content-full" : "track-page-content"}>
        {currentStep < 4 ? (
          <>
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
                <div className="progress-step-label">Select Court</div>
              </div>
              <div className={`progress-step-item ${stepClass(2)}`}>
                <div className="progress-step-node">{currentStep > 2 ? '✓' : '2'}</div>
                <div className="progress-step-label">Enter CRN</div>
              </div>
              <div className={`progress-step-item ${stepClass(3)}`}>
                <div className="progress-step-node">{currentStep > 3 ? '✓' : '3'}</div>
                <div className="progress-step-label">Verify</div>
              </div>
              <div className={`progress-step-item ${stepClass(4)}`}>
                <div className="progress-step-node">4</div>
                <div className="progress-step-label">Case Details</div>
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
                >All</button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`court-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="court-list-container">
                {loading ? (
                  <div className="court-no-results">
                    <p>Loading courts...</p>
                  </div>
                ) : error ? (
                  <div className="court-no-results">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger, #ef4444)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p style={{ color: 'var(--color-danger, #ef4444)', marginTop: '8px' }}>{error}</p>
                  </div>
                ) : courts.length === 0 ? (
                  <div className="court-no-results">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p>No courts found for &ldquo;{courtSearch}&rdquo;</p>
                  </div>
                ) : (
                  <div className="court-grid">
                    {courts.map(court => (
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
                  {selectedCourtIcon} {selectedCourtLabel}
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
                        sitekey="6LdK90AtAAAAAIUtdb3TwH_iWdJSO1U5FxvPovbO"
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
              {caseLoading ? (
                <div className="case-loading-state" style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="case-spinner"></div>
                  <p style={{ marginTop: '16px' }}>Fetching real-time case data from eCourts India...</p>
                </div>
              ) : (
                <>
                  <div className="success-checkbox-badge">
                    {caseError ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-error, #c0392b)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                  </div>

                  <h2 className="success-h2">
                    {caseError ? 'Verification Failed' : 'CRN Verified Successfully'}
                  </h2>
                  <p className="success-guidance">
                    {caseError 
                      ? 'We could not locate details for the entered CNR. Please verify the code and try again.'
                      : 'Judicial filing records match the reference CNR key. Real-time docket timelines, past hearings, and upcoming court schedules are ready to download.'
                    }
                  </p>

                  <div className="field-group" style={{ maxWidth: '400px', width: '100%', margin: '0 auto 24px auto' }}>
                    <input
                      type="text"
                      className="pg-input mono"
                      style={{ textAlign: 'center', borderRadius: '8px', border: caseError ? '1px solid var(--color-error, #c0392b)' : '1px solid var(--border-color)' }}
                      value={crnNumber}
                      onChange={handleCrnChange}
                      placeholder="Enter CNR Number"
                    />
                    {caseError && (
                      <p className="error-message" style={{ color: 'var(--color-error, #c0392b)', marginTop: '8px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                        {caseError}
                      </p>
                    )}
                  </div>

                  <div>
                    {caseError ? (
                      <button type="button" className="view-details-btn" onClick={handleCnrRetry}>
                        Retry Lookup
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                      </button>
                    ) : (
                      <button type="button" className="view-details-btn" onClick={handleProceedClick}>
                        View Case Details
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
            </section>
          </>
        ) : (
          /* STEP 4: CASE DETAILS */
          <div id="caseDetailsState" className="fade-in-up">
            {caseLoading ? (
              <div className="case-loading-state">
                <div className="case-spinner"></div>
                <p>Fetching real-time case data from eCourts India...</p>
              </div>
            ) : caseError ? (
              <div className="case-error-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error, #c0392b)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3>Verification Failed</h3>
                <p>{caseError}</p>
                <button className="pg-submit-btn" style={{ marginTop: '20px' }} onClick={() => setCurrentStep(2)}>
                  Try Again
                </button>
              </div>
            ) : caseData ? (
              <CaseDetails caseData={caseData} onBack={() => { setCurrentStep(2); setCaseData(null); }} />
            ) : null}
          </div>
        )}
      </main>

      {/* Global Animated Footer */}
      {currentStep < 4 && <Footer />}
    </div>
  );
};

export default TrackCasePage;
