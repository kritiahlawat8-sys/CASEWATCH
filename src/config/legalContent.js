import * as CONSTANTS from './constants';

export const privacyPolicyContent = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `${CONSTANTS.COMPANY_NAME} ("CaseWatch", "we", "us") operates the CaseWatch platform. We are committed to protecting user data under the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable Indian IT laws.`
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    content: `<ul>
      <li><strong>Identity data:</strong> name, phone number, email</li>
      <li><strong>Case data:</strong> CNR numbers, case status, hearing dates (sourced from public eCourts/NJDG records)</li>
      <li><strong>Documents:</strong> files uploaded to the Document Vault</li>
      <li><strong>Communication data:</strong> SMS/WhatsApp opt-in number, notification preferences</li>
      <li><strong>Usage data:</strong> device/browser info, app interaction logs</li>
    </ul>`
  },
  {
    id: 'how-we-use-your-information',
    title: '3. How We Use Your Information',
    content: `We use your information to track cases and send hearing reminders, to power the AI Legal Translator, to connect users with pro-bono aid (only with explicit consent), to maintain and secure the Document Vault, and to improve the platform.`
  },
  {
    id: 'third-party-sharing',
    title: '4. Third-Party Sharing',
    content: `We share data with specific categories of third parties:
    <ul>
      <li><strong>eCourts/NJDG:</strong> public case data lookup</li>
      <li><strong>SMS/WhatsApp Business API providers:</strong> for reminders</li>
      <li><strong>Cloud storage providers:</strong> for document hosting</li>
      <li><strong>Pro-bono legal aid partners:</strong> only if user opts in to be connected</li>
    </ul>
    CaseWatch does NOT sell user data to advertisers or unrelated third parties.`
  },
  {
    id: 'data-storage-security',
    title: '5. Data Storage & Security',
    content: `We ensure encryption at rest and in transit for the Document Vault, implement strict access controls, and retain data for a period of ${CONSTANTS.RETENTION_PERIOD_PLACEHOLDER}.`
  },
  {
    id: 'your-rights',
    title: '6. Your Rights Under DPDP Act',
    content: `You have the right to access, correct, update, and erase personal data; the right to withdraw consent; and the right to grievance redressal (see our Grievance page). To exercise these rights, please contact us.`
  },
  {
    id: 'childrens-data',
    title: '7. Children\'s Data',
    content: `The platform is not intended for users under 18 without guardian involvement. We do not knowingly collect minors' data without consent.`
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking',
    content: `We use basic analytics and session cookies to provide and improve our services.`
  },
  {
    id: 'changes',
    title: '9. Changes to this Policy',
    content: `We will provide notice of any changes to this policy through our platform.`
  },
  {
    id: 'contact',
    title: '10. Contact Us',
    content: `Questions about this policy? Reach us via the <a href="https://github.com/" target="_blank" rel="noopener noreferrer">CaseWatch GitHub repository</a>.`
  }
];

