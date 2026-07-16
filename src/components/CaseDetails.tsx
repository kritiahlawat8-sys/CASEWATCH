/// <reference types="vite/client" />

import React, { useState } from 'react';

export interface ActSection {
  act: string;
  sections: string[];
}

export interface FIRDetails {
  police_station?: string;
  fir_number?: string;
  year?: string;
}

export interface HistoryItem {
  judge?: string;
  business_on_date?: string;
  hearing_date?: string;
  purpose?: string;
}

export interface InterimOrder {
  order_no: string;
  title: string;
  date: string;
  copy_url?: string;
}

export interface CaseData {
  cnr: string;
  case_number?: string;
  case_type?: string;
  filing_no?: string;
  filing_date?: string;
  registration_no?: string;
  registration_date?: string;
  court_name?: string;
  court_type?: string;
  state?: string;
  district?: string;
  status?: string;
  first_hearing_date?: string;
  next_hearing?: string;
  stage?: string;
  court_no?: string;
  judge?: string;
  petitioner?: string;
  petitioner_advocate?: string;
  respondent?: string;
  respondent_advocate?: string;
  acts_sections?: ActSection[];
  fir_details?: FIRDetails;
  history?: HistoryItem[];
  interim_orders?: InterimOrder[];
  case_file_ref?: string;
}

interface CaseDetailsProps {
  caseData: CaseData;
  onBack: () => void;
}

