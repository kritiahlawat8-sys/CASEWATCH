import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Scale, 
  Plus, 
  Search, 
  FileText, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  TrendingUp, 
  User, 
  MapPin, 
  Building2, 
  Filter, 
  FileDown, 
  X, 
  Briefcase, 
  Check, 
  Inbox, 
  Bell, 
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Globe
} from 'lucide-react';

// DUMMY DATA IN INDIAN LEGAL CONTEXT
const DUMMY_PROCESSES = [
  {
    id: 'birth-cert',
    name: 'Birth Certificate Application',
    caseNumber: 'BMC-MUM-2026-89412',
    category: 'Birth Certificate',
    status: 'Active', // Active, Completed, Delayed, Upcoming
    agency: 'Municipal Corporation of Greater Mumbai (MCGM)',
    location: 'K-East Ward, Andheri East, Mumbai',
    daysLeft: 9,
    progress: 60,
    milestones: [
      { title: 'Document Verification', date: '12 Jun 2026', desc: 'Notarized identity & residence proof verified by ward officer.', status: 'Completed' },
      { title: 'Application Submitted', date: '15 Jun 2026', desc: 'Form 1A submitted online with payment receipt ref #MCGM-9021.', status: 'Completed' },
      { title: 'Verification In Progress', date: '18 Jun 2026', desc: 'Area inspector physical registry check and local ward verification.', status: 'In Progress' },
      { title: 'Approval Stage', date: '25 Jun 2026', desc: 'Joint Registrar signature and database entry approval.', status: 'Upcoming' },
      { title: 'Certificate Issued', date: '30 Jun 2026', desc: 'Downloadable QR-enabled digital certificate generated on portal.', status: 'Upcoming' }
    ]
  },
  {
    id: 'prop-reg',
    name: 'Property Registration',
    caseNumber: 'DL-SUBREG-V-4921',
    category: 'Property Registration',
    status: 'Active',
    agency: 'Sub-Registrar Office V, Mehrauli',
    location: 'Mehrauli Revenue Court, New Delhi',
    daysLeft: 14,
    progress: 60,
    milestones: [
      { title: 'Stamp Duty Procurement', date: '10 Jun 2026', desc: 'E-stamp certificate of value ₹1,45,000 purchased and locked.', status: 'Completed' },
      { title: 'Sale Deed Drafting', date: '12 Jun 2026', desc: 'Advocate-approved sale deed text compiled and printed on ledger papers.', status: 'Completed' },
      { title: 'Biometric Appointment', date: '15 Jun 2026', desc: 'Slot booked at Sub-Registrar V for biometrics and witness statements.', status: 'Completed' },
      { title: 'Physical Attendance', date: '21 Jun 2026', desc: 'Execution before the Sub-Registrar with buyers, sellers, and witnesses.', status: 'In Progress' },
      { title: 'Title Registry Entry', date: '05 Jul 2026', desc: 'Final registration index entries and distribution of registered deeds.', status: 'Upcoming' }
    ]
  },
  {
    id: 'consumer-court',
    name: 'Consumer Court Complaint',
    caseNumber: 'NCDRC-CC-892-2026',
    category: 'Consumer Complaint',
    status: 'Delayed',
    agency: 'National Consumer Disputes Redressal Commission',
    location: 'Upbhokta Nyay Bhawan, INA, New Delhi',
    daysLeft: -3,
    progress: 75,
    milestones: [
      { title: 'Legal Notice Served', date: '05 May 2026', desc: 'Pre-litigation speed post notice delivered to manufacturer.', status: 'Completed' },
      { title: 'Complaint Registered', date: '20 May 2026', desc: 'Complaint registry on E-Daakhil portal under case code NCDRC-892.', status: 'Completed' },
      { title: 'Admission Hearing', date: '05 Jun 2026', desc: 'Court admitted petition for product defect liability compensation.', status: 'Completed' },
      { title: 'Reply Submission', date: '18 Jun 2026', desc: 'Mandatory 30-day window for opposing party reply expired.', status: 'Overdue' },
      { title: 'Final Arguments', date: '12 Jul 2026', desc: 'Bench listing for final arguments and settlement orders.', status: 'Upcoming' }
    ]
  },
  {
    id: 'family-court',
    name: 'Family Court Matter',
    caseNumber: 'PHC-FC-00412-2026',
    category: 'Family Matter',
    status: 'Upcoming',
    agency: 'Patiala House Family Court',
    location: 'Chamber 2, Family Court Division, New Delhi',
    daysLeft: 24,
    progress: 20,
    milestones: [
      { title: 'Petition Filed', date: '15 May 2026', desc: 'Mutual consent divorce petition under Section 13B filed.', status: 'Completed' },
      { title: 'First Motion Statement', date: '01 Jun 2026', desc: 'Personal statements recorded before the Family Judge.', status: 'Completed' },
      { title: 'Mediation Session', date: '15 Jun 2026', desc: 'Compulsory cooling-off mediation counseling report submitted.', status: 'Completed' },
      { title: 'Second Motion Hearing', date: '15 Dec 2026', desc: 'Final hearing listed after completion of cooling period.', status: 'Upcoming' },
      { title: 'Certified Decree Copy', date: '20 Dec 2026', desc: 'Issuance of certified copy of dissolution decree.', status: 'Upcoming' }
    ]
  },
  {
    id: 'affidavit-proc',
    name: 'Affidavit Processing',
    caseNumber: 'AFF-NOTARY-6712',
    category: 'Affidavit',
    status: 'Completed',
    agency: 'Tis Hazari Courts Complex',
    location: 'Notary Counter 12B, Delhi',
    daysLeft: 0,
    progress: 100,
    milestones: [
      { title: 'Stamp Paper Purchase', date: '18 Jun 2026', desc: '₹100 non-judicial stamp paper purchased from licensed vendor.', status: 'Completed' },
      { title: 'Drafting & Assembly', date: '19 Jun 2026', desc: 'Legal draft outlining name change declaration typed and compiled.', status: 'Completed' },
      { title: 'Notary Attestation', date: '20 Jun 2026', desc: 'Oath administered, registry log entry made, and notary seal affixed.', status: 'Completed' },
      { title: 'Magistrate Signature', date: '21 Jun 2026', desc: 'Executive Magistrate counter-signature obtained.', status: 'Completed' },
      { title: 'Gazette Despatch', date: '21 Jun 2026', desc: 'Sent to Controller of Publications for State Gazette notifications.', status: 'Completed' }
    ]
  },
  {
    id: 'income-cert',
    name: 'Income Certificate Application',
    caseNumber: 'SDM-INC-2026-3021',
    category: 'Income Certificate',
    status: 'Active',
    agency: 'Sub-Divisional Magistrate (SDM) Office',
    location: 'Dwarka Sector 10, South West Delhi',
    daysLeft: 6,
    progress: 40,
    milestones: [
      { title: 'Self-Declaration Upload', date: '10 Jun 2026', desc: 'Income affidavit and land records uploaded online.', status: 'Completed' },
      { title: 'Patwari Local Inquiry', date: '15 Jun 2026', desc: 'Local area patwari physical check and family income inquiry.', status: 'Completed' },
      { title: 'Approval Stage', date: '20 Jun 2026', desc: 'SDM desk verification and digital signing queue.', status: 'In Progress' },
      { title: 'Portal Generation', date: '27 Jun 2026', desc: 'Digital certificate generation with SDM hologram seal.', status: 'Upcoming' },
      { title: 'Issuance & Locker Sync', date: '30 Jun 2026', desc: 'Availability for download and automatic sync with DigiLocker.', status: 'Upcoming' }
    ]
  },
  {
    id: 'court-case-tenant',
    name: 'Landlord-Tenant Dispute',
    caseNumber: 'CS-COMM-892-2026',
    category: 'Court Case',
    status: 'Delayed',
    agency: 'Tis Hazari Civil Courts Division',
    location: 'Courtroom 243, Tis Hazari, Delhi',
    daysLeft: -10,
    progress: 50,
    milestones: [
      { title: 'Suit Plaint Filed', date: '10 Apr 2026', desc: 'Plaint seeking eviction and recovery of rent arrears filed.', status: 'Completed' },
      { title: 'Summons Issued', date: '28 Apr 2026', desc: 'Defendant summoned via Speed Post and email.', status: 'Completed' },
      { title: 'Defendant WS Filed', date: '25 May 2026', desc: 'Written statement submitted by tenant denying claims.', status: 'Completed' },
      { title: 'Issue Framing Stage', date: '15 Jun 2026', desc: 'Court framing distinct issues for evidentiary trials.', status: 'In Progress' },
      { title: 'Plaintiff Evidence', date: '28 Jul 2026', desc: 'Examination-in-chief of landlord and key witnesses.', status: 'Upcoming' }
    ]
  }
];

