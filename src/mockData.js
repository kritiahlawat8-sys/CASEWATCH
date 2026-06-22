// TEMPORARY MOCK DATA - replace with real API calls later

export const mockUser = {
  name: "Alexander Wright",
  email: "alexander.wright@casewatch.in",
  role: "Lead Counsel",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120",
  createdAt: "2024-01-15T00:00:00.000Z"
};

export const mockCases = [
  {
    id: 1,
    nickname: "Property Dispute with Neighbor",
    title: "Sharma vs. Verma (Land encroachment dispute)",
    cnrNumber: "MHCB02-004829-2025",
    caseType: "Property",
    status: "Active",
    courtName: "Delhi High Court",
    nextHearingDate: "2026-06-23", // Urgent (within 7 days of June 17, 2026)
    lastUpdate: "Written arguments submitted. Awaiting next bench listing.",
    opposingCounsel: "R. K. Mehra, Esq.",
    location: "Courtroom 12, Delhi High Court",
    description: "Dispute concerning the encroachment of 150 sq. yards of common residential pathway through the unauthorized construction of a temporary fencing wall.",
    timeline: [
      { date: "10 May 2026", event: "Written arguments filed by Petitioner", type: "document" },
      { date: "15 Apr 2026", event: "Interim stay on further construction granted by Bench", type: "hearing" },
      { date: "02 Mar 2026", event: "Case registered and formal notice issued", type: "system" }
    ],
    documents: [
      { name: "Property Title Deed", status: "uploaded" },
      { name: "Boundary Survey Map", status: "uploaded" },
      { name: "Opposing Written Statement", status: "missing" },
      { name: "Photographs of Encroachment", status: "uploaded" }
    ]
  },
  {
    id: 2,
    nickname: "Antitrust Litigation",
    title: "Sterling vs. Global Dynamics Inc.",
    cnrNumber: "MHCB01-008924-2024",
    caseType: "Corporate",
    status: "Active",
    courtName: "Supreme Court of India",
    nextHearingDate: "2026-06-20", // Urgent (within 3 days)
    lastUpdate: "Preliminary injunction hearing listed. Final briefs must be submitted.",
    opposingCounsel: "Marcus Vane, Esq.",
    location: "Courtroom 4B, 5th Circuit",
    description: "Antitrust action seeking relief from monopolistic distribution practices in forensic software licensing and regional market manipulation.",
    timeline: [
      { date: "12 Jun 2026", event: "Opposition supplemental reply filed regarding jurisdiction", type: "document" },
      { date: "24 May 2026", event: "Interlocutory petition on discovery boundaries approved", type: "hearing" },
      { date: "10 Apr 2026", event: "Antitrust lawsuit filed at register registry", type: "system" }
    ],
    documents: [
      { name: "Antitrust Statement of Claim", status: "uploaded" },
      { name: "Forensic Audit Exhibits", status: "uploaded" },
      { name: "Expert Witness Affidavit", status: "missing" }
    ]
  },
  {
    id: 3,
    nickname: "Anticipatory Bail Application",
    title: "State of Maharashtra vs. A. K. Sen",
    cnrNumber: "MHCB05-001290-2026",
    caseType: "Criminal",
    status: "Active",
    courtName: "Bombay High Court",
    nextHearingDate: "2026-06-25",
    lastUpdate: "Anticipatory bail petition filed. Awaiting reply from Prosecution.",
    opposingCounsel: "State Prosecutor Patil",
    location: "Courtroom 9, Bombay High Court",
    description: "Application for anticipatory bail under Section 438 CrPC regarding alleged bank loan irregularities and forensic audits.",
    timeline: [
      { date: "10 Jun 2026", event: "Bail petition filed in Bombay High Court", type: "system" },
      { date: "28 May 2026", event: "Bail rejected in Sessions Court due to severity arguments", type: "hearing" }
    ],
    documents: [
      { name: "Bail Petition (S.438)", status: "uploaded" },
      { name: "Sessions Court Rejection Copy", status: "uploaded" },
      { name: "Irregularity Audit Report", status: "missing" }
    ]
  },
  {
    id: 4,
    nickname: "Child Custody Dispute",
    title: "Rohan Kapoor vs. Priya Kapoor",
    cnrNumber: "MHCB03-009182-2025",
    caseType: "Family",
    status: "Adjourned",
    courtName: "Patiala House Family Court",
    nextHearingDate: "2026-07-15",
    lastUpdate: "Adjourned to July 15 — counsel requested time for visitation proposal.",
    opposingCounsel: "S. K. Malhotra, Esq.",
    location: "Chamber 2, Family Court 3",
    description: "Petition for custody of 8-year-old child following divorce settlement.",
    timeline: [
      { date: "01 Jun 2026", event: "Mediation report submitted (unresolved)", type: "document" },
      { date: "20 Apr 2026", event: "Interim visitation schedule ordered", type: "hearing" }
    ],
    documents: [
      { name: "Custody Petition", status: "uploaded" },
      { name: "Income Affidavits", status: "uploaded" },
      { name: "Proposed Visitation Agreement", status: "missing" }
    ]
  },
  {
    id: 5,
    nickname: "Consumer Faulty Product Claims",
    title: "Gupta vs. Zenith Tech Ltd.",
    cnrNumber: "MHCB04-006718-2025",
    caseType: "Consumer",
    status: "Disposed",
    courtName: "State Consumer Disputes Forum",
    nextHearingDate: null,
    lastUpdate: "Case disposed. Final award of ₹50,000 compensation decreed in favor of consumer.",
    opposingCounsel: "A. C. Chawla, Esq.",
    location: "Main Bench, Consumer Court",
    description: "Defective laptop motherboards and subsequent denial of service support during warranty period.",
    timeline: [
      { date: "18 May 2026", event: "Final decree and award announced", type: "hearing" },
      { date: "12 Apr 2026", event: "Expert witness product evaluation report filed", type: "document" }
    ],
    documents: [
      { name: "Purchase Invoice", status: "uploaded" },
      { name: "Service Center Reports", status: "uploaded" },
      { name: "ZENITH Defect Admissibility Report", status: "uploaded" }
    ]
  },
  {
    id: 6,
    nickname: "Road Tender RTI Appeal",
    title: "Adv. Joshi vs. Public Information Officer",
    cnrNumber: "MHCB06-003418-2025",
    caseType: "RTI",
    status: "Adjourned",
    courtName: "Central Information Commission",
    nextHearingDate: "2026-07-28",
    lastUpdate: "Adjourned — PIO directed to submit road project compliance certificate.",
    opposingCounsel: "PIO Legal Counsel",
    location: "CIC Hearing Hall 2",
    description: "Second appeal seeking information on tender allocation of municipal road projects under Section 19 of the RTI Act.",
    timeline: [
      { date: "05 Jun 2026", event: "Second appeal hearing held", type: "hearing" },
      { date: "30 Apr 2026", event: "PIO reply submitted", type: "document" }
    ],
    documents: [
      { name: "RTI Application (Original)", status: "uploaded" },
      { name: "First Appeal Rejection", status: "uploaded" },
      { name: "Road Project Tender Copy", status: "missing" }
    ]
  }
];