// Client-side fallback / enrichment for all cases to prevent cache/API misses on detailed layout sections
const enrichCaseData = (data: CaseData): CaseData => {
  return data;
};

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData: rawCaseData, onBack }) => {
  const caseData = enrichCaseData(rawCaseData);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // AI Case Summary states
  interface SummaryData {
    caseOverview: string;
    currentStatus: string;
    nextHearing: string;
    whatThisMeans: string;
    recommendedNextSteps: string;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:8000';
    }
    return 'https://casewatch.onrender.com';
  };

  const handleGenerateSummary = async (forceRegenerate = false) => {
    if (summaryData && !forceRegenerate) {
      setIsExpanded(true);
      return;
    }
    
    setSummaryLoading(true);
    setSummaryError(null);
    setIsExpanded(true);
    
    const payload = { case_data: caseData };
    console.log("Sending AI summary request to backend. Endpoint:", `${getApiUrl()}/api/cases/summarize`, "Payload:", payload);
    
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/cases/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        let errorMsg = `Server error (${response.status}): Failed to generate summary from server.`;
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      console.log("API response data received in frontend:", data);
      
      setSummaryData({
        caseOverview: data.caseOverview || '',
        currentStatus: data.currentStatus || '',
        nextHearing: data.nextHearing || '',
        whatThisMeans: data.whatThisMeans || '',
        recommendedNextSteps: data.recommendedNextSteps || '',
      });
    } catch (err: any) {
      console.error("AI summary generation error:", err);
      setSummaryError(err.message || 'An error occurred while generating the summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    
    const textToCopy = [
      `📄 Case Overview\n${summaryData.caseOverview}`,
      `⚖️ Current Status\n${summaryData.currentStatus}`,
      `📅 Next Hearing\n${summaryData.nextHearing}`,
      `💡 What This Means\n${summaryData.whatThisMeans}`,
      `✅ Recommended Next Steps\n${summaryData.recommendedNextSteps}`
    ].join('\n\n');
      
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopy = (order: InterimOrder) => {
    const textToCopy = `${order.title} (${order.date}) - Case CNR: ${caseData.cnr}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedOrderId(order.order_no);
      setTimeout(() => setCopiedOrderId(null), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine if sections have valid data
  const hasLeftIdData = caseData.case_type || caseData.filing_no || caseData.filing_date || caseData.registration_no || caseData.registration_date;
  const hasCaseId = hasLeftIdData || caseData.cnr;
  const hasStatus = caseData.first_hearing_date || caseData.next_hearing || caseData.stage || caseData.status || caseData.court_no || caseData.judge;
  const hasParties = caseData.petitioner || caseData.respondent;
  const hasActs = caseData.acts_sections && caseData.acts_sections.length > 0;
  const hasFIR = caseData.fir_details && (caseData.fir_details.police_station || caseData.fir_details.fir_number || caseData.fir_details.year);
  const hasHistory = caseData.history && caseData.history.length > 0;
  
  const displayOrders = caseData.interim_orders || [];

  // Resolve case file ref: either passed, or case number, or fallback
  const resolvedCaseFileRef = caseData.case_number || caseData.registration_no || `REF-${caseData.cnr}`;

  // Direct Inline Style Overrides to prevent global prefers-color-scheme dark mode text visibility bugs
  const headingStyle = { color: '#1a1a1a', fontWeight: 'bold' };
  const textDarkStyle = { color: '#1a1a1a' };
  const textMutedStyle = { color: '#5a5a54' };
  
  // Safe top spacing to ensure sticky navbar (72px) never overlaps content
  const cardStyle = { scrollMarginTop: '96px' };

  return (
    <div className="bg-[#EDEBE4] py-8 px-4 sm:px-6 lg:px-12 font-sans antialiased">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION (Centered, back button removed) */}
        <header className="flex flex-col items-center justify-center text-center gap-1.5 mb-6 w-full">
          {/* Court Name */}
          <h1 
            style={headingStyle}
            className="font-serif text-2xl sm:text-3xl leading-tight"
          >
            {caseData.court_name || 'Court Name Not Specified'}
          </h1>
          <p 
            style={{ color: '#41413eff' }}
            className="text-xs sm:text-sm font-mono tracking-wide"
          >
            Case File Ref: {resolvedCaseFileRef}
          </p>
        </header>

        {/* 1. CASE IDENTIFICATION CARD (p-6 24px padding, wraps content tightly) */}
        {hasCaseId && (
          <section 
            style={cardStyle}
            className="bg-white rounded-xl border border-[#E5E3DB] shadow-sm p-6 scroll-mt-24"
          >
            <div className="mb-4">
              <span 
                style={textMutedStyle}
                className="text-xs font-semibold uppercase tracking-wider block mb-0.5 font-sans"
              >
                CASE OVERVIEW
              </span>
              <h2 
                style={headingStyle}
                className="font-serif text-xl"
              >
                Case Identification
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Side: Flex row with moderate, consistent spacing (gap: 24px / gap-6) */}
              {hasLeftIdData && (
              <div className="lg:col-span-9 flex flex-wrap gap-x-8 gap-y-4">
                {caseData.case_type && (
                  <div className="min-w-[130px]">
                    <span style={textMutedStyle} className="text-xs font-semibold block mb-0.5">Case Type</span>
                    <span style={textDarkStyle} className="text-sm font-medium">{caseData.case_type}</span>
                  </div>
                )}
                {caseData.filing_no && (
                  <div className="min-w-[110px]">
                    <span style={textMutedStyle} className="text-xs font-semibold block mb-0.5">Filing No</span>
                    <span style={textDarkStyle} className="text-sm font-medium">{caseData.filing_no}</span>
                  </div>
                )}
                {caseData.filing_date && (
                  <div className="min-w-[110px]">
                    <span style={textMutedStyle} className="text-xs font-semibold block mb-0.5">Filing Date</span>
                    <span style={textDarkStyle} className="text-sm font-medium">{caseData.filing_date}</span>
                  </div>
                )}
                {caseData.registration_no && (
                  <div className="min-w-[130px]">
                    <span style={textMutedStyle} className="text-xs font-semibold block mb-0.5">Registration No</span>
                    <span style={textDarkStyle} className="text-sm font-medium">{caseData.registration_no}</span>
                  </div>
                )}
                {caseData.registration_date && (
                  <div className="min-w-[135px]">
                    <span style={textMutedStyle} className="text-xs font-semibold block mb-0.5">Registration Date</span>
                    <span style={textDarkStyle} className="text-sm font-medium">{caseData.registration_date}</span>
                  </div>
                )}
              </div>
              )}

              {/* Right Side: Highlighted CNR Box */}
              <div className={`${hasLeftIdData ? 'lg:col-span-3' : 'lg:col-span-12'} bg-neutral-50 rounded-lg p-4 border-l-4 border-black flex flex-col justify-center`}>
                <span style={textMutedStyle} className="text-[11px] font-semibold tracking-wider block mb-1">
                  CNR Number
                </span>
                <span 
                  style={textDarkStyle}
                  className="font-mono font-bold text-sm sm:text-base tracking-wider break-all block"
                >
                  {caseData.cnr}
                </span>
                <span style={textMutedStyle} className="text-[10px] italic mt-1.5 block">
                  Save this for future reference
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 2. CASE STATUS CARD (Green left-border, light green bg) */}
        {hasStatus && (
          <section 
            style={cardStyle}
            className="bg-[#edfaf4] border-l-4 border-[#22c55e] rounded-r-xl border-y border-r border-[#d4f2e4] shadow-sm p-6 sm:p-8 scroll-mt-24"
          >
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 font-sans block mb-1">
                CURRENT TRACKING
              </span>
              <h2 
                style={{ color: '#14532d', fontWeight: 'bold' }}
                className="font-serif text-xl sm:text-2xl"
              >
                Case Status
              </h2>
            </div>

            {/* Rendered in a single row on larger screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {caseData.first_hearing_date && (
                <div>
                  <span className="text-xs text-emerald-800/70 font-semibold block mb-1">First Hearing Date</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.first_hearing_date}</span>
                </div>
              )}
              {caseData.next_hearing && (
                <div>
                  <span className="text-xs text-emerald-800/70 font-semibold block mb-1">Next Hearing Date</span>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-[#22c55e]">{caseData.next_hearing}</span>
                    <button
                      onClick={() => {
                        const hearingDate = caseData.next_hearing;
                        if (!hearingDate) return;
                        const formattedDate = hearingDate.replace(/-/g, '');
                        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
                          `&text=${encodeURIComponent(`${caseData.petitioner || ''} vs ${caseData.respondent || ''}`)}` +
                          `&dates=${formattedDate}/${formattedDate}` +
                          `&details=${encodeURIComponent(`CNR: ${caseData.cnr}\nCourt: ${caseData.court_name || ''}\nCase Number: ${caseData.case_number || ''}\nStatus: ${caseData.status || ''}`)}` +
                          `&location=${encodeURIComponent(caseData.court_name || '')}`;
                        window.open(googleCalendarUrl, '_blank');
                      }}
                      className="bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full py-3 px-6 shadow-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer self-start"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                      </svg>
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
              {(caseData.stage || caseData.status) && (
                <div>
                  <span className="text-xs text-emerald-800/70 font-semibold block mb-1">Stage of Case</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.stage || caseData.status}</span>
                </div>
              )}
              {caseData.court_no && (
                <div>
                  <span className="text-xs text-emerald-800/70 font-semibold block mb-1">Court Number</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.court_no}</span>
                </div>
              )}
              {caseData.judge && (
                <div>
                  <span className="text-xs text-emerald-800/70 font-semibold block mb-1">Judge</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.judge}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. PETITIONER & RESPONDENT SIDE-BY-SIDE CARDS */}
        {hasParties && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Petitioner Card */}
            {caseData.petitioner && (
              <section 
                style={cardStyle}
                className="bg-white rounded-xl border border-[#E5E3DB] shadow-sm p-6 sm:p-8 scroll-mt-24"
              >
                <div className="mb-4">
                  <span 
                    style={textMutedStyle}
                    className="text-xs font-semibold uppercase tracking-wider font-sans block mb-2"
                  >
                    PLAINTIFF PARTY
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <h2 
                      style={headingStyle}
                      className="font-serif text-lg sm:text-xl"
                    >
                      Petitioner
                    </h2>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <p style={textDarkStyle} className="text-sm font-bold">{caseData.petitioner}</p>
                  {caseData.petitioner_advocate && (
                    <p style={textMutedStyle} className="text-[12px] font-sans">
                      Advocate: <span style={textDarkStyle} className="font-semibold">{caseData.petitioner_advocate}</span>
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Respondent Card */}
            {caseData.respondent && (
              <section 
                style={cardStyle}
                className="bg-white rounded-xl border border-[#E5E3DB] shadow-sm p-6 sm:p-8 scroll-mt-24"
              >
                <div className="mb-4">
                  <span 
                    style={textMutedStyle}
                    className="text-xs font-semibold uppercase tracking-wider font-sans block mb-2"
                  >
                    DEFENDING PARTY
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M21 21H3" />
                    </svg>
                    <h2 
                      style={headingStyle}
                      className="font-serif text-lg sm:text-xl"
                    >
                      Respondent
                    </h2>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <p style={textDarkStyle} className="text-sm font-bold">{caseData.respondent}</p>
                  {caseData.respondent_advocate && (
                    <p style={textMutedStyle} className="text-[12px] font-sans">
                      Advocate: <span style={textDarkStyle} className="font-semibold">{caseData.respondent_advocate}</span>
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 4. ACTS & SECTIONS CARD */}
        {hasActs && (
          <section 
            style={cardStyle}
            className="bg-white rounded-xl border border-[#E5E3DB] shadow-sm p-6 sm:p-8 scroll-mt-24"
          >
            <div className="mb-6">
              <span 
                style={textMutedStyle}
                className="text-xs font-semibold uppercase tracking-wider font-sans block mb-1"
              >
                LEGAL PROVISIONS
              </span>
              <h2 
                style={headingStyle}
                className="font-serif text-xl sm:text-2xl"
              >
                Acts & Sections
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.acts_sections?.map((item, idx) => (
                <div key={idx} className="p-4 border border-[#ECEBE6] rounded-xl flex flex-col gap-2">
                  <span style={textMutedStyle} className="text-xs font-semibold">Act</span>
                  <p style={textDarkStyle} className="text-sm font-bold">{item.act}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.sections.map((sec, secIdx) => (
                      <span
                        key={secIdx}
                        className="bg-[#edfaf4] text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-[#d4f2e4]"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. FIR DETAILS CARD (Light beige bg) */}
        {hasFIR && (
          <section 
            style={cardStyle}
            className="bg-[#FAF7F0] rounded-xl border border-[#ECE5D8] shadow-sm p-6 sm:p-8 scroll-mt-24"
          >
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-sans block mb-1">
                POLICE RECORD
              </span>
              <h2 
                style={{ color: '#78350f', fontWeight: 'bold' }}
                className="font-serif text-xl sm:text-2xl"
              >
                FIR Details
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {caseData.fir_details?.police_station && (
                <div>
                  <span className="text-xs text-amber-800/70 font-semibold block mb-1">Police Station</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.fir_details.police_station}</span>
                </div>
              )}
              {caseData.fir_details?.fir_number && (
                <div>
                  <span className="text-xs text-amber-800/70 font-semibold block mb-1">FIR Number</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.fir_details.fir_number}</span>
                </div>
              )}
              {caseData.fir_details?.year && (
                <div>
                  <span className="text-xs text-amber-800/70 font-semibold block mb-1">Year</span>
                  <span style={textDarkStyle} className="text-sm font-medium">{caseData.fir_details.year}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. CASE HISTORY TABLE (Positioned between FIR Details and Interim Orders) */}
        {hasHistory && (
          <section 
            style={cardStyle}
            className="bg-white rounded-xl border border-[#E5E3DB] shadow-sm p-6 sm:p-8 overflow-hidden scroll-mt-24"
          >
            <div className="mb-6">
              <span 
                style={textMutedStyle}
                className="text-xs font-semibold uppercase tracking-wider font-sans block mb-1"
              >
                HEARING TIMELINE
              </span>
              <h2 
                style={headingStyle}
                className="font-serif text-xl sm:text-2xl"
              >
                Case History
              </h2>
            </div>

            <div className="overflow-x-auto -mx-6 sm:-mx-8">
              <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th scope="col" style={textMutedStyle} className="py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Judge
                      </th>
                      <th scope="col" style={textMutedStyle} className="py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Business on Date
                      </th>
                      <th scope="col" style={textMutedStyle} className="py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Hearing Date
                      </th>
                      <th scope="col" style={textMutedStyle} className="py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {caseData.history?.map((h, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td style={textMutedStyle} className="py-4 text-sm whitespace-nowrap">
                          {h.judge}
                        </td>
                        <td style={textDarkStyle} className="py-4 text-sm font-semibold whitespace-nowrap">
                          {h.business_on_date}
                        </td>
                        <td className="py-4 text-sm whitespace-nowrap">
                          {h.hearing_date ? (
                            <span className="text-[#22c55e] font-bold hover:underline cursor-pointer">
                              {h.hearing_date}
                            </span>
                          ) : null}
                        </td>
                        <td style={textMutedStyle} className="py-4 text-sm whitespace-nowrap">
                          {h.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* AI CASE SUMMARY SECTION */}
        <section 
          style={cardStyle}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 scroll-mt-24 w-full"
        >
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0); }
              100% { transform: translateX(100%); }
            }
            .animate-loading-bar {
              animation: loadingBar 2s infinite ease-in-out;
            }
            @keyframes spinSlow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spinSlow 4s linear infinite;
            }
          `}</style>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0">
                <svg className="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929L18.5 8L17.929 4.929L15 4.357L17.929 3.786L18.5 0.714L19.071 3.786L22 4.357L19.071 4.929Z" />
                </svg>
              </div>
              <div>
                <h2 style={headingStyle} className="font-serif text-lg sm:text-xl leading-snug">
                  AI Case Summary
                </h2>
                <p style={textDarkStyle} className="text-sm font-medium mt-0.5">
                  Understand this case in simple language
                </p>
                <p style={textMutedStyle} className="text-xs mt-1.5 font-sans">
                  Generated only from official case records. No assumptions are made.
                </p>
              </div>
            </div>
            
            {!isExpanded && (
              <button
                onClick={() => handleGenerateSummary(false)}
                className="w-full md:w-auto bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider rounded-full py-3 px-6 shadow-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-stretch md:self-center"
              >
                Generate Summary
              </button>
            )}
          </div>

          {/* Accordion Expansion Container */}
          <div 
            className="transition-all duration-500 ease-in-out overflow-hidden"
            style={{
              maxHeight: isExpanded ? '2000px' : '0px',
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? '24px' : '0px',
              paddingTop: isExpanded ? '24px' : '0px',
              borderTop: isExpanded ? '1px solid #E5E7EB' : 'none'
            }}
          >
            {summaryLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-pulse">
                <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-emerald-600 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929L18.5 8L17.929 4.929L15 4.357L17.929 3.786L18.5 0.714L19.071 3.786L22 4.357L19.071 4.929Z" />
                  </svg>
                </div>
                <p style={textDarkStyle} className="text-sm font-semibold animate-pulse font-sans">
                  Generating your case summary...
                </p>
                <div className="w-48 h-1.5 bg-neutral-100 rounded-full mt-4 overflow-hidden relative">
                  <div className="h-full bg-[#22c55e] rounded-full animate-loading-bar absolute top-0 left-0 w-24"></div>
                </div>
              </div>
            ) : summaryError ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm font-semibold text-red-600 font-sans">{summaryError}</p>
                <button
                  onClick={() => handleGenerateSummary(true)}
                  className="mt-4 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full py-2.5 px-6 shadow-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : summaryData ? (
              <div className="space-y-6">
                {[
                  { title: 'Case Overview', emoji: '📄', content: summaryData.caseOverview },
                  { title: 'Current Status', emoji: '⚖️', content: summaryData.currentStatus },
                  { title: 'Next Hearing', emoji: '📅', content: summaryData.nextHearing },
                  { title: 'What This Means', emoji: '💡', content: summaryData.whatThisMeans },
                  { title: 'Recommended Next Steps', emoji: '✅', content: summaryData.recommendedNextSteps },
                ].map((section, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 text-xl w-6 h-6 flex items-center justify-center bg-neutral-50 rounded-lg">
                      {section.emoji}
                    </div>
                    <div>
                      <h3 style={headingStyle} className="font-serif text-sm sm:text-base font-bold leading-tight">
                        {section.title}
                      </h3>
                      <p style={textMutedStyle} className="text-sm mt-1 leading-relaxed font-sans">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={handleCopySummary}
                    className="text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.4m1.5-.45h2.25m3.3 0h5.025c.621 0 1.125.504 1.125 1.125V17.25c0 .621-.504 1.125-1.125 1.125H9.75M8.25 21h8.25" />
                        </svg>
                        Copy Summary
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    Collapse
                  </button>
                </div>

                {/* AI Disclaimer Box */}
                <div 
                  className="mt-6 p-4 rounded-xl border flex gap-3 text-[13px] sm:text-[14px] leading-relaxed text-[#78350f] bg-[#FFFBEB] border-[#FCD34D]"
                >
                  <svg className="w-5 h-5 flex-shrink-0 text-[#d97706] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div>
                    <strong className="font-bold block mb-0.5">AI Disclaimer</strong>
                    <span>
                      This summary is generated using AI to help you understand your case in simple language. It may not include every legal detail, so please check the official court records to confirm important information. We do not provide legal advice, and this summary should not be treated as legal advice.
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* 7. INTERIM ORDERS SECTION */}
        {displayOrders.length > 0 && (
        <section 
          style={cardStyle}
          className="space-y-4 scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span 
                style={textMutedStyle}
                className="text-xs font-semibold uppercase tracking-wider font-sans block mb-1"
              >
                LEGAL DOCUMENTS
              </span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h2 
                  style={headingStyle}
                  className="font-serif text-xl sm:text-2xl"
                >
                  Interim Orders
                </h2>
              </div>
            </div>

            {/* Action Button: Print Case Details */}
            <button
              onClick={handlePrint}
              className="bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full py-3 px-6 shadow-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.615 0-1.113-.485-1.12-1.1L6.34 18m11.318-3.662a4 4 0 11-7.75 0m7.75 0a1.866 1.866 0 00-1.866-1.866H6.797a1.867 1.867 0 00-1.867 1.866" />
              </svg>
              Print Case Details
            </button>
          </div>

          {/* Interim Orders 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayOrders.map((order) => (
              <div
                key={order.order_no}
                className="bg-[#FAF9F5] border border-[#E9E7DF] rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-md hover:border-[#DFDDD5] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span style={textMutedStyle} className="text-[10px] font-mono font-bold mt-1">
                    #{order.order_no}.
                  </span>
                  <div>
                    <h3 style={textDarkStyle} className="text-sm font-bold leading-tight">
                      {order.title}
                    </h3>
                    <p style={textMutedStyle} className="text-[11px] mt-1 font-medium font-sans">
                      Date: {order.date}
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(order)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#22c55e] hover:text-emerald-700 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    {copiedOrderId === order.order_no ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.4m1.5-.45h2.25m3.3 0h5.025c.621 0 1.125.504 1.125 1.125V17.25c0 .621-.504 1.125-1.125 1.125H9.75M8.25 21h8.25" />
                    )}
                  </svg>
                  {copiedOrderId === order.order_no ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </section>
        )}

      </div>
    </div>
  );
};

export default CaseDetails;
