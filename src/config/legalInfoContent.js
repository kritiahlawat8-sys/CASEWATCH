// TODO: Flag for Product Owner - Property/RERA and Labour need specific Gov Portals. Defaulting to e-Courts for now.
export const legalInfoContent = [
  {
    slug: 'property',
    title: 'Property Law in India: A Plain-Language Overview',
    whatItCovers: 'Disputes over ownership, possession, sale, inheritance, and use of land or buildings.',
    commonSituations: [
      'Boundary or land disputes with neighbors',
      'Builder delays or possession disputes in flat purchases',
      'Family disputes over inherited property',
      'Illegal occupation or encroachment',
      'Landlord-tenant disagreements',
      'Disputed property titles during resale'
    ],
    whereThisGoes: 'Most title and ownership disputes are handled in civil courts. Builder-buyer disputes are specifically handled by RERA (Real Estate Regulatory Authority).',
    govPortalCrossLink: {
      label: 'e-Courts',
      url: 'https://ecourts.gov.in/',
      subtitle: 'Check your case status, court orders, and cause lists directly from the official eCourts National Portal.',
      // TODO: Add a RERA link entry once one is designated.
    },
    tonePriority: false
  },
  {
    slug: 'criminal',
    title: 'Criminal Law in India: A Plain-Language Overview',
    whatItCovers: 'Offenses under the Indian Penal Code/Bharatiya Nyaya Sanhita and related criminal statutes — actions treated as crimes against individuals, property, or the state.',
    commonSituations: [
      'Theft or burglary',
      'Physical assault',
      'Cheating or fraud',
      'Domestic violence complaints',
      'Cybercrime (online fraud, harassment)',
      'FIR-related concerns (understanding what happens after filing an FIR)'
    ],
    whereThisGoes: 'Criminal cases move through police investigation, then proceed to Magistrate or Sessions courts depending on the severity of the offense.',
    govPortalCrossLink: {
      label: 'e-Courts',
      url: 'https://ecourts.gov.in/',
      subtitle: 'Check your case status, court orders, and cause lists directly from the official eCourts National Portal.'
    },
    tonePriority: true,
    reassuringText: 'If you are dealing with a criminal matter, you are not alone — here is a clear overview of how this area of law generally works.'
  },
  {
    slug: 'family',
    title: 'Family Law in India: A Plain-Language Overview',
    whatItCovers: 'Legal matters arising from marriage, divorce, child custody, maintenance, and adoption.',
    commonSituations: [
      'Divorce proceedings (mutual or contested)',
      'Child custody disputes',
      'Maintenance or alimony claims',
      'Domestic violence-related family court matters',
      'Adoption procedures',
      'Succession and inheritance within families'
    ],
    whereThisGoes: 'Family Courts (in cities that have them) or District Courts handle these matters.',
    govPortalCrossLink: {
      label: 'NALSA',
      url: 'https://nalsa.gov.in/',
      subtitle: "Find free legal aid and Lok Adalat information from India's apex legal services body."
    },
    tonePriority: true,
    reassuringText: 'If you are navigating a family law matter, you are not alone — here is a clear overview of how this area of law generally works.'
  },
  {
    slug: 'consumer',
    title: 'Consumer Law in India: A Plain-Language Overview',
    whatItCovers: 'Disputes between consumers and businesses over defective goods, poor services, unfair trade practices, or denied refunds.',
    commonSituations: [
      'Defective product not replaced or refunded',
      'E-commerce delivery or refund disputes',
      'Misleading advertising',
      'Deficient services (telecom, banking, insurance claim denial)',
      'Builder or real-estate consumer complaints',
      'Overcharging'
    ],
    whereThisGoes: 'These disputes are handled by the three-tier Consumer Commission system — District, State, and National (NCDRC) — based on the value of the claim.',
    govPortalCrossLink: {
      label: 'Consumer Disputes (NCDRC)',
      url: 'https://ncdrc.nic.in/',
      subtitle: 'File or track consumer disputes through India\'s apex consumer grievance commission. Note: Complaints are filed via the e-daakhil/e-jagriti portal.'
    },
    tonePriority: false
  },
  {
    slug: 'civil',
    title: 'Civil Law in India: A Plain-Language Overview',
    whatItCovers: 'Non-criminal disputes between individuals or organizations over rights, money, contracts, or obligations. Note: Many disputes — including property and family matters — are technically civil cases. This section covers civil matters not specifically listed elsewhere, such as contract and money-recovery disputes.',
    commonSituations: [
      'Breach of contract',
      'Recovery of money owed (loans, unpaid dues)',
      'Partnership or business disputes',
      'Defamation',
      'Disputes over agreements or services not covered elsewhere'
    ],
    whereThisGoes: 'Civil Courts (District Courts and above, depending on the claim value) handle these disputes.',
    govPortalCrossLink: {
      label: 'e-Courts',
      url: 'https://ecourts.gov.in/',
      subtitle: 'Check your case status, court orders, and cause lists directly from the official eCourts National Portal.'
    },
    tonePriority: false
  },
  {
    slug: 'labour',
    title: 'Labour Law in India: A Plain-Language Overview',
    whatItCovers: 'Disputes between employees/workers and employers over wages, termination, workplace conditions, or benefits.',
    commonSituations: [
      'Unpaid salary or wages',
      'Wrongful termination',
      'Denial of statutory benefits (PF, gratuity, ESI)',
      'Workplace harassment',
      'Contract worker or gig worker disputes',
      'Industrial disputes (in unionized settings)'
    ],
    whereThisGoes: 'Labour Courts, Industrial Tribunals, or the Labour Commissioner\'s office handle these matters depending on the specific dispute.',
    govPortalCrossLink: {
      label: 'e-Courts',
      url: 'https://ecourts.gov.in/',
      subtitle: 'Check your case status, court orders, and cause lists directly from the official eCourts National Portal.',
      // TODO: Add a Labour Commissioner/eShram portal link once one is designated.
    },
    tonePriority: false
  }
];
