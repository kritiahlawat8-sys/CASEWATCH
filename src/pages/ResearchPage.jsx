import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResearchPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://casewatch-ywbe.onrender.com';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_V3_SITEKEY;

const loadRecaptcha = () =>
  new Promise((resolve) => {
    if (window.grecaptcha) return resolve();
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.onload = resolve;
    document.head.appendChild(script);
  });

const getRecaptchaToken = async (action = 'research_search') => {
  await loadRecaptcha();
  return new Promise((resolve) =>
    window.grecaptcha.ready(() =>
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve)
    )
  );
};

const buildTitle = (result) => {
  const pet = result.petitioners?.[0] || 'Unknown';
  const res = result.respondents?.[0] || 'Unknown';
  const type = result.caseType || '';
  const year = result.filingYear || '';
  return `${type}${year ? '/' + year : ''} — ${pet} vs ${res}`;
};

const ResearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [court, setCourt] = useState('High Court');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('phrase');
  const [page, setPage] = useState(1);

  const [hasSearched, setHasSearched] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const doSearch = async (searchKeyword, searchCourt, searchType, searchPage) => {
    setIsLoading(true);
    setError('');
    try {
      let captcha_token = '';
      if (RECAPTCHA_SITE_KEY) {
        captcha_token = await getRecaptchaToken('research_search');
      }

      const params = new URLSearchParams({
        query: searchKeyword,
        court: searchCourt,
        searchType,
        page: searchPage,
        pageSize: 20,
        ...(captcha_token && { captcha_token }),
      });

      const resp = await fetch(`${API_BASE}/api/research/search?${params}`);
      const json = await resp.json();

      if (!resp.ok) {
        setError(json.detail || 'Search failed. Please try again.');
        return;
      }

      const data = json.data;
      setResults(data.results || []);
      setTotalHits(data.totalHits || 0);
      setTotalPages(data.totalPages || 1);
      setActiveKeyword(searchKeyword);
      setHasSearched(true);
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const courtParam = params.get('court') || 'High Court';
    const typeParam = params.get('type') || 'phrase';
    const pageParam = params.get('page') ? parseInt(params.get('page'), 10) : 1;

    if (q && q.trim()) {
      setKeyword(q.trim());
      setCourt(courtParam);
      setSearchType(typeParam);
      setPage(pageParam);
      doSearch(q.trim(), courtParam, typeParam, pageParam);
    } else {
      setHasSearched(false);
      setResults([]);
      setActiveKeyword('');
      setPage(1);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/research?q=${encodeURIComponent(keyword.trim())}&court=${court}&type=${searchType}&page=1`);
  };

  const handlePageChange = (newPage) => {
    navigate(`/research?q=${encodeURIComponent(activeKeyword)}&court=${court}&type=${searchType}&page=${newPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCourt('High Court');
    setKeyword('');
    setSearchType('phrase');
    setError('');
    navigate('/research');
  };

  const removeKeyword = () => handleReset();

  const highlightKeyword = (text, word) => {
    if (!word || !text) return text;
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="highlighted-keyword">{part}</mark> : part
    );
  };

  return (
    <div className="research-page">
      <Navbar />
      <main className="research-main">
        <div className="research-header">
          <span className="research-badge" id="research-badge-label">LEGAL RESEARCH</span>
          <h1>Legal Research Portal</h1>
          <p>Search court judgments and orders by keyword</p>
        </div>

        <div className="research-content-container">
          <div className="research-main-column">
            <div className="search-form-card">
              <form onSubmit={handleSearch}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Court</label>
                    <select value={court} onChange={(e) => setCourt(e.target.value)} className="form-select">
                      <option>High Court</option>
                      <option>Supreme Court</option>
                      <option>District Court</option>
                      <option>Tribunal</option>
                    </select>
                  </div>
                  <div className="form-group flex-grow">
                    <label>Keyword</label>
                    <input
                      type="text"
                      placeholder="e.g. contract breach, bail application, Section 138..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-options">
                  <span className="options-label">Search Type:</span>
                  {['phrase', 'any', 'all'].map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        value={type}
                        checked={searchType === type}
                        onChange={(e) => setSearchType(e.target.value)}
                      />
                      {type === 'phrase' ? 'Phrase(s)' : type === 'any' ? 'Any Words' : 'All Words'}
                    </label>
                  ))}
                </div>

                <div className="captcha-search-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="captcha-disclaimer" style={{ fontSize: '0.75rem', color: '#666', maxWidth: '300px' }}>
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
                    <button type="submit" className="btn-search" disabled={isLoading}>
                      {isLoading ? 'Searching...' : 'Search Judgments'}
                    </button>
                  </div>
                </div>
                {error && <div className="captcha-error">{error}</div>}
              </form>
            </div>

            <div className="search-footer-note">
              Enter keywords, acts, section numbers or any free text to find judgments and orders
            </div>

            {hasSearched && (
              <div className="results-container">
                <div className="results-header">
                  <div className="results-count">
                    <h2>About {totalHits.toLocaleString()} results</h2>
                    {activeKeyword && (
                      <div className="filter-chip">
                        Keyword: {activeKeyword}
                        <button onClick={removeKeyword} className="chip-remove">×</button>
                      </div>
                    )}
                  </div>
                </div>

                {results.length === 0 ? (
                  <div className="no-results">No judgments found for "{activeKeyword}". Try different keywords or broaden your search type.</div>
                ) : (
                  <>
                    <div className="results-list">
                      {results.map((result) => (
                        <div key={result.cnr} className="result-card">
                          <Link to={`/case/${result.cnr}`} className="result-title">
                            {buildTitle(result)}
                          </Link>
                          <p className="result-judge">
                            <strong>Judge:</strong> {result.judges?.[0] || 'Not specified'}
                          </p>
                          {result.aiKeywords?.length > 0 && (
                            <div className="result-snippet">
                              {highlightKeyword(result.aiKeywords.join(' · '), activeKeyword)}
                            </div>
                          )}
                          <div className="result-metadata">
                            <div className="metadata-item">
                              <span className="meta-label">CNR Number</span>
                              <span className="meta-value">{result.cnr}</span>
                            </div>
                            <div className="metadata-item">
                              <span className="meta-label">Filing Date</span>
                              <span className="meta-value">{result.filingDate || '—'}</span>
                            </div>
                            <div className="metadata-item">
                              <span className="meta-label">Decision Date</span>
                              <span className="meta-value">{result.decisionDate || 'Pending'}</span>
                            </div>
                            <div className="metadata-item">
                              <span className="meta-label">Status</span>
                              <span className="meta-value">{result.caseStatus || '—'}</span>
                            </div>
                            <div className="metadata-item">
                              <span className="meta-label">Court</span>
                              <span className="meta-value">{result.courtName || result.courtCode || '—'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="pagination-row">
                        <button
                          className="btn-reset"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1 || isLoading}
                        >
                          ← Prev
                        </button>
                        <span className="page-indicator">Page {page} of {totalPages}</span>
                        <button
                          className="btn-reset"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages || isLoading}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchPage;
