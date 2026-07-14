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
    <div className="bg-[#EDEBE4] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-12 font-sans antialiased">
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
                  <span className="text-sm font-bold text-[#22c55e]">{caseData.next_hearing}</span>
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
