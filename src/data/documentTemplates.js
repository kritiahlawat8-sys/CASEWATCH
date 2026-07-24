export const documentTemplates = [
  {
    id: "adjournment-slip",
    name: "Adjournment Slip",
    fileName: "Adjournment slip.docx",
    caseTypes: ["Civil", "Criminal", "Family"],
    description: "Standard request to reschedule a court hearing to a later date."
  },
  {
    id: "affidavit-facts-sc",
    name: "Affidavit of Facts (Supreme Court)",
    fileName: "Affidavit of Facts — Supreme Court.docx",
    caseTypes: ["Civil", "Criminal"],
    description: "Sworn statement of facts filed in support of a petition in the Supreme Court of India."
  },
  {
    id: "anticipatory-bail-renewal",
    name: "Anticipatory Bail Application Renewal",
    fileName: "Anticipatory bail application renewal.docx",
    caseTypes: ["Criminal"],
    description: "Application to renew or extend bail protection against arrest in anticipation of custody."
  },
  {
    id: "certified-copy-app",
    name: "Application for Certified Copy",
    fileName: "Application for Certified Copy.docx",
    caseTypes: ["Civil", "Criminal", "Family"],
    description: "Request to obtain official certified copies of court judgments, orders, or records."
  },
  {
    id: "inspection-records-app",
    name: "Application for Inspection of Case Records",
    fileName: "Application for Inspection of Case Records.docx",
    caseTypes: ["Civil", "Criminal", "Family"],
    description: "Formal petition to inspect the official court files and records of a case."
  },
  {
    id: "bail-bond-surety",
    name: "Bail Bond & Surety Affidavit",
    fileName: "Bail Bond & Surety Affidavit.docx",
    caseTypes: ["Criminal"],
    description: "Undertaking by a surety for the release of an accused from custody."
  },
  {
    id: "caveat",
    name: "Caveat Petition",
    fileName: "CAVEAT.docx",
    caseTypes: ["Civil", "Property"],
    description: "Preemptive notice to ensure no ex-parte orders are passed without notifying you."
  },
  {
    id: "docs-list-civil",
    name: "List of Documents (Civil Suit)",
    fileName: "List of Documents — Civil Suit.docx",
    caseTypes: ["Civil", "Property"],
    description: "Structured index and list of documents filed along with a civil suit."
  },
  {
    id: "memo-appearance",
    name: "Memo of Appearance (Advocate)",
    fileName: "Memo of Appearance — Advocate.docx",
    caseTypes: ["Civil", "Criminal", "Family"],
    description: "Interim authorization filed by an advocate prior to submitting a formal Vakalatnama."
  },
  {
    id: "personal-bail-bond",
    name: "Personal Bail Bond (After Acquittal)",
    fileName: "Personal Bail Bond — After Acquittal (S.437-A).docx",
    caseTypes: ["Criminal"],
    description: "Personal bond filed by an acquitted accused to ensure appearance if an appeal is filed."
  },
  {
    id: "process-fee-form",
    name: "Process Fee Form",
    fileName: "Process Fee Form.docx",
    caseTypes: ["Civil", "Criminal"],
    description: "Form submitted with fees to summon witnesses or issue court notices."
  },
  {
    id: "separation-agreement",
    name: "Separation Agreement (Husband & Wife)",
    fileName: "Separation Agreement — Husband & Wife (Non-Judicial).docx.docx",
    caseTypes: ["Family"],
    description: "Mutual separation and maintenance agreement drafted outside court."
  },
  {
    id: "vakalatnama-template",
    name: "Vakalatnama Template",
    fileName: "Vakalatnama_template.docx",
    caseTypes: ["Civil", "Criminal", "Family"],
    description: "Power of attorney authorizing an advocate to represent a client in court."
  }
];

export const CANONICAL_CASE_TYPES = ["Civil", "Criminal", "Family", "Property"];