export const termsOfUseContent = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By using CaseWatch, you are agreeing to these terms.`
  },
  {
    id: 'description-of-service',
    title: '2. Description of Service',
    content: `CaseWatch is an informational and organizational tool: case tracking via public CNR data, AI-assisted jargon simplification, document storage, court locator, and a directory connecting users to independent pro-bono legal aid providers.`
  },
  {
    id: 'not-a-law-firm',
    title: '3. Not a Law Firm',
    content: `CaseWatch is a technology platform, not a law firm. It does not provide legal advice, does not represent users in court, and does not guarantee outcomes. No attorney-client relationship is formed by using the platform.`
  },
  {
    id: 'user-responsibilities',
    title: '4. User Responsibilities',
    content: `Users must provide accurate CNR/case information, use the Document Vault only for lawful documents, do not use the platform to harass, defraud, or impersonate others, and maintain confidentiality of login credentials.`
  },
  {
    id: 'ai-translator-limitations',
    title: '5. AI Legal Translator — Limitations',
    content: `AI-generated simplifications are for general understanding only, may contain errors, and must not be relied upon as a substitute for professional legal advice.`
  },
  {
    id: 'pro-bono-disclaimer',
    title: '6. Pro-Bono Aid Finder — Third-Party Disclaimer',
    content: `Listed lawyers/NGOs are independent third parties; CaseWatch facilitates introduction only and is not liable for the advice, conduct, fees, or outcomes of any third-party legal aid provider.`
  },
  {
    id: 'case-data-accuracy',
    title: '7. Case Data Accuracy',
    content: `Case status data is sourced from public court records (eCourts/NJDG) and may be delayed, incomplete, or inaccurate due to source-system limitations; users should verify critical deadlines independently with official court sources.`
  },
  {
    id: 'intellectual-property',
    title: '8. Intellectual Property',
    content: `CaseWatch branding, design, and software are owned by ${CONSTANTS.COMPANY_NAME}; user-uploaded documents remain the property of the user.`
  },
  {
    id: 'account-suspension',
    title: '9. Account Suspension/Termination',
    content: `We reserve the right to suspend accounts for fraud, abuse, or fake CNR submissions.`
  },
  {
    id: 'limitation-of-liability',
    title: '10. Limitation of Liability',
    content: `To the maximum extent permitted by law, CaseWatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages.`
  },
  {
    id: 'governing-law',
    title: '11. Governing Law & Dispute Resolution',
    content: `These terms are governed by the laws of ${CONSTANTS.GOVERNING_LAW_JURISDICTION_PLACEHOLDER}. Any disputes shall be subject to the exclusive jurisdiction of the courts in ${CONSTANTS.JURISDICTION_PLACEHOLDER}.`
  },
  {
    id: 'changes-to-terms',
    title: '12. Changes to Terms',
    content: `We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.`
  }
];

export const disclaimerContent = [
  {
    id: 'general-disclaimer',
    title: '1. General Disclaimer',
    content: `CaseWatch is an independent technology platform and is NOT affiliated with, endorsed by, or officially connected to the Indian Judiciary, eCourts Project, National Judicial Data Grid (NJDG), or any Indian court or government body.`
  },
  {
    id: 'no-legal-advice',
    title: '2. No Legal Advice',
    content: `Nothing on this platform — including AI-translated content, FAQ answers, or document templates — constitutes legal advice. Users should consult a qualified, licensed advocate for advice specific to their situation.`
  },
  {
    id: 'no-attorney-client',
    title: '3. No Attorney-Client Relationship',
    content: `Using CaseWatch, including the Pro-Bono Aid Finder, does not create an attorney-client relationship between the user and CaseWatch. Any such relationship, if formed, exists solely between the user and the independent lawyer/NGO they choose to engage.`
  },
  {
    id: 'accuracy-of-case-data',
    title: '4. Accuracy of Case Data',
    content: `Case tracking data is pulled from publicly available court records. Court systems may have delays, errors, or downtime. CaseWatch is not responsible for missed hearings or deadlines resulting from inaccurate or delayed source data — always cross-verify with official court notices.`
  },
  {
    id: 'ai-translation-limitations',
    title: '5. AI Translation Limitations',
    content: `AI-generated simplifications of legal jargon are for general comprehension only and may not capture full legal nuance. Do not rely solely on AI output for decisions with legal consequences.`
  },
  {
    id: 'document-templates',
    title: '6. Document Templates',
    content: `Templates provided are generic starting points, not customized legal instruments; users should have documents reviewed by a qualified professional before use in legal proceedings.`
  },
  {
    id: 'third-party-links',
    title: '7. Third-Party Links',
    content: `Links to external sites (court websites, government portals) are provided for convenience; CaseWatch does not control or endorse their content.`
  },
  {
    id: 'fraud-prevention',
    title: '8. Fraud Prevention Notice',
    content: `CaseWatch helps flag signs of potential fraud but cannot guarantee detection of all fraudulent actors; users should remain vigilant and report suspicious activity via the Grievance page.`
  }
];

export const grievanceContent = [
  {
    id: 'purpose',
    title: '1. Purpose',
    content: `In compliance with the Digital Personal Data Protection Act, 2023 and applicable Indian IT Rules, CaseWatch has established a grievance redressal mechanism for users to raise concerns about data privacy, platform misuse, inaccurate information, or suspected fraud.`
  },
  {
    id: 'officer-details',
    title: '2. Grievance Officer Details',
    content: `<ul>
      <li><strong>Name:</strong> ${CONSTANTS.GRIEVANCE_OFFICER_NAME_PLACEHOLDER}</li>
      <li><strong>Designation:</strong> ${CONSTANTS.DESIGNATION_PLACEHOLDER}</li>
      <li><strong>Email:</strong> ${CONSTANTS.GRIEVANCE_EMAIL_PLACEHOLDER}</li>
      <li><strong>Address:</strong> ${CONSTANTS.REGISTERED_ADDRESS_PLACEHOLDER}</li>
      <li><strong>Phone:</strong> ${CONSTANTS.PHONE_PLACEHOLDER}</li>
    </ul>`
  },
  {
    id: 'what-you-can-report',
    title: '3. What You Can Report',
    content: `<ul>
      <li>Data privacy concerns (misuse, unauthorized access)</li>
      <li>Suspected fraud (fake lawyers, phishing attempts impersonating CaseWatch)</li>
      <li>Inaccurate case tracking data</li>
      <li>Issues with a pro-bono aid referral</li>
      <li>General platform complaints</li>
    </ul>`
  },
  {
    id: 'how-to-file',
    title: '4. How to File a Grievance',
    content: `Please submit your grievance via email to the Grievance Officer with your username, CNR (if relevant), a detailed description of the issue, and any supporting evidence/screenshots.`
  },
  {
    id: 'response-timeline',
    title: '5. Response Timeline',
    content: `We aim to acknowledge your grievance within ${CONSTANTS.X_DAYS_ACKNOWLEDGE_PLACEHOLDER} and resolve it within ${CONSTANTS.X_DAYS_RESOLUTION_PLACEHOLDER}.`
  },
  {
    id: 'escalation',
    title: '6. Escalation',
    content: `If unresolved, users may escalate to the Data Protection Board of India (once operational) or relevant consumer/IT grievance authority.`
  }
];
