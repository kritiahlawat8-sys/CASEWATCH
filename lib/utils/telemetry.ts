export interface RegistryTelemetryItem {
  id: string;
  timestamp: string;
  registry: string;
  crn: string;
  caseType: string;
  status: 'SCANNING' | 'PARSED' | 'INDEXED' | 'WARNING' | 'ERROR';
  speedMs: number;
  court: string;
}

export interface CaseDetails {
  crn: string;
  title: string;
  petitioner: string;
  respondent: string;
  judge: string;
  court: string;
  status: string;
  nextHearing: string;
  filedDate: string;
  documents: { name: string; size: string; status: string }[];
  hash: string;
}

export interface HaryanaWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  fields: { name: string; label: string; type: string; placeholder: string; required: boolean }[];
  baseDraft: string;
}

// All-India court registries list
export const REGISTRIES = [
  { code: 'SC', name: 'Supreme Court of India', state: 'Delhi' },
  { code: 'MH', name: 'Bombay High Court', state: 'Maharashtra' },
  { code: 'DL', name: 'Delhi High Court', state: 'Delhi' },
  { code: 'KA', name: 'Karnataka High Court', state: 'Karnataka' },
  { code: 'HR', name: 'Punjab & Haryana High Court', state: 'Haryana' },
  { code: 'WB', name: 'Calcutta High Court', state: 'West Bengal' },
  { code: 'TN', name: 'Madras High Court', state: 'Tamil Nadu' },
  { code: 'UP', name: 'Allahabad High Court', state: 'Uttar Pradesh' },
  { code: 'GJ', name: 'Gujarat High Court', state: 'Gujarat' },
];

const CASE_TYPES = [
  'Writ Petition (Civil)',
  'Special Leave Petition (Criminal)',
  'Civil Appeal',
  'Original Suit',
  'Interlocutory Application',
  'Contempt Petition',
  'Review Petition',
  'Bail Application',
];

const STATUSES: RegistryTelemetryItem['status'][] = ['SCANNING', 'PARSED', 'INDEXED', 'WARNING'];