// CALENDAR MOCK EVENTS FOR JULY 2026
const MOCK_EVENTS = {
  3: { type: 'completed', title: 'Mediation report filed (Family Court)' },
  6: { type: 'hearing', title: 'Income Cert SDM Verification Meeting' },
  12: { type: 'hearing', title: 'Final Arguments: Gupta vs. Zenith Tech' },
  15: { type: 'submission', title: 'Deed Registration Biometric Slot' },
  18: { type: 'reminder', title: 'Gazette Despatch Affidavit Deadline' },
  20: { type: 'reminder', title: 'Reply Submission: CS-COMM-892' },
  25: { type: 'submission', title: 'Submit Land Records (Dwarka SDM)' }
};

export default function TimelineTracker() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Active process timeline selector state
  const [activeProcessId, setActiveProcessId] = useState('birth-cert');

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState([
    'Birth Certificate', 'Income Certificate', 'Affidavit', 'Property Registration', 'Court Case', 'Consumer Complaint', 'Family Matter'
  ]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');

  // Calendar State
  const [clickedDate, setClickedDate] = useState(null);

  // Filters Popover State & Ref
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const isFilterActive = selectedTypes.length < 7 || selectedStatus !== 'All' || selectedDateRange !== 'All';

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Trigger Toast helper
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Logout helper
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.05 });

    const elements = document.querySelectorAll('.reveal-section');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [selectedTypes, selectedStatus, selectedDateRange]);

  // Filtering Logic
  const filteredProcesses = DUMMY_PROCESSES.filter(p => {
    // 1. Process Type Check
    if (!selectedTypes.includes(p.category)) return false;

    // 2. Status Check
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Active' && p.status !== 'Active') return false;
      if (selectedStatus === 'Completed' && p.status !== 'Completed') return false;
      if (selectedStatus === 'Delayed' && p.status !== 'Delayed') return false;
      if (selectedStatus === 'Upcoming' && p.status !== 'Upcoming') return false;
    }

    // 3. Date Range Check
    if (selectedDateRange !== 'All') {
      if (selectedDateRange === 'This Week' && p.dateRangeCategory !== 'This Week' && p.id !== 'consumer-court' && p.id !== 'affidavit-proc') return false;
      if (selectedDateRange === 'This Month' && p.id === 'family-court') return false;
      if (selectedDateRange === 'Next 3 Months' && p.id === 'birth-cert') return false;
    }

    return true;
  });

  // Ensure activeProcessId exists in the filtered list, fallback if not
  useEffect(() => {
    if (filteredProcesses.length > 0) {
      const exists = filteredProcesses.some(p => p.id === activeProcessId);
      if (!exists) {
        setActiveProcessId(filteredProcesses[0].id);
      }
    }
  }, [filteredProcesses, activeProcessId]);

  const activeProcess = DUMMY_PROCESSES.find(p => p.id === activeProcessId);

  // Compute counts for checkboxes
  const getTypeCount = (type) => {
    return DUMMY_PROCESSES.filter(p => p.category === type).length;
  };

  const handleResetFilters = () => {
    setSelectedTypes([
      'Birth Certificate', 'Income Certificate', 'Affidavit', 'Property Registration', 'Court Case', 'Consumer Complaint', 'Family Matter'
    ]);
    setSelectedStatus('All');
    setSelectedDateRange('All');
    triggerToast("Filters reset to default.");
  };

  const toggleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Calendar render helpers
  const handleDateClick = (day) => {
    setClickedDate(day);
    if (MOCK_EVENTS[day]) {
      triggerToast(`Selected July ${day}: ${MOCK_EVENTS[day].title}`);
    } else {
      triggerToast(`Selected July ${day}, 2026. No deadlines scheduled.`);
    }
    setTimeout(() => setClickedDate(null), 600);
  };

  // Calculations for Docket Rail
  const getMilestoneIndex = (process) => {
    if (!process) return 0;
    const idx = process.milestones.findIndex(m => m.status === 'In Progress' || m.status === 'Overdue');
    if (idx !== -1) return idx;
    if (process.milestones.every(m => m.status === 'Completed')) return 4;
    const firstUpcoming = process.milestones.findIndex(m => m.status === 'Upcoming');
    return firstUpcoming !== -1 ? firstUpcoming : 0;
  };

  const activeMilestoneIndex = activeProcess ? getMilestoneIndex(activeProcess) : 0;

  // Custom colors for status text
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-[#2f9e63] bg-[#2f9e63]/10 border-[#2f9e63]/20';
      case 'in progress': return 'text-[#3b6fd6] bg-[#3b6fd6]/10 border-[#3b6fd6]/20';
      case 'upcoming': return 'text-[#d99a1f] bg-[#d99a1f]/10 border-[#d99a1f]/20';
      case 'overdue': return 'text-[#d64545] bg-[#d64545]/10 border-[#d64545]/20 animate-pulse';
      case 'delayed': return 'text-[#d64545] bg-[#d64545]/10 border-[#d64545]/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusDot = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-[#2f9e63]';
      case 'in progress': return 'bg-[#3b6fd6]';
      case 'upcoming': return 'bg-[#d99a1f]';
      case 'overdue': return 'bg-[#d64545]';
      case 'delayed': return 'bg-[#d64545]';
      default: return 'bg-slate-400';
    }
  };

  // LEFT SIDEBAR NAV ITEMS
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
    { id: 'cases', label: 'My Cases', icon: Briefcase, link: '/dashboard' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, link: '/dashboard' },
    { id: 'timeline', label: 'Timeline', icon: Clock, link: '/timeline', isActive: true },
    { id: 'documents', label: 'Documents', icon: FileText, link: '/dashboard' },
    { id: 'government', label: 'Government', icon: Globe, link: '/dashboard' },
    { id: 'fraud', label: 'Fraud Prevention', icon: Scale, link: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, link: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dot-grid-texture font-sans text-navy-core selection:bg-gold-core selection:text-white antialiased flex">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-8 z-50 bg-navy-core border border-gold-core text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-mono-data text-xs">
          <Scale className="h-4 w-4 text-gold-core animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. FIXED LEFT SIDEBAR (bg-[#0c1b33], width ~230px, full-height) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[230px] bg-[#0c1b33] text-slate-300 flex flex-col justify-between border-r border-[#1a2b47] z-40">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo */}
          <div className="h-20 flex items-center px-6 border-b border-[#1a2b47] flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-[#1a2b47] p-2 rounded-xl text-[#ffffff] flex items-center justify-center border border-[#c59b6d]/30 shadow-md">
                <Scale className="h-5 w-5 text-[#c59b6d] stroke-[1.8]" />
              </div>
              <div>
                <span className="font-serif-display text-lg font-bold tracking-tight text-[#ffffff]">
                  CaseWatch
                </span>
                <span className="block text-[8px] tracking-[0.2em] text-[#c59b6d] font-bold uppercase -mt-0.5 font-mono-data">
                  Counselor Space
                </span>
              </div>
            </Link>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.isActive;
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={() => {
                    if (item.id !== 'timeline') {
                      triggerToast(`Navigating to ${item.label}...`);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive 
                      ? 'bg-white/10 text-white font-extrabold shadow-sm' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#c59b6d] stroke-[2.5]' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Action & Secondary Links */}
        <div className="p-4 border-t border-[#1a2b47] space-y-4 flex-shrink-0 bg-[#0c1b33]">
          {/* Gold "+ Create New Case" CTA button */}
          <button
            onClick={() => triggerToast("Create New Case Wizard initiated.")}
            className="w-full bg-[#f8d488] hover:bg-[#f6c96b] text-[#0c1b33] font-black py-3.5 rounded-full text-[10.5px] uppercase tracking-wider shadow-md transition-all active:translate-y-[0.5px] cursor-pointer"
          >
            + Create New Case
          </button>

          {/* Secondary links */}
          <div className="flex flex-col gap-1 px-2 text-[10px] font-bold text-slate-400 uppercase">
            <button 
              onClick={() => triggerToast("Help Center loading...")}
              className="flex items-center gap-2 hover:text-white transition-colors py-1 cursor-pointer text-left font-semibold"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-450" />
              Help Center
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-400 transition-colors py-1 cursor-pointer text-left text-red-500/80 font-semibold"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Positioned next to the left sidebar) */}
      <div className="flex-1 pl-[230px] flex flex-col min-w-0">
        
        {/* Sticky top-bar header */}
        <header className="h-20 bg-white border-b border-gray-150 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          {/* Left: Global Search box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Global Search..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-[#f8f9fb] focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-core focus:border-gold-core transition-all text-navy-core placeholder-slate-400 font-semibold"
              onChange={(e) => triggerToast(`Searching: "${e.target.value}"`)}
            />
          </div>

          {/* Right: Server Time, Alerts Bell, User Profile info */}
          <div className="flex items-center gap-6 text-xs font-semibold">
            {/* Server Time Pill */}
            <div className="bg-[#e9eff7] border border-blue-100/50 text-navy-core px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold shadow-sm font-mono-data">
              <Clock className="h-3.5 w-3.5 text-gold-core stroke-[2]" />
              <span>SERVER TIME: 09:42 EST</span>
            </div>

            {/* Alerts Bell */}
            <button 
              onClick={() => triggerToast("Opening notification center...")}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
            >
              <Bell className="h-4 w-4 text-navy-core" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d64545] rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* User Profile avatar */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-navy-core">{user?.name || "Alexander Wright"}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono-data">Lead Counsel</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-core text-white flex items-center justify-center border border-gold-core/30 shadow-md font-serif-display font-extrabold text-base">
                {user?.name ? user.name.split(' ').pop().charAt(0) : "W"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Panel Scrollable Area */}
        <div className="p-8 max-w-[1500px] mx-auto w-full space-y-8">
          
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 reveal-section revealed">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[#6B7280] font-medium font-sans mb-3">
                KNOWLEDGE BASE &gt; CASE DOCKET OVERVIEW
              </div>
              <h1 className="text-[38px] font-extrabold text-[#111827] tracking-[-0.02em] leading-tight font-sans">
                Timeline & Deadline Tracker
              </h1>
              <p className="text-sm text-[#6B7280] max-w-3xl leading-relaxed mt-2 font-normal font-sans">
                Track every legal process, upcoming deadline, document submission, and court hearing from a single timeline. Use the filters to drill down into specific jurisdictions.
              </p>
            </div>

            {/* Filters Popover Anchor */}
            <div className="relative mt-2 sm:mt-8 flex-shrink-0" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                  isFilterOpen || isFilterActive
                    ? 'border-gold-core bg-gold-core/5 text-[#0c1b33]'
                    : 'border-navy-core/15 hover:border-gold-core hover:bg-gold-core/5 text-navy-light'
                }`}
              >
                <Filter className="h-4 w-4 text-gold-core" />
                <span>Filters</span>
                {isFilterActive && (
                  <span className="w-2 h-2 bg-gold-core rounded-full border border-white"></span>
                )}
                <ChevronDown className={`h-3 w-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Dropdown Panel */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-navy-core/8 shadow-[0_16px_50px_-12px_rgba(11,31,58,0.22)] p-6 space-y-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-navy-core/5 pb-3">
                    <span className="font-serif-display text-sm font-bold text-[#0c1b33]">Filter Options</span>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 text-slate-400 hover:text-navy-core rounded-lg cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Filter Section: Process Type */}
                  <div className="space-y-3">
                    <h4 className="text-[10.5px] uppercase tracking-wider font-extrabold text-navy-light/55 font-mono-data">Process Type</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                      {[
                        'Birth Certificate', 'Income Certificate', 'Affidavit', 'Property Registration', 'Court Case', 'Consumer Complaint', 'Family Matter'
                      ].map((type) => {
                        const isChecked = selectedTypes.includes(type);
                        const count = getTypeCount(type);
                        return (
                          <label key={type} className="flex items-center justify-between cursor-pointer group text-xs text-navy-light font-semibold py-1">
                            <div className="flex items-center gap-2.5">
                              <input 
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={() => toggleTypeFilter(type)}
                              />
                              <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                                isChecked ? 'bg-gold-core border-gold-core text-white' : 'border-navy-core/20 group-hover:border-gold-core bg-white'
                              }`}>
                                {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <span className={isChecked ? 'text-navy-core font-bold' : 'text-navy-light/75 group-hover:text-navy-core'}>{type}</span>
                            </div>
                            <span className="text-[10px] bg-navy-core/5 group-hover:bg-navy-core/10 text-navy-light/60 px-2 py-0.5 rounded font-mono-data font-semibold">
                              {count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Section: Status */}
                  <div className="space-y-3 pt-4 border-t border-navy-core/5">
                    <h4 className="text-[10.5px] uppercase tracking-wider font-extrabold text-navy-light/55 font-mono-data">Status</h4>
                    <div className="space-y-2.5">
                      {['All', 'Active', 'Completed', 'Delayed', 'Upcoming'].map((status) => {
                        const isSelected = selectedStatus === status;
                        return (
                          <label key={status} className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-navy-light group py-0.5">
                            <input 
                              type="radio" 
                              name="status-filter"
                              className="sr-only"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedStatus(status);
                                triggerToast(`Filtering status: ${status}`);
                              }}
                            />
                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                              isSelected ? 'border-gold-core bg-white' : 'border-navy-core/25 bg-white group-hover:border-gold-core'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-gold-core"></div>}
                            </div>
                            <span className="flex items-center gap-2">
                              {status !== 'All' && <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)}`}></span>}
                              <span className={isSelected ? 'text-navy-core font-bold' : 'text-navy-light/75 group-hover:text-navy-core'}>
                                {status}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Section: Date Range */}
                  <div className="space-y-3 pt-4 border-t border-navy-core/5">
                    <h4 className="text-[10.5px] uppercase tracking-wider font-extrabold text-navy-light/55 font-mono-data">Date Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['All', 'This Week', 'This Month', 'Next 3 Months'].map((range) => {
                        const isActive = selectedDateRange === range;
                        return (
                          <button
                            key={range}
                            onClick={() => {
                              setSelectedDateRange(range);
                              triggerToast(`Date range set to: ${range}`);
                            }}
                            className={`text-[10px] font-bold py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-gold-core/10 border-gold-core text-gold-core' 
                                : 'bg-white border-navy-core/8 hover:border-gold-core/40 text-navy-light'
                            }`}
                          >
                            {range === 'All' ? 'Custom Range' : range}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset Filters button */}
                  <button
                    onClick={handleResetFilters}
                    className="w-full text-center text-xs font-bold text-navy-light/80 hover:text-red-500 transition-colors border border-navy-core/8 hover:border-red-500/20 py-2.5 rounded-xl bg-navy-core/5 hover:bg-red-500/5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STAT CARDS ROW */}
          <section className="grid grid-cols-4 gap-6 reveal-section revealed">
            {[
              { title: "Active Processes", val: "12", trend: "+2 this week", trendColor: "text-[#2f9e63] bg-[#2f9e63]/10 border-[#2f9e63]/25", icon: RefreshCw, circleBg: "bg-blue-50 text-[#3b6fd6] border border-blue-100" },
              { title: "Upcoming Deadlines", val: "5", trend: "3 critical", trendColor: "text-[#d64545] bg-[#d64545]/10 border-[#d64545]/25", icon: Clock, circleBg: "bg-amber-50 text-[#d99a1f] border border-amber-100" },
              { title: "Hearings This Month", val: "3", trend: "District Court V", trendColor: "text-navy-light bg-navy-light/5 border-navy-light/10", icon: CalendarIcon, circleBg: "bg-purple-50 text-purple-700 border border-purple-100" },
              { title: "Completed Tasks", val: "18", trend: "98% compliance", trendColor: "text-[#2f9e63] bg-[#2f9e63]/10 border-[#2f9e63]/25", icon: CheckCircle2, circleBg: "bg-emerald-50 text-[#2f9e63] border border-emerald-100" }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] hover-lift flex flex-col justify-between min-h-[148px]">
                  <div className="flex justify-between items-start">
                    <div className={`${card.circleBg} p-2.5 rounded-xl`}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono-data ${card.trendColor}`}>
                      {card.trend}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-4xl font-serif-display font-black text-navy-core leading-none">
                      {card.val}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-navy-light/50 block mt-1.5 font-mono-data">
                      {card.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* 3-COLUMN DATA CONTENT PANEL */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Middle Column: Core Timeline Dashboard & Reminders (Expanded to col-span-9) */}
            <div className="col-span-9 space-y-8">
              
              {/* Empty state overlay or Timeline items */}
              {filteredProcesses.length === 0 ? (
                <div className="bg-white rounded-3xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.12)] p-16 text-center space-y-6 reveal-section revealed">
                  <div className="w-20 h-20 bg-navy-core/5 border border-navy-core/10 rounded-full flex items-center justify-center mx-auto text-navy-light/40">
                    <Inbox className="h-10 w-10 stroke-[1.2]" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-serif-display text-xl font-bold text-navy-core">
                      No active legal processes currently being tracked.
                    </h3>
                    <p className="text-xs text-navy-light/60 font-medium">
                      Try adjusting or resetting your filter criteria in the left sidebar to show active dockets.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="bg-gold-core hover:bg-gold-bright text-navy-core text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all border border-gold-core/30 cursor-pointer"
                  >
                    Start Tracking a Process
                  </button>
                </div>
              ) : (
                <>
                  {/* MAIN TIMELINE (THE CENTERPIECE) */}
                  <section className="bg-white rounded-3xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.12)] p-8 space-y-8 reveal-section revealed">
                    
                    {/* Timeline Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-core/5 pb-5">
                      <div>
                        <span className="text-[10px] font-bold text-gold-core uppercase font-mono-data tracking-wider block">Active Docket Flow</span>
                        <h3 className="font-serif-display text-xl font-extrabold text-navy-core mt-0.5">
                          {activeProcess?.name}
                        </h3>
                        <span className="text-[10.5px] font-mono-data text-navy-light/50 font-semibold block mt-0.5 uppercase">
                          CNR: {activeProcess?.caseNumber} • {activeProcess?.agency}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => triggerToast("Add Stage wizard initiated.")}
                          className="text-xs font-bold text-navy-core border border-navy-core/15 hover:border-navy-core hover:bg-navy-core/5 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Add Stage
                        </button>
                        <button 
                          onClick={() => triggerToast("Exporting timeline report...")}
                          className="text-xs font-bold text-navy-core border border-navy-core/15 hover:border-navy-core hover:bg-navy-core/5 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileDown className="h-4 w-4 text-gold-core" />
                          Export
                        </button>
                      </div>
                    </div>

                    {/* Horizontal Tabs to Switch Processes */}
                    <div className="flex items-center border-b border-navy-core/5 gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-tan-dark">
                      {filteredProcesses.map((p) => {
                        const isActive = p.id === activeProcessId;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setActiveProcessId(p.id);
                              triggerToast(`Switched view to: ${p.name}`);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                              isActive 
                                ? 'border-gold-core bg-gold-core/5 text-navy-core font-extrabold' 
                                : 'border-transparent text-navy-light/75 hover:text-navy-core'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(p.status)}`}></span>
                            {p.category}
                          </button>
                        );
                      })}
                    </div>

                    {/* Horizontal Docket Rail Milestones */}
                    <div className="relative pt-12 pb-10 px-4">
                      {/* Line Background */}
                      <div className="absolute left-[10%] right-[10%] top-[76px] h-1 bg-slate-200 -z-10 rounded"></div>
                      
                      {/* Line Progress Segment */}
                      <div 
                        className="absolute left-[10%] top-[76px] h-1 bg-gradient-to-r from-[#2f9e63] via-[#3b6fd6] to-[#3b6fd6] -z-10 rounded transition-all duration-700 ease-out" 
                        style={{ width: `${(activeMilestoneIndex / 4) * 80}%` }}
                      ></div>

                      {/* Milestone Nodes */}
                      <div className="grid grid-cols-5 gap-4 relative">
                        {activeProcess?.milestones.map((m, idx) => {
                          const isCompleted = idx < activeMilestoneIndex;
                          const isCurrent = idx === activeMilestoneIndex;
                          const isUpcoming = idx > activeMilestoneIndex;

                          let borderClass = 'border-[#2f9e63] text-[#2f9e63] bg-white';
                          let circleRing = 'border-2';
                          let isPulse = false;

                          if (isCurrent) {
                            if (m.status === 'Overdue') {
                              borderClass = 'border-[#d64545] text-[#d64545] bg-[#d64545]/5';
                              circleRing = 'border-2 ring-4 ring-[#d64545]/20 animate-pulse';
                            } else {
                              borderClass = 'border-[#3b6fd6] text-[#3b6fd6] bg-white';
                              circleRing = 'border-2 ring-4 ring-[#3b6fd6]/20';
                              isPulse = true;
                            }
                          } else if (isUpcoming) {
                            borderClass = 'border-navy-core/10 text-navy-light/40 bg-white';
                            circleRing = 'border';
                          }

                          return (
                            <div key={idx} className="flex flex-col items-center text-center space-y-3 relative group">
                              
                              {/* Date (above node) */}
                              <span className="text-[10px] font-mono-data font-bold text-navy-light/50 group-hover:text-navy-core transition-colors h-4">
                                {m.date}
                              </span>

                              {/* Node Circle */}
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${borderClass} ${circleRing} ${isPulse ? 'pulse-blue' : ''} shadow-md transition-all duration-300 z-10 hover:scale-105`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="h-5.5 w-5.5 stroke-[2.5]" />
                                ) : isCurrent && m.status === 'Overdue' ? (
                                  <AlertTriangle className="h-5.5 w-5.5" />
                                ) : isCurrent ? (
                                  <Clock className="h-5.5 w-5.5 stroke-[2.5]" />
                                ) : (
                                  <FileText className="h-5.5 w-5.5 stroke-[1.5]" />
                                )}
                              </div>

                              {/* Node text content (below node) */}
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-navy-core leading-tight">
                                  {m.title}
                                </h5>
                                <p className="text-[10px] text-navy-light/60 font-medium leading-relaxed max-w-[120px] mx-auto line-clamp-2" title={m.desc}>
                                  {m.desc}
                                </p>
                                {/* Status Pill Tag */}
                                <div className="pt-1">
                                  <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider font-mono-data ${getStatusColor(m.status)}`}>
                                    {m.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Legend row at the bottom */}
                    <div className="flex items-center justify-center gap-6 border-t border-navy-core/5 pt-4 text-[10px] font-bold font-mono-data text-navy-light/60">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2f9e63] border border-[#2f9e63]/20"></span>
                        Completed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b6fd6] border border-[#3b6fd6]/20 pulse-blue"></span>
                        In Progress
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d99a1f] border border-[#d99a1f]/20"></span>
                        Upcoming
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d64545] border border-[#d64545]/20 animate-pulse"></span>
                        Overdue
                      </span>
                    </div>

                  </section>

                  {/* UPCOMING DEADLINES GRID */}
                  <section className="space-y-4 reveal-section">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-display text-xl font-bold text-navy-core">Upcoming Critical Deadlines</h4>
                      <span className="text-[10px] text-gold-core uppercase font-mono-data font-bold tracking-wider">Urgency Queue</span>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { type: "Court Hearing", date: "Jul 12, 2026", details: "National Consumer Commission, INA", days: "8 Days Left", urgency: "amber", border: "border-l-4 border-l-[#d99a1f]", title: "Consumer Complaint Hearing", proc: "NCDRC-CC-892-2026", progress: 80 },
                        { type: "Document Submission", date: "Jul 15, 2026", details: "Required: Biometric registry signatures", days: "1 Week Left", urgency: "blue", border: "border-l-4 border-l-[#3b6fd6]", title: "Deed Physical Execution", proc: "DL-SUBREG-V-4921", progress: 60 },
                        { type: "Affidavit Verification", date: "Jul 20, 2026", details: "Publication in State Gazette office", days: "12 Days Left", urgency: "green", border: "border-l-4 border-l-[#2f9e63]", title: "Gazette Notification Approval", proc: "AFF-NOTARY-6712", progress: 100 }
                      ].map((card, i) => (
                        <div key={i} className={`bg-white p-5 rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] hover-lift flex flex-col justify-between min-h-[190px] ${card.border}`}>
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-navy-light/40 font-mono-data block">
                                {card.type}
                              </span>
                              <span className={`text-[8.5px] font-mono-data font-bold px-2 py-0.5 rounded ${
                                card.urgency === 'red' ? 'text-[#d64545] bg-[#d64545]/10 animate-pulse' :
                                card.urgency === 'amber' ? 'text-[#d99a1f] bg-[#d99a1f]/10' :
                                card.urgency === 'blue' ? 'text-[#3b6fd6] bg-[#3b6fd6]/10' :
                                'text-[#2f9e63] bg-[#2f9e63]/10'
                              }`}>
                                {card.days}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-navy-core hover:text-gold-core transition-colors cursor-pointer" onClick={() => triggerToast(`Navigating to ${card.title} details`)}>
                                {card.title}
                              </h5>
                              <p className="text-[10px] text-navy-light/45 font-semibold font-mono-data">
                                PROCS: {card.proc}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] text-navy-light/60 font-semibold font-mono-data">
                                <CalendarIcon className="h-3.5 w-3.5 text-navy-light/40 flex-shrink-0" />
                                <span>{card.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-navy-light/60 font-semibold font-mono-data">
                                <MapPin className="h-3.5 w-3.5 text-navy-light/40 flex-shrink-0" />
                                <span className="truncate">{card.details}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-2 border-t border-navy-core/5">
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  card.urgency === 'amber' ? 'bg-[#d99a1f]' :
                                  card.urgency === 'blue' ? 'bg-[#3b6fd6]' :
                                  'bg-[#2f9e63]'
                                }`} 
                                style={{ width: `${card.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* CALENDAR + REMINDERS */}
                  <section className="grid grid-cols-12 gap-6 reveal-section">
                    {/* Calendar (~55%) */}
                    <div className="col-span-7 bg-white rounded-3xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.12)] p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-navy-core/5 pb-4">
                        <div>
                          <h4 className="font-serif-display text-lg font-bold text-navy-core">July 2026</h4>
                          <span className="text-[9px] text-gold-core uppercase font-mono-data font-bold tracking-wider mt-0.5 block">Strategic Schedule</span>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => triggerToast("Viewing June 2026 events")}
                            className="p-1.5 hover:bg-navy-core/5 text-navy-core rounded-lg transition-colors border border-navy-core/8 cursor-pointer"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => triggerToast("Viewing August 2026 events")}
                            className="p-1.5 hover:bg-navy-core/5 text-navy-core rounded-lg transition-colors border border-navy-core/8 cursor-pointer"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-y-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                          <div key={d} className="text-center text-[9px] font-bold text-navy-light/45 uppercase tracking-widest py-1.5 font-mono-data">
                            {d}
                          </div>
                        ))}

                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={`empty-${i}`} className="p-2.5"></div>
                        ))}
                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const event = MOCK_EVENTS[dayNum];
                          const isToday = dayNum === 21;
                          const isClicked = clickedDate === dayNum;

                          let dotColor = '';
                          if (event) {
                            if (event.type === 'completed') dotColor = 'bg-[#2f9e63]';
                            else if (event.type === 'hearing') dotColor = 'bg-[#d64545]';
                            else if (event.type === 'submission') dotColor = 'bg-[#3b6fd6]';
                            else if (event.type === 'reminder') dotColor = 'bg-[#d99a1f]';
                          }

                          return (
                            <div 
                              key={dayNum} 
                              onClick={() => handleDateClick(dayNum)}
                              className={`p-2.5 text-center text-xs font-bold font-mono-data hover:bg-navy-core/5 rounded-xl transition-all cursor-pointer relative group ${
                                isToday ? 'bg-navy-core text-white ring-2 ring-gold-core shadow-md' : 'text-navy-core'
                              } ${isClicked ? 'bg-gold-core/20 text-navy-core scale-105' : ''}`}
                            >
                              <span className="relative z-10">{dayNum}</span>
                              {event && (
                                <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dotColor} group-hover:scale-125 transition-transform`}></span>
                              )}
                              {isClicked && (
                                <span className="absolute inset-0 rounded-xl border-2 border-gold-core animate-ping opacity-75 pointer-events-none"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between border-t border-navy-core/5 pt-4 text-[8px] font-bold font-mono-data text-navy-light/65">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#d64545]"></span>
                          Hearings
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#3b6fd6]"></span>
                          Submissions
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#2f9e63]"></span>
                          Completed
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#d99a1f]"></span>
                          Reminders
                        </span>
                      </div>
                    </div>

                    {/* Reminder Center (~45%) */}
                    <div className="col-span-5 bg-white rounded-3xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.12)] p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b border-navy-core/5 pb-4">
                          <h4 className="font-serif-display text-lg font-bold text-navy-core">Reminders</h4>
                          <span className="text-[9px] text-gold-core uppercase font-mono-data font-bold tracking-wider mt-0.5 block">Alerts</span>
                        </div>

                        <div className="space-y-3">
                          {[
                            { title: "Hearing scheduled tomorrow", priority: "High", color: "text-[#d64545] bg-[#d64545]/10 border-[#d64545]/20", time: "10:30 AM" },
                            { title: "Document expires in 7 days", priority: "Medium", color: "text-[#d99a1f] bg-[#d99a1f]/10 border-[#d99a1f]/20", time: "2 DAYS" },
                            { title: "Missing landlord declaration", priority: "High", color: "text-[#d64545] bg-[#d64545]/10 border-[#d64545]/20", time: "4 DAYS" },
                            { title: "Officer verification success", priority: "Low", color: "text-[#2f9e63] bg-[#2f9e63]/10 border-[#2f9e63]/20", time: "5 DAYS" }
                          ].map((rem, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-[#fafbfc] border border-navy-core/5 rounded-xl hover:border-gold-core/40 transition-colors">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`text-[8px] font-mono-data font-extrabold uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${rem.color}`}>
                                  {rem.priority}
                                </span>
                                <span className="text-xs font-bold text-navy-core truncate leading-tight">
                                  {rem.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[8px] font-mono-data text-navy-light/40 font-bold uppercase">{rem.time}</span>
                                <button 
                                  onClick={() => triggerToast(`Action: Resolving "${rem.title}"`)}
                                  className="text-gold-core hover:text-gold-bright p-0.5 transition-colors hover:scale-105 cursor-pointer"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PROGRESS ANALYTICS */}
                  <section className="grid grid-cols-3 gap-6 reveal-section">
                    {/* Donut Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] flex flex-col justify-between min-h-[240px]">
                      <div>
                        <h4 className="font-serif-display text-sm font-bold text-navy-core">Cases by Status</h4>
                        <span className="text-[8.5px] font-mono-data font-bold text-navy-light/40 uppercase tracking-wider mt-0.5 block">Portfolio distribution</span>
                      </div>

                      <div className="flex items-center gap-4 py-1">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" stroke="#f1f3f6" strokeWidth="12" fill="transparent" />
                            <circle cx="50" cy="50" r="38" stroke="#2f9e63" strokeWidth="12" fill="transparent"
                                    strokeDasharray="107.5 238.8" strokeDashoffset="0" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="38" stroke="#3b6fd6" strokeWidth="12" fill="transparent"
                                    strokeDasharray="83.6 238.8" strokeDashoffset="-107.5" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="38" stroke="#d64545" strokeWidth="12" fill="transparent"
                                    strokeDasharray="47.7 238.8" strokeDashoffset="-191.1" strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-black font-mono-data text-navy-core">12</span>
                            <span className="text-[7px] text-navy-light/40 font-extrabold uppercase tracking-widest font-mono-data">Total</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-1 text-[8.5px] font-bold font-mono-data text-navy-light/60">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-[#2f9e63]"></span>
                            <span>Comp: 45%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-[#3b6fd6]"></span>
                            <span>Active: 35%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-[#d64545]"></span>
                            <span>Delay: 20%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] flex flex-col justify-between min-h-[240px]">
                      <div>
                        <h4 className="font-serif-display text-sm font-bold text-navy-core">Monthly Deadlines</h4>
                        <span className="text-[8.5px] font-mono-data font-bold text-navy-light/40 uppercase tracking-wider mt-0.5 block">6-Month historical count</span>
                      </div>

                      <div className="py-2 h-28 w-full flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 200 100">
                          <defs>
                            <linearGradient id="gold-bar-side" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#e3c172" />
                              <stop offset="100%" stopColor="#c9a24b" />
                            </linearGradient>
                            <linearGradient id="blue-bar-side" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#5d8df2" />
                              <stop offset="100%" stopColor="#3b6fd6" />
                            </linearGradient>
                          </defs>
                          <line x1="10" y1="90" x2="190" y2="90" stroke="#e1e5eb" strokeWidth="1" />
                          <rect x="20" y="45" width="16" height="45" rx="3" fill="url(#gold-bar-side)" />
                          <rect x="50" y="30" width="16" height="60" rx="3" fill="url(#gold-bar-side)" />
                          <rect x="80" y="55" width="16" height="35" rx="3" fill="url(#gold-bar-side)" />
                          <rect x="110" y="15" width="16" height="75" rx="3" fill="url(#gold-bar-side)" />
                          <rect x="140" y="40" width="16" height="50" rx="3" fill="url(#gold-bar-side)" />
                          <rect x="170" y="22" width="16" height="68" rx="3" fill="url(#blue-bar-side)" />
                          <text x="28" y="98" fill="#8c9eb9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">FEB</text>
                          <text x="58" y="98" fill="#8c9eb9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">MAR</text>
                          <text x="88" y="98" fill="#8c9eb9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">APR</text>
                          <text x="118" y="98" fill="#8c9eb9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">MAY</text>
                          <text x="148" y="98" fill="#8c9eb9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">JUN</text>
                          <text x="178" y="98" fill="#3b6fd6" fontSize="6" fontWeight="extrabold" textAnchor="middle" fontFamily="JetBrains Mono">JUL</text>
                        </svg>
                      </div>
                    </div>

                    {/* Progress Rings */}
                    <div className="bg-white p-6 rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] flex flex-col justify-between min-h-[240px]">
                      <div>
                        <h4 className="font-serif-display text-sm font-bold text-navy-core">Department Rate</h4>
                        <span className="text-[8.5px] font-mono-data font-bold text-navy-light/40 uppercase tracking-wider mt-0.5 block">Categorized completion</span>
                      </div>

                      <div className="space-y-3 py-1 font-mono-data text-[9.5px] font-bold">
                        {[
                          { name: "Certificates", pct: "75%", offset: "29.8", color: "stroke-[#2f9e63]" },
                          { name: "Court Cases", pct: "40%", offset: "71.6", color: "stroke-[#3b6fd6]" },
                          { name: "Affidavits", pct: "92%", offset: "9.5", color: "stroke-[#d99a1f]" }
                        ].map((ring, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-navy-core/5 pb-2 last:border-b-0 last:pb-0">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-navy-core font-sans">{ring.name}</span>
                              <span className="text-[8.5px] text-navy-light/40 font-semibold">{ring.pct} completed</span>
                            </div>

                            <div className="w-8 h-8 relative flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="16" stroke="#f1f3f6" strokeWidth="4" fill="transparent" />
                                <circle cx="20" cy="20" r="16" className={ring.color} strokeWidth="4" fill="transparent"
                                        strokeDasharray="100.5 100.5" strokeDashoffset={ring.offset} strokeLinecap="round" />
                              </svg>
                              <span className="absolute text-[8px] text-navy-core font-extrabold">{ring.pct.replace('%','')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}

            </div>

            {/* Right Column: Sticky Log Feed & Pace Card */}
            <aside className="col-span-3 sticky top-28 space-y-6 reveal-section revealed">
              {/* Activity Feed Card */}
              <div className="bg-white rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] p-6 space-y-5">
                <div className="border-b border-navy-core/5 pb-4">
                  <h4 className="font-serif-display text-lg font-bold text-navy-core">Docket Live Logs</h4>
                  <span className="text-[9px] text-gold-core uppercase font-mono-data font-bold tracking-wider mt-0.5 block">Audit timeline</span>
                </div>

                <div className="relative pl-5 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-core/5">
                  {[
                    { text: "Income Certificate SDM review verified", time: "Today, 10:30 AM", dotColor: "bg-[#2f9e63] ring-[#2f9e63]/25" },
                    { text: "Deed draft submitted to Sub-Registrar V", time: "Yesterday, 3:15 PM", dotColor: "bg-[#3b6fd6] ring-[#3b6fd6]/25" },
                    { text: "Hearing listed: Consumer Court bench", time: "Jun 18, 11:00 AM", dotColor: "bg-[#d99a1f] ring-[#d99a1f]/25" },
                    { text: "Tis Hazari notary stamp duty completed", time: "Jun 15, 04:30 PM", dotColor: "bg-[#2f9e63] ring-[#2f9e63]/25" }
                  ].map((log, i) => (
                    <div key={i} className="relative text-xs leading-normal">
                      <div className={`absolute -left-[24px] top-1.5 w-3 h-3 rounded-full border border-white ring-4 ${log.dotColor}`}></div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-navy-core">{log.text}</p>
                        <span className="block text-[8.5px] font-mono-data text-navy-light/45 font-bold uppercase">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Month Pace Card */}
              <div className="bg-white rounded-2xl border border-navy-core/8 shadow-[0_8px_30px_-10px_rgba(11,31,58,0.1)] p-6 space-y-4">
                <div>
                  <h4 className="font-serif-display text-sm font-bold text-navy-core">This Month's Pace</h4>
                  <span className="text-[8.5px] font-mono-data font-bold text-navy-light/40 uppercase tracking-wider mt-0.5 block">Performance parameters</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: "Filings on time", pct: "92%", color: "bg-[#2f9e63]" },
                    { label: "Avg response time", pct: "78%", color: "bg-[#3b6fd6]" },
                    { label: "Reminders actioned", pct: "67%", color: "bg-[#d99a1f]" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold font-mono-data text-navy-light">
                        <span>{item.label}</span>
                        <span className="text-navy-core font-extrabold">{item.pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>

        </div>

      </div>

      {/* STICKY FLOATING QUICK ACTIONS BAR (Adjusted left margin to keep it centered in right-side pane) */}
      <div className="fixed bottom-8 left-[calc(50%+115px)] -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="bg-white/90 backdrop-blur-md rounded-full border border-navy-core/10 px-6 py-3.5 shadow-[0_16px_50px_-12px_rgba(11,31,58,0.22)] flex items-center gap-6">
          <button
            onClick={() => triggerToast("Add New Process Wizard initiated.")}
            className="flex items-center gap-2 bg-[#c9a24b] hover:bg-[#e3c172] text-[#0b1f3a] font-bold text-xs uppercase px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Add Process
          </button>
          
          <div className="h-5 w-px bg-navy-core/10"></div>
          
          <button
            onClick={() => triggerToast("Direct documents upload directory opened.")}
            className="flex items-center gap-1.5 text-navy-light/85 hover:text-navy-core text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-gold-core" />
            Upload Docs
          </button>

          <div className="h-5 w-px bg-navy-core/10"></div>

          <button
            onClick={() => triggerToast("New reminder alert creation active.")}
            className="flex items-center gap-1.5 text-navy-light/85 hover:text-navy-core text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          >
            <Bell className="h-4 w-4 text-[#3b6fd6]" />
            Reminder
          </button>

          <div className="h-5 w-px bg-navy-core/10"></div>

          <button
            onClick={() => triggerToast("Downloading PDF summary report...")}
            className="flex items-center gap-1.5 text-navy-light/85 hover:text-navy-core text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-[#2f9e63]" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
