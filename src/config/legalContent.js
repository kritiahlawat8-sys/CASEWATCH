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
      <li><strong>Case data:</strong> CNR numbers, case status, hearing dates (sourced from public eCourts/NJDG records)</li>
      <li><strong>Usage data:</strong> device/browser info, app interaction logs</li>
    </ul>`
  },
  {
    id: 'how-we-use-your-information',
    title: '3. How We Use Your Information',
    content: `We use CNR/case data to display case tracking information and generate AI-powered case summaries, and use usage data to improve the platform.`
  },
  {
    id: 'third-party-sharing',
    title: '4. Third-Party Sharing',
    content: `We share data with specific categories of third parties:
    <ul>
      <li><strong>eCourts/NJDG:</strong> public case data lookup</li>
      <li><strong>Analytics providers:</strong> to understand platform usage</li>
    </ul>
    CaseWatch does NOT sell user data to advertisers or unrelated third parties.`
  },
  {
    id: 'data-storage-security',
    title: '5. Data Storage & Security',
    content: `We implement reasonable security practices, including encryption in transit, to protect data processed by the platform.`
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
    content: `Questions about this policy? Reach us via the <a href="https://github.com/kritiahlawat8-sys/CASEWATCH.git" target="_blank" rel="noopener noreferrer">CaseWatch GitHub repository</a>.`
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
    content: `CaseWatch is an informational and organizational tool: case tracking via public CNR data, AI-generated case summaries, and a Gov Links section providing links to official government and legal aid websites.`
  },
  {
    id: 'not-a-law-firm',
    title: '3. Not a Law Firm',
    content: `CaseWatch is a technology platform, not a law firm. It does not provide legal advice, does not represent users in court, and does not guarantee outcomes. No attorney-client relationship is formed by using the platform.`
  },
  {
    id: 'user-responsibilities',
    title: '4. User Responsibilities',
    content: `Users must provide accurate CNR/case information and must not use the platform to harass, defraud, or impersonate others.`
  },
  {
    id: 'ai-summary-limitations',
    title: '5. AI Case Summary — Limitations',
    content: `AI-generated summaries are for general understanding only, may contain errors, and must not be relied upon as a substitute for professional legal advice.`
  },
  {
    id: 'pro-bono-disclaimer',
    title: '6. Government & Legal Aid Links — Third-Party Disclaimer',
    content: `The Gov Links section provides links to official third-party government and legal aid websites for user convenience. CaseWatch does not vet, endorse, or take responsibility for the services, advice, conduct, fees, or outcomes of these third parties, and using them does not create any relationship — attorney-client or otherwise — with CaseWatch.`
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
    id: 'limitation-of-liability',
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by law, CaseWatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages.`
  },
  {
    id: 'governing-law',
    title: '10. Governing Law & Dispute Resolution',
    content: `These terms are governed by the laws of ${CONSTANTS.GOVERNING_LAW_JURISDICTION_PLACEHOLDER}. Any disputes shall be subject to the exclusive jurisdiction of the courts in ${CONSTANTS.JURISDICTION_PLACEHOLDER}.`
  },
  {
    id: 'changes-to-terms',
    title: '11. Changes to Terms',
    content: `We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.`
  },
  {
    id: 'Platform Status & Government Affiliation',
    title: '12. Platform Status & Government Affiliation',
    content: `CaseWatch is a personal prototype built by working developers as part of an academic and internship project.It is not approved, authorized, or endorsed by the Government of India, the Indian Judiciary, or any government body.Any emblems, logos, or visual elements resembling official government or judicial insignia used on this platform are local design implementations created for representational purposes only, and have not been officially provided or sanctioned by any government authority.`
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
    content: `Nothing on this platform — including AI generated summary, FAQ answers, or document templates — constitutes legal advice. Users should consult a qualified, licensed advocate for advice specific to their situation.`
  },
  {
    id: 'no-attorney-client',
    title: '3. No Attorney-Client Relationship',
    content: `Using CaseWatch, including the Gov Links section, does not create an attorney-client relationship between the user and CaseWatch. Any such relationship, if formed, exists solely between the user and the independent lawyer/NGO they choose to engage.`
  },
  {
    id: 'accuracy-of-case-data',
    title: '4. Accuracy of Case Data',
    content: `Case tracking data is pulled from publicly available court records. Court systems may have delays, errors, or downtime. CaseWatch is not responsible for missed hearings or deadlines resulting from inaccurate or delayed source data — always cross-verify with official court notices.`
  },
  {
    id: 'ai-summary-limitations',
    title: '5. AI Summary Limitations',
    content: `AI-generated case summaries are for general comprehension only and may not capture full legal nuance. Do not rely solely on AI output for decisions with legal consequences.`
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