// Generate randomized telemetry item
export function generateTelemetryItem(): RegistryTelemetryItem {
  const registry = REGISTRIES[Math.floor(Math.random() * REGISTRIES.length)];
  const randomId = Math.floor(100000 + Math.random() * 900000);
  const crn = `CRN-${registry.code}-${randomId}`;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    registry: registry.name,
    crn,
    caseType: CASE_TYPES[Math.floor(Math.random() * CASE_TYPES.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    speedMs: Math.floor(45 + Math.random() * 320),
    court: `${registry.state} Judicial Registry Office`,
  };
}

// Generate static case details database for search testing
export const MOCK_CASES_DB: Record<string, CaseDetails> = {
  'CRN-SC-100245': {
    crn: 'CRN-SC-100245',
    title: 'A.K. Sharma vs. Union of India',
    petitioner: 'A.K. Sharma & Associates',
    respondent: 'Union of India (Ministry of Finance)',
    judge: 'Hon\'ble Mr. Justice D.Y. Chandramukhi',
    court: 'Supreme Court of India, Court No. 1',
    status: 'Hearing Stage (Arguments Ongoing)',
    nextHearing: '2026-07-02',
    filedDate: '2025-11-12',
    documents: [
      { name: 'Original_Writ_Petition.pdf', size: '2.4 MB', status: 'Verified' },
      { name: 'Respondent_Counter_Affidavit.pdf', size: '4.1 MB', status: 'Verified' },
      { name: 'Rejoinder_Affidavit.pdf', size: '1.2 MB', status: 'Pending Verification' },
    ],
    hash: '0x8f2d91a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
  },
  'CRN-HR-204192': {
    crn: 'CRN-HR-204192',
    title: 'Baldev Singh vs. State of Haryana',
    petitioner: 'Baldev Singh (Represented by Senior Advocate H.S. Hooda)',
    respondent: 'State of Haryana (Department of Land Revenue)',
    judge: 'Hon\'ble Mrs. Justice Ritu Malhotra',
    court: 'Punjab & Haryana High Court, Court No. 4',
    status: 'Order Reserved',
    nextHearing: '2026-06-29 (Pronouncement of Order)',
    filedDate: '2026-02-18',
    documents: [
      { name: 'Land_Acquisition_Appeal_Suit.pdf', size: '8.7 MB', status: 'Verified' },
      { name: 'Collector_Rohtak_Report.pdf', size: '15.2 MB', status: 'Verified' },
      { name: 'Affidavit_of_Compensatory_Scheme.pdf', size: '940 KB', status: 'Verified' },
    ],
    hash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  'CRN-DL-450912': {
    crn: 'CRN-DL-450912',
    title: 'Metro Infrastructure Ltd. vs. Delhi Development Authority',
    petitioner: 'Metro Infrastructure Ltd.',
    respondent: 'Delhi Development Authority (DDA)',
    judge: 'Hon\'ble Mr. Justice Sanjay Kaul',
    court: 'Delhi High Court, Court No. 12',
    status: 'Interlocutory Stage',
    nextHearing: '2026-07-15',
    filedDate: '2026-04-05',
    documents: [
      { name: 'Arbitration_Invocation_Petition.pdf', size: '1.8 MB', status: 'Verified' },
      { name: 'DDA_Statement_of_Defense.pdf', size: '3.6 MB', status: 'Verified' },
    ],
    hash: '0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f',
  },
  'CRN-MH-889312': {
    crn: 'CRN-MH-889312',
    title: 'Reliance Communication Ventures vs. Maharashtra State Electricity Board',
    petitioner: 'Reliance Communication Ventures',
    respondent: 'Maharashtra State Electricity Board (MSEB)',
    judge: 'Hon\'ble Mr. Justice Nitin Deshmukh',
    court: 'Bombay High Court, Court No. 18',
    status: 'Notice Dispatched',
    nextHearing: '2026-07-22',
    filedDate: '2026-05-10',
    documents: [
      { name: 'Commercial_Suit_Petition.pdf', size: '12.1 MB', status: 'Verified' },
      { name: 'Notice_Acknowledgment.pdf', size: '304 KB', status: 'Verified' },
    ],
    hash: '0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
  }
};

// Parser / Search function
export function searchCRN(query: string): CaseDetails | null {
  const cleanQuery = query.trim().toUpperCase();
  if (MOCK_CASES_DB[cleanQuery]) {
    return MOCK_CASES_DB[cleanQuery];
  }
  
  // Create a dynamic result if format matches a valid CRN structure, just to give satisfying UX
  const crnRegex = /^CRN-([A-Z]{2})-([0-9]{6})$/;
  const match = cleanQuery.match(crnRegex);
  if (match) {
    const stateCode = match[1];
    const num = match[2];
    const registry = REGISTRIES.find(r => r.code === stateCode);
    const registryName = registry ? registry.name : `${stateCode} High Court`;
    
    return {
      crn: cleanQuery,
      title: `Petition of ${stateCode === 'HR' ? 'Haryana Real Estate' : 'National Infrastructure'} Association vs. State of ${registry ? registry.state : stateCode}`,
      petitioner: 'M/S Legal Advisory Group & Co.',
      respondent: `State of ${registry ? registry.state : stateCode} (Department of Urban Planning)`,
      judge: `Hon'ble Mr. Justice A. R. Subramanayan`,
      court: `${registryName}, Court No. 5`,
      status: 'Indexed (Awaiting Initial Registry Review)',
      nextHearing: '2026-08-10 (Admission Hearing)',
      filedDate: new Date().toISOString().split('T')[0],
      documents: [
        { name: 'Digital_E-Filing_Draft.pdf', size: '1.2 MB', status: 'Verified' },
        { name: 'Annexures_Compiled.pdf', size: '14.5 MB', status: 'Verified' },
      ],
      hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
    };
  }
  
  return null;
}

// Localized Scope: Haryana legal templates & documentation workflow
export const HARYANA_TEMPLATES: HaryanaWorkflowTemplate[] = [
  {
    id: 'hr-affidavit',
    name: 'Haryana Standard Civil Affidavit',
    description: 'Required for e-filing civil actions in District Courts and High Court in Haryana.',
    fields: [
      { name: 'deponentName', label: 'Deponent Name', type: 'text', placeholder: 'Name of person swearing affidavit', required: true },
      { name: 'deponentAge', label: 'Deponent Age', type: 'number', placeholder: 'Years', required: true },
      { name: 'deponentFather', label: 'Father\'s / Husband\'s Name', type: 'text', placeholder: 'Full Name', required: true },
      { name: 'district', label: 'Haryana Filing District', type: 'select', placeholder: 'Select District (Gurugram, Faridabad, Rohtak, etc.)', required: true },
      { name: 'factsText', label: 'Declaration Facts', type: 'textarea', placeholder: 'Describe the facts to be sworn in numbered paragraphs', required: true },
    ],
    baseDraft: `IN THE COURT OF THE DISTRICT JUDGE, [DISTRICT], HARYANA
AFFIDAVIT

I, [DEPONENTNAME], aged [DEPONENTAGE] years, s/o / w/o Shri [DEPONENTFATHER], r/o Haryana, do hereby solemnly affirm and state on oath as under:

1. That the deponent is the petitioner in the accompanying civil suit/petition and is fully conversant with the facts of the case.
2. That the deponent solemnly declares:
[FACTSTEXT]
3. That the statements made in paragraphs 1 and 2 above are true to the best of deponent's knowledge, and nothing material has been concealed therefrom.

DEPONENT

VERIFICATION:
Verified at [DISTRICT], Haryana on this [DATE] day of [MONTH], [YEAR] that the contents of my above affidavit are true and correct.

DEPONENT`,
  },
  {
    id: 'hr-rent-petition',
    name: 'Haryana Urban Rent Act Petition',
    description: 'Eviction and rent control petition specialized under Haryana Urban Rent Control guidelines.',
    fields: [
      { name: 'landlordName', label: 'Landlord (Petitioner)', type: 'text', placeholder: 'Full Name', required: true },
      { name: 'tenantName', label: 'Tenant (Respondent)', type: 'text', placeholder: 'Full Name', required: true },
      { name: 'propertyAddress', label: 'Property Address (Haryana)', type: 'text', placeholder: 'e.g. Plot 404, Sector 15, Gurugram', required: true },
      { name: 'rentAmount', label: 'Monthly Rent (₹)', type: 'number', placeholder: 'e.g. 25000', required: true },
      { name: 'evictionGround', label: 'Ground for Eviction', type: 'select', placeholder: 'Non-payment, Bona-fide requirement, etc.', required: true },
    ],
    baseDraft: `BEFORE THE RENT CONTROLLER, HARYANA
PETITION UNDER SECTION 13 OF HARYANA URBAN (CONTROL OF RENT & EVICTION) ACT

In the matter of:
[LANDLORDNAME] ... Petitioner
Versus
[TENANTNAME] ... Respondent

May it please the Rent Controller:
1. The Petitioner is the owner/landlord of premises situated at [PROPERTYADDRESS] in the state of Haryana, let out to the Respondent at a monthly rent of Rs. [RENTAMOUNT].
2. The Respondent is in default and liable to eviction on the grounds of: [EVICTIONGROUND].
3. The premises are bona fide required by the Petitioner for personal occupation.
It is therefore prayed that an order of eviction be passed against the Respondent.

PETITIONER`,
  },
  {
    id: 'hr-vakalath',
    name: 'Punjab & Haryana HC Vakalatnama',
    description: 'Power of attorney authorization form specifically formatted for Chandigarh High Court filings.',
    fields: [
      { name: 'clientName', label: 'Client / Party Name', type: 'text', placeholder: 'Name of the party authorizing', required: true },
      { name: 'advocateName', label: 'Advocate Name & Bar ID', type: 'text', placeholder: 'e.g. Adv. Amit Sangwan (PH/2910/2021)', required: true },
      { name: 'caseTitle', label: 'Case Title Description', type: 'text', placeholder: 'e.g. State vs. John Doe', required: true },
      { name: 'courtPlace', label: 'Court Registry Branch', type: 'text', placeholder: 'Chandigarh / Gurugram / Panchkula', required: true },
    ],
    baseDraft: `IN THE HIGH COURT OF PUNJAB & HARYANA AT CHANDIGARH
VAKALATNAMA

In Case of: [CASETITLE]

I/We, [CLIENTNAME], do hereby appoint and authorize [ADVOCATENAME] to appear, plead, act and represent me/us in the aforesaid case in the Registry and Court at [COURTPLACE], and to sign appeals, affidavits, petitions, and compromises on my/our behalf.

Dated this [DATE] at [COURTPLACE].

Party Signature: _______________
Advocate Acceptance: _______________`,
  }
];

// Simulation states of filing workflow
export type FilingStep = 'INITIATING' | 'VALIDATING' | 'CALCULATING_STAMP' | 'PAYING_STAMP' | 'SIGNING' | 'SUBMITTING' | 'COMPLETED';

export function getFilingStepLabel(step: FilingStep): string {
  switch (step) {
    case 'INITIATING': return 'Initiating Haryana Filing Protocol...';
    case 'VALIDATING': return 'Validating input parameters against Haryana Court Manual Rules...';
    case 'CALCULATING_STAMP': return 'Calculating Ad-valorem Stamp Duty...';
    case 'PAYING_STAMP': return 'Processing Digital Stamp Payment (e-GRAS Haryana)...';
    case 'SIGNING': return 'Verifying Advocate Digital Signature (e-Sign)...';
    case 'SUBMITTING': return 'Uploading documents to Punjab & Haryana Court Server...';
    case 'COMPLETED': return 'Filing Successful! CRN generated.';
  }
}
