import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { documentTemplates, CANONICAL_CASE_TYPES } from '../data/documentTemplates';
import './Documents.css';

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState('All');

  // SEO Updates
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Legal Document Templates | CaseWatch";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Browse, search, and download free legal document templates for Civil, Criminal, Family, Property, Consumer, and Labour matters in India from CaseWatch.");
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      metaDesc.content = "Browse, search, and download free legal document templates for Civil, Criminal, Family, Property, Consumer, and Labour matters in India from CaseWatch.";
      document.head.appendChild(metaDesc);
    }
  }, []);

  // Live Filtering Logic (Search and Filter Pills combined with AND logic)
  const filteredTemplates = documentTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCaseType =
      selectedCaseType === 'All' ||
      template.caseTypes.includes(selectedCaseType);

    return matchesSearch && matchesCaseType;
  });

  return (
    <ReactLenis root>
      <div className="documents-page-wrapper">
        <Navbar />

        <main className="documents-page-content" id="main-content">
          {/* Header Section */}
          <header className="documents-header">
            <span className="documents-badge" id="documents-badge-label">Templates Library</span>
            <h1 className="documents-title">Free Legal Document Templates</h1>
            <p className="documents-subtitle">
              Search and download court-ready templates for different legal matters in India. Completely free, offline, and ready to edit.
            </p>
          </header>

          {/* Search Bar & Controls */}
          <section className="documents-controls" aria-label="Search and Filter Controls">
            <div className="search-input-wrapper">
              <span className="material-symbols-outlined search-icon" aria-hidden="true">search</span>
              <input
                type="text"
                id="search-documents-input"
                className="search-input"
                placeholder="Search documents by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search documents by name or description"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="clear-search-btn"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="filter-pills-container" role="group" aria-label="Filter documents by case type">
              <button
                type="button"
                id="filter-pill-all"
                className={`filter-pill ${selectedCaseType === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCaseType('All')}
                aria-pressed={selectedCaseType === 'All'}
              >
                All
              </button>
              {CANONICAL_CASE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  id={`filter-pill-${type.toLowerCase()}`}
                  className={`filter-pill ${selectedCaseType === type ? 'active' : ''}`}
                  onClick={() => setSelectedCaseType(type)}
                  aria-pressed={selectedCaseType === type}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Document Templates List (Row Layout) */}
          <section className="documents-list-section" aria-label="Matching document templates">
            {filteredTemplates.length > 0 ? (
              <div className="documents-list" id="documents-grid-list">
                {filteredTemplates.map((template) => (
                  <article 
                    className="document-row" 
                    key={template.id} 
                    id={`document-row-${template.id}`}
                  >
                    <div className="row-left">
                      <h2 className="document-row-name">{template.name}</h2>
                      <p className="document-row-desc">{template.description}</p>
                    </div>
                    
                    <div className="row-right">
                      <span className="row-category-label">
                        {template.caseTypes.join(', ')}
                      </span>
                      <a
                        href={`/templates/${template.fileName}`}
                        download={template.fileName}
                        id={`download-btn-${template.id}`}
                        className="btn-download-row"
                        aria-label={`Download ${template.name} as template`}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">download</span>
                        Download
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" id="documents-empty-state">
                <span className="material-symbols-outlined empty-state-icon" aria-hidden="true">search_off</span>
                <h3 className="empty-state-title">No documents found</h3>
                <p className="empty-state-text">
                  We couldn't find any templates matching "{searchQuery}" in category "{selectedCaseType}". Try adjusting your search query or filters.
                </p>
                <button
                  type="button"
                  id="reset-filters-btn"
                  className="btn-reset"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCaseType('All');
                  }}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </ReactLenis>
  );
}
