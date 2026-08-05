import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CaseDetails from '../components/CaseDetails';

const API_BASE = import.meta.env.VITE_API_URL || 'https://casewatch-ywbe.onrender.com';

const CasePage: React.FC = () => {
  const { cnr } = useParams<{ cnr: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!cnr) return;
      setLoading(true);
      setError(null);
      
      try {
        const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITEKEY;
        let captchaToken = '';
        
        if (siteKey && window.grecaptcha) {
          captchaToken = await new Promise<string>((resolve) => {
            window.grecaptcha.ready(() => {
              window.grecaptcha.execute(siteKey, { action: 'case_lookup' })
                .then(resolve)
                .catch(() => resolve('')); // Fallback
            });
          });
        }
        
        const response = await fetch(`${API_BASE}/api/cases/lookup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cnr,
            party_name: '',
            captcha_token: captchaToken
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch case details');
        }
        
        setCaseData(data);
      } catch (err: any) {
        setError(err.message || 'Network error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    // Ensure grecaptcha is loaded before calling
    if (import.meta.env.VITE_RECAPTCHA_V3_SITEKEY && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_V3_SITEKEY}`;
      script.onload = () => fetchCase();
      document.head.appendChild(script);
    } else {
      fetchCase();
    }
  }, [cnr]);

  return (
    <div className="case-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '40px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>Loading Case details for {cnr}...</h2>
              <p>This may take a few moments.</p>
            </div>
          )}
          
          {error && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>
              <h2>Error Loading Case</h2>
              <p>{error}</p>
              <button 
                onClick={() => navigate(-1)}
                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Go Back
              </button>
            </div>
          )}
          
          {caseData && (
            <CaseDetails 
              caseData={caseData} 
              onBack={() => navigate(-1)} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CasePage;