export const mockCalendarEvents = [
  {
    day: 1,
    type: 'court',
    title: 'DEPOSITION: S. MILLER',
    color: 'blue',
    details: {
      caseName: "Miller Trust vs. State Registrar",
      caseNumber: "MHCB01-002341-2024",
      courtName: "Bombay High Court",
      judgeName: "Hon'ble Mr. Justice R. D. Dhanuka",
      hearingDate: "October 1, 2024",
      hearingTime: "10:30 AM",
      courtroom: "Chamber 4",
      status: "Active",
      caseStage: "Evidence Stage",
      priorityLevel: "Medium",
      timelineStage: "Evidence Stage",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: false }
      ],
      notes: {
        lawyerNotes: "Review Miller trust deeds and secondary execution protocols.",
        personalNotes: "Check if the notary has stamped all pages of the witness affidavit.",
        previousSummary: "The respondent admitted the existence of the trust deed but challenged its execution date."
      }
    }
  },
  {
    day: 3,
    type: 'deadline',
    title: 'DISCOVERY DEADLINE',
    color: 'red',
    details: {
      caseName: "Sharma vs. Verma (Land encroachment dispute)",
      caseNumber: "MHCB02-004829-2025",
      courtName: "Delhi High Court",
      judgeName: "Hon'ble Ms. Justice Rekha Palli",
      hearingDate: "October 3, 2024",
      hearingTime: "04:00 PM (Filing)",
      courtroom: "Registry Counter 3",
      status: "Active",
      caseStage: "Evidence Stage",
      priorityLevel: "High",
      timelineStage: "Notice Issued",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: false },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Ensure all boundary survey photos are compiled and indexed.",
        personalNotes: "Print three physical copies for local registry submission.",
        previousSummary: "Filing extensions were denied in the last session. Absolute deadline."
      }
    }
  },
  {
    day: 7,
    type: 'hearing',
    title: 'PRE-TRIAL CONF',
    color: 'yellow',
    details: {
      caseName: "Rohan Kapoor vs. Priya Kapoor",
      caseNumber: "MHCB03-009182-2025",
      courtName: "Patiala House Family Court",
      judgeName: "Judge Shalini Phansalkar",
      hearingDate: "October 7, 2024",
      hearingTime: "11:00 AM",
      courtroom: "Chamber 2, Family Court 3",
      status: "Active",
      caseStage: "First Hearing",
      priorityLevel: "Medium",
      timelineStage: "First Hearing",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: false },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Focus on visitation schedule and child welfare guidelines.",
        personalNotes: "Check with mediation center if they sent the report.",
        previousSummary: "Interlocutory application for visitation was filed by the petitioner."
      }
    }
  },
  {
    day: 10,
    type: 'court',
    title: 'JUDICIAL REVIEW',
    color: 'blue',
    details: {
      caseName: "Adv. Joshi vs. Public Information Officer",
      caseNumber: "MHCB06-003418-2025",
      courtName: "Central Information Commission",
      judgeName: "Chief IC Y. K. Sinha",
      hearingDate: "October 10, 2024",
      hearingTime: "02:30 PM",
      courtroom: "Hearing Hall 2",
      status: "Adjourned",
      caseStage: "Arguments",
      priorityLevel: "Low",
      timelineStage: "Arguments",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Review PIO's exemption arguments under Section 8(1)(d).",
        personalNotes: "Prepare notes on public interest override arguments.",
        previousSummary: "The Commission directed the PIO to file an affidavit explaining the non-disclosure."
      }
    }
  },
  {
    day: 16,
    type: 'deadline',
    title: 'FINAL FILING',
    color: 'red',
    details: {
      caseName: "State of Maharashtra vs. A. K. Sen",
      caseNumber: "MHCB05-001290-2026",
      courtName: "Bombay High Court",
      judgeName: "Hon'ble Mr. Justice G. S. Patel",
      hearingDate: "October 16, 2024",
      hearingTime: "04:30 PM",
      courtroom: "Registry Room 12",
      status: "Active",
      caseStage: "Evidence Stage",
      priorityLevel: "High",
      timelineStage: "Evidence Stage",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Prosecution reply must be meticulously answered point-by-point.",
        personalNotes: "Ask senior counsel to verify the draft section 438 arguments.",
        previousSummary: "The High Court granted ad-interim protection subject to cooperation with investigators."
      }
    }
  },
  {
    day: 18,
    type: 'hearing',
    title: 'EVIDENTIARY HEARING',
    color: 'yellow',
    details: {
      caseName: "Gupta vs. Zenith Tech Ltd.",
      caseNumber: "MHCB04-006718-2025",
      courtName: "State Consumer Disputes Forum",
      judgeName: "President Justice S. J. Vazifdar",
      hearingDate: "October 18, 2024",
      hearingTime: "12:00 PM",
      courtroom: "Bench 1",
      status: "Active",
      caseStage: "Evidence Stage",
      priorityLevel: "Medium",
      timelineStage: "Evidence Stage",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: false }
      ],
      notes: {
        lawyerNotes: "Mark and index the expert technical report on motherboard short-circuiting.",
        personalNotes: "Bring physical defective laptop motherboard in case judge wants physical inspection.",
        previousSummary: "Complainant was cross-examined; evidence of warranty terms was accepted."
      }
    }
  },
  {
    day: 22,
    type: 'court',
    title: 'WITNESS PREP',
    color: 'blue',
    details: {
      caseName: "Sterling vs. Global Dynamics Inc.",
      caseNumber: "MHCB01-008924-2024",
      courtName: "Supreme Court of India",
      judgeName: "Hon'ble Chief Justice of India",
      hearingDate: "October 22, 2024",
      hearingTime: "03:00 PM",
      courtroom: "Courtroom 4B, 5th Circuit",
      status: "Active",
      caseStage: "Arguments",
      priorityLevel: "High",
      timelineStage: "Arguments",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Prep Sterling's VP on antitrust software distribution policies.",
        personalNotes: "Check list of potential cross-examination questions from opposing counsel.",
        previousSummary: "The Supreme Court scheduled the final hearing on preliminary injunction."
      }
    }
  },
  {
    day: 24,
    type: 'hearing',
    title: 'SUMMARY JUDGMENT',
    color: 'yellow',
    priority: true,
    details: {
      caseName: "Lex v. Titan Corp",
      caseNumber: "#2024-CIV-8842",
      courtName: "District Court of California",
      judgeName: "Judge Sarah Thompson",
      hearingDate: "October 24, 2024",
      hearingTime: "09:00 AM - 11:30 AM",
      courtroom: "Courtroom 4B",
      status: "Active",
      caseStage: "Judgment",
      priorityLevel: "Urgent",
      timelineStage: "Arguments",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: false }
      ],
      notes: {
        lawyerNotes: "Finalize motion Exhibit A. Witness prep calls completed.",
        personalNotes: "Review opposition's last brief carefully before arguments.",
        previousSummary: "Parties completed argument submissions. The judge listed this summary judgment hearing."
      }
    }
  },
  {
    day: 25,
    type: 'deadline',
    title: 'POST-HEARING BRIEF',
    color: 'red',
    details: {
      caseName: "Lex v. Titan Corp",
      caseNumber: "#2024-CIV-8842",
      courtName: "District Court of California",
      judgeName: "Judge Sarah Thompson",
      hearingDate: "October 25, 2024",
      hearingTime: "05:00 PM",
      courtroom: "Registry Desk B",
      status: "Active",
      caseStage: "Judgment",
      priorityLevel: "High",
      timelineStage: "Judgment",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Incorporate points raised during the Summary Judgment hearing.",
        personalNotes: "Verify client has signed the declaration section.",
        previousSummary: "Oral arguments completed on Oct 24; liberty granted to file post-hearing briefs."
      }
    }
  },
  {
    day: 29,
    type: 'hearing',
    title: 'ARRAIGNMENT POOL',
    color: 'yellow',
    details: {
      caseName: "State of Maharashtra vs. A. K. Sen",
      caseNumber: "MHCB05-001290-2026",
      courtName: "Bombay High Court",
      judgeName: "Hon'ble Mr. Justice G. S. Patel",
      hearingDate: "October 29, 2024",
      hearingTime: "10:00 AM",
      courtroom: "Courtroom 9, Bombay High Court",
      status: "Active",
      caseStage: "Notice Issued",
      priorityLevel: "High",
      timelineStage: "Notice Issued",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: false },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: true }
      ],
      notes: {
        lawyerNotes: "Client must be present in person for arraignment.",
        personalNotes: "Bring physical identification card and bail bond papers.",
        previousSummary: "Bail petition replies were compiled and filed."
      }
    }
  },
  {
    day: 31,
    type: 'court',
    title: 'CHAMBERS MEETING',
    color: 'blue',
    details: {
      caseName: "Rohan Kapoor vs. Priya Kapoor",
      caseNumber: "MHCB03-009182-2025",
      courtName: "Patiala House Family Court",
      judgeName: "Judge Shalini Phansalkar",
      hearingDate: "October 31, 2024",
      hearingTime: "04:00 PM",
      courtroom: "Chambers Room 2",
      status: "Adjourned",
      caseStage: "Arguments",
      priorityLevel: "Low",
      timelineStage: "Arguments",
      documents: [
        { label: "Affidavit", checked: true },
        { label: "Evidence Documents", checked: true },
        { label: "Identity Proof", checked: true },
        { label: "Court Notice", checked: false }
      ],
      notes: {
        lawyerNotes: "Discuss settlement framework behind closed doors.",
        personalNotes: "Check if the opposing party is open to mediation terms.",
        previousSummary: "Both parties agreed to sit for chamber discussion on visitation rights."
      }
    }
  }
];

