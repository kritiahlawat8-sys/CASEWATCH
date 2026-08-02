import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResearchPage.css';

const MOCK_RESULTS = [
  {
    id: 1,
    title: 'B.A./7134/2026 of John Doe Vs Jane Smith',
    judge: 'Hon\'ble Mr. Justice A.B. Carter',
    snippet: '...the court finds that the plaintiff has established a prima facie case. The requested keyword was thoroughly examined during the proceedings and it was determined that the defendant...',
    metadata: {
      cnr: 'MHCB010000012026',
      registeredDate: '15-01-2026',
      decisionDate: '20-03-2026',
      disposalNature: 'Allowed',
      court: 'High Court of Delhi'
    }
  },
  {
    id: 2,
    title: 'W.P.(C)/1205/2026 of Tech Corp Vs Union of India',
    judge: 'Hon\'ble Ms. Justice P.K. Sharma',
    snippet: '...upon reviewing the documents, it is evident that the keyword in question does not apply to the current context. The petition is therefore dismissed on grounds of...',
    metadata: {
      cnr: 'MHCB010012052026',
      registeredDate: '10-02-2026',
      decisionDate: '05-04-2026',
      disposalNature: 'Dismissed',
      court: 'High Court of Bombay'
    }
  }
];

const ResearchPage = () => {
  const [court, setCourt] = useState('High Court');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('phrase');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  const [captchaValue, setCaptchaValue] = useState('');
  const [error, setError] = useState('');
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!captchaValue.trim()) {
      setError('Please enter the captcha text to proceed.');
      return;
    }
    
    if (!keyword.trim()) return;
    
    setError('');
    setIsLoading(true);
    
    // Mocking API call
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setActiveKeyword(keyword);
      setHasSearched(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setCourt('High Court');
    setKeyword('');
    setSearchType('phrase');
    setCaptchaValue('');
    setError('');
    setHasSearched(false);
    setResults([]);
    setActiveKeyword('');
  };

  const removeKeyword = () => {
    setHasSearched(false);
    setResults([]);
    setActiveKeyword('');
    setKeyword('');
  };

  const highlightKeyword = (text, word) => {
    if (!word) return text;
    const regex = new RegExp(`(${word})`, 'gi');
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
            
            {/* Search Form */}
            <div className="search-form-card">
              <form onSubmit={handleSearch}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Court</label>
                    <select value={court} onChange={(e) => setCourt(e.target.value)} className="form-select">
                      <option value="High Court">High Court</option>
                      <option value="Supreme Court">Supreme Court</option>
                      <option value="District Court">District Court</option>
                    </select>
                  </div>
                  <div className="form-group flex-grow">
                    <label>Keyword</label>
                    <input 
                      type="text" 
                      placeholder="Enter Keyword..." 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-options">
                  <span className="options-label">Search Type:</span>
                  <label className="radio-label">
                    <input type="radio" value="phrase" checked={searchType === 'phrase'} onChange={(e) => setSearchType(e.target.value)} />
                    Phrase(s)
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="any" checked={searchType === 'any'} onChange={(e) => setSearchType(e.target.value)} />
                    Any Words
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="all" checked={searchType === 'all'} onChange={(e) => setSearchType(e.target.value)} />
                    All Words
                  </label>
                </div>

                <div className="captcha-search-row">
                  <div className="captcha-container">
                    <div className="captcha-image">
                      <span>5Z1bP6</span>
                    </div>
                    <button type="button" className="captcha-icon-btn" title="Listen">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </button>
                    <button type="button" className="captcha-icon-btn" title="Refresh">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                    </button>
                    <input 
                      type="text" 
                      className="captcha-input" 
                      placeholder="Enter captcha" 
                      value={captchaValue}
                      onChange={(e) => setCaptchaValue(e.target.value)}
                    />
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
              Enter keywords, acts or any free text and find specific judgments and orders
            </div>

            {/* Results Display */}
            {hasSearched && (
              <div className="results-container">
                <div className="results-header">
                  <div className="results-count">
                    <h2>About {results.length} results</h2>
                    {activeKeyword && (
                      <div className="filter-chip">
                        Keyword: {activeKeyword}
                        <button onClick={removeKeyword} className="chip-remove">×</button>
                      </div>
                    )}
                  </div>
                  <div className="results-pagination-controls">
                    <label>Show entries:</label>
                    <select className="entries-select">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                <div className="results-list">
                  {results.map((result) => (
                    <div key={result.id} className="result-card">
                      <a href="#" className="result-title">{result.title}</a>
                      <p className="result-judge"><strong>Judge:</strong> {result.judge}</p>
                      
                      <div className="result-snippet">
                        {highlightKeyword(result.snippet, activeKeyword)}
                      </div>

                      <div className="result-metadata">
                        <div className="metadata-item">
                          <span className="meta-label">CNR Number</span>
                          <span className="meta-value">{result.metadata.cnr}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="meta-label">Date of Registration</span>
                          <span className="meta-value">{result.metadata.registeredDate}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="meta-label">Decision Date</span>
                          <span className="meta-value">{result.metadata.decisionDate}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="meta-label">Disposal Nature</span>
                          <span className="meta-value">{result.metadata.disposalNature}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="meta-label">Court</span>
                          <span className="meta-value">{result.metadata.court}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