export const mockDocModules = [
  { id: 'property', title: 'Property', desc: 'Deeds, Leases, Registration', icon: 'Home' },
  { id: 'family', title: 'Family', desc: 'Divorce, Custody, Estates', icon: 'Heart' },
  { id: 'consumer', title: 'Consumer', desc: 'Product Liability, Services', icon: 'ShoppingBag' },
  { id: 'criminal', title: 'Criminal', desc: 'Defense, Evidence, Appeals', icon: 'ShieldAlert' },
  { id: 'rti', title: 'RTI', desc: 'Right to Information Filings', icon: 'Info' },
  { id: 'bail', title: 'Bail', desc: 'Anticipatory, Regular, Interim', icon: 'Unlock', priority: true, updated: '2H AGO' },
  { id: 'employment', title: 'Employment', desc: 'Contracts, Disputes, Pensions', icon: 'Briefcase' }
];

export const mockDocDetail = {
  id: 'bail',
  purpose: "The primary purpose of bail is to ensure the presence of the accused at trial while honoring the principle of 'presumption of innocence.' It acts as a release from custody by the court's authority upon providing security that the person shall attend at a stated time and place.",
  objectives: [
    "To prevent unnecessary incarceration of a person who has not yet been convicted.",
    "To enable the accused to prepare an effective legal defense without confinement constraints.",
    "To maintain the individual's socio-economic ties to the community pending trial."
  ],
  templates: [
    { name: "Regular Bail Application", type: "PDF", size: "4.2 MB", desc: "Updated May 2024" },
    { name: "Anticipatory Bail (S.438)", type: "DOCX", size: "1.8 MB", desc: "High Success Rate" },
    { name: "Interim Bail Petition", type: "PDF", size: "2.1 MB", desc: "Temporary Relief" }
  ]
};
