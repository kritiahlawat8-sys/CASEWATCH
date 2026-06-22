import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scale, 
  LogOut, 
  Search, 
  Bell, 
  History, 
  Moon, 
  Sun,
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  FileText, 
  Globe, 
  BarChart3, 
  Plus, 
  Settings, 
  HelpCircle,
  Clock,
  CheckCircle2, 
  ArrowRight,
  Navigation,
  FileSignature,
  FileBadge,
  Users,
  AlertCircle,
  Edit3,
  Menu,
  X,
  FileDown,
  Lock
} from 'lucide-react';

// TEMPORARY MOCK DATA - replace with real API calls later
import { mockUser, mockCases, mockCalendarEvents, mockDocModules, mockDocDetail } from '../mockData.js';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Responsive sidebar and right panel drawer toggles for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Dashboard interactive state
  const [activeTab, setActiveTab] = useState('finder'); // 'finder' or 'global'
  const [activeNav, setActiveNav] = useState('dashboard'); // navigation link tracker
  const [selectedCaseId, setSelectedCaseId] = useState(null); // tracking active case details view
  const [selectedEvent, setSelectedEvent] = useState(null); // active calendar event details
  const [selectedDocModule, setSelectedDocModule] = useState('bail'); // active document templates module
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Notes state with auto-save to localStorage
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('casewatch_notes') || '';
  });
  const [saveTime, setSaveTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal State for New Case Filing & Brief Review
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCourtName, setNewCourtName] = useState('Supreme Court of India');
  const [newStatus, setNewStatus] = useState('Hearing Stage');
  
  // Profile dropdown interactive state & ref
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown on click outside or Escape key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Handle Note Auto-Save simulation
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      localStorage.setItem('casewatch_notes', notes);
      const now = new Date();
      setSaveTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [notes]);

  // Handle New Case Submission
  const handleCreateCase = (e) => {
    e.preventDefault();
    alert(`Case ${newCaseNumber} filed successfully at ${newCourtName}! Status: ${newStatus}`);
    setShowFilingModal(false);
  };

  // ==========================================
  // TEMPORARY MOCK RENDER METHODS - REPLACE WITH REAL API CALLS LATER
  // ==========================================

  const renderDashboardOverview = () => {
    return (
      <>
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1b33] tracking-tight">
              Welcome, Counselor {user?.name ? user.name.split(' ').pop() : mockUser.name.split(' ').pop()}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              Here is your operational overview for <strong className="text-gray-900">Monday, October 14th</strong>.
            </p>
          </div>
          
          {/* Server Time Pill */}
          <div className="bg-[#e9eff7] border border-blue-100/50 text-[#0c1b33] px-4 py-2 rounded-full flex items-center gap-2.5 text-[11px] font-bold shadow-sm self-start sm:self-center">
            <Clock className="h-4 w-4 text-[#c59b6d] stroke-[2]" />
            <span>SERVER TIME: 09:42 EST</span>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 - Active Cases */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-36 group hover:shadow-md transition-all">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-3 translate-y-3">
              <Briefcase className="h-32 w-32 text-gray-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex justify-between items-start">
              <div className="bg-[#faf3e8] p-3 rounded-xl border border-[#c59b6d]/20 text-[#c59b6d]">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                +2 TODAY
              </span>
            </div>
            <div className="mt-4">
              <span className="block text-4xl font-serif font-black text-[#0c1b33] leading-none">
                {mockCases.filter(c => c.status === 'Active').length}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mt-1.5">
                Active Cases
              </span>
            </div>
          </div>

          {/* Card 2 - Upcoming Hearings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-36 group hover:shadow-md transition-all">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-3 translate-y-3">
              <Calendar className="h-32 w-32 text-gray-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[#0c1b33]">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider bg-[#faf3e8] text-[#c59b6d] px-2 py-0.5 rounded-full border border-[#c59b6d]/25 uppercase">
                NEXT: 2PM
              </span>
            </div>
            <div className="mt-4">
              <span className="block text-4xl font-serif font-black text-[#0c1b33] leading-none">
                08
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mt-1.5">
                Upcoming Hearings
              </span>
            </div>
          </div>

          {/* Card 3 - Pending Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-36 group hover:shadow-md transition-all">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-3 translate-y-3">
              <CheckCircle2 className="h-32 w-32 text-gray-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex justify-between items-start">
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-[#e05e5e]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider bg-red-100 text-[#e05e5e] px-2 py-0.5 rounded-full uppercase">
                03 URGENT
              </span>
            </div>
            <div className="mt-4">
              <span className="block text-4xl font-serif font-black text-[#0c1b33] leading-none">
                15
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mt-1.5">
                Pending Tasks
              </span>
            </div>
          </div>

        </div>

        {/* Big Focus Case Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-md relative overflow-hidden border-l-4 border-l-[#c59b6d] hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c59b6d]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            
            {/* Left Case Description */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <span className="bg-[#7c631a] text-white px-2.5 py-1 rounded uppercase tracking-wider">
                  IMMEDIATE PRIORITY
                </span>
                <span className="text-gray-400 uppercase tracking-widest">
                  • HEARING IN 4H 18M
                </span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0c1b33] tracking-tight">
                Sterling vs. Global Dynamics Inc.
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl font-medium">
                Preliminary injunction hearing regarding the disclosure of proprietary forensic evidence in the antitrust litigation. Counsel team must finalize defense statements and exhibit submissions before 1:30 PM.
              </p>

              {/* Footer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-xs">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">LOCATION</span>
                  <strong className="block text-gray-800 font-semibold mt-1">Courtroom 4B, 5th Circuit</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">LEAD OPPOSING</span>
                  <strong className="block text-[#e05e5e] font-semibold mt-1">Marcus Vane, Esq.</strong>
                </div>
              </div>
            </div>

            {/* Right Case CTA Buttons */}
            <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0 self-start sm:self-center lg:self-start w-full lg:w-44">
              <button 
                onClick={() => setShowReviewModal(true)}
                className="flex-1 bg-[#0c1b33] hover:bg-[#1a2b47] text-white py-3.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 border-b border-[#c59b6d]/50 cursor-pointer"
              >
                <FileSignature className="h-4 w-4 text-[#c59b6d]" />
                BRIEF REVIEW
              </button>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 bg-white hover:bg-gray-50 text-[#0c1b33] py-3.5 px-4 rounded-xl text-xs font-bold border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="h-4 w-4 text-[#c59b6d]" />
                DIRECTIONS
              </a>
            </div>

          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33] tracking-tight">
              Recent Activity
            </h2>
            <button 
              onClick={(e) => { e.preventDefault(); alert('Querying Case Log databases... System up to date.'); }}
              className="text-[10px] font-extrabold tracking-widest text-[#c59b6d] hover:text-[#c59b6d]/80 uppercase transition-all cursor-pointer"
            >
              VIEW FULL LOG
            </button>
          </div>

          {/* Vertical timeline items */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            
            {/* Activity item 1 */}
            <div className="relative">
              <div className="absolute -left-[22px] top-1 bg-[#faf3e8] border-2 border-white p-1 rounded-full text-[#c59b6d] z-10 flex items-center justify-center">
                <FileBadge className="h-4 w-4" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  Amended Filing Submitted
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  CASE #2024-CIV-882 • 45 MINUTES AGO
                </p>
                
                <div className="inline-flex items-center gap-2.5 bg-[#e9eff7]/50 border border-blue-100/30 rounded-xl px-4 py-2.5 mt-1 text-xs text-[#0c1b33] font-semibold hover:bg-[#e9eff7] transition-all cursor-pointer">
                  <FileDown className="h-4.5 w-4.5 text-[#c59b6d]" />
                  <span className="italic font-medium">motion_to_dismiss_final.pdf</span>
                </div>
              </div>
            </div>

            {/* Activity item 2 */}
            <div className="relative">
              <div className="absolute -left-[22px] top-1 bg-blue-50 border-2 border-white p-1 rounded-full text-[#0c1b33] z-10 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  Client Conference Concluded
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  GLOBAL DYNAMICS LITIGATION • 2 HOURS AGO
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium max-w-xl">
                  Discussed settlement parameters with CEO and general counsel. Draft proposal prepared and reviewed for internal sign-off.
                </p>
              </div>
            </div>

          </div>
        </div>
      </>
    );
  };

  const renderCasesView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33]">Case Records</h2>
            <p className="text-xs text-gray-500 mt-1">Manage and review all your registered legal blueprints.</p>
          </div>
          <button
            onClick={() => setShowFilingModal(true)}
            className="bg-[#0c1b33] text-white hover:bg-[#1a2b47] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-b border-[#c59b6d]/50 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#c59b6d]" /> NEW CASE FILING
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCases.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider ${
                    c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    c.status === 'Adjourned' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{c.caseType}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0c1b33] hover:text-[#c59b6d] cursor-pointer" onClick={() => setSelectedCaseId(c.id)}>
                  {c.nickname}
                </h3>
                <p className="text-xs text-gray-500 font-medium line-clamp-2">{c.description}</p>
                <div className="text-[11px] text-gray-650 bg-gray-50 p-2.5 rounded-xl space-y-1 font-semibold">
                  <div><span className="text-gray-400 font-normal">CNR:</span> {c.cnrNumber}</div>
                  {c.nextHearingDate && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 font-normal">Next Hearing:</span> 
                      <span className="text-[#e05e5e]">{c.nextHearingDate}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{c.courtName}</span>
                <button
                  onClick={() => setSelectedCaseId(c.id)}
                  className="text-xs font-bold text-[#c59b6d] hover:text-[#0c1b33] flex items-center gap-1 transition-all cursor-pointer"
                >
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCaseDetailView = () => {
    const c = mockCases.find(item => item.id === selectedCaseId);
    if (!c) return null;
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCaseId(null)}
          className="text-xs font-bold text-gray-455 hover:text-gray-900 flex items-center gap-1 transition-all cursor-pointer"
        >
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Case List
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#c59b6d] uppercase">{c.caseType} MODULE</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0c1b33] mt-1 leading-tight">{c.nickname}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1.5">{c.title}</p>
                </div>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider ${
                  c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                  c.status === 'Adjourned' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-gray-50 text-xs">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">CNR NUMBER</span>
                  <strong className="block text-gray-800 font-semibold mt-1.5">{c.cnrNumber}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">JURISDICTION</span>
                  <strong className="block text-gray-800 font-semibold mt-1.5">{c.courtName}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">COURT LOCATION</span>
                  <strong className="block text-gray-800 font-semibold mt-1.5">{c.location}</strong>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Case Description</h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">{c.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">OPPOSING COUNSEL</span>
                  <strong className="block text-gray-800 font-semibold mt-1">{c.opposingCounsel}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">LAST BRIEF UPDATE</span>
                  <p className="text-gray-500 font-medium mt-1 leading-relaxed">{c.lastUpdate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#0c1b33]">Hearing & Action History</h3>
              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {c.timeline.map((t, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[22px] top-1 bg-white border-2 p-1 rounded-full z-10 flex items-center justify-center ${
                      t.type === 'hearing' ? 'border-[#c59b6d] text-[#c59b6d]' :
                      t.type === 'document' ? 'border-blue-500 text-blue-500' :
                      'border-gray-400 text-gray-400'
                    }`}>
                      {t.type === 'hearing' ? <Calendar className="h-4.5 w-4.5" /> :
                       t.type === 'document' ? <FileText className="h-4.5 w-4.5" /> :
                       <Clock className="h-4.5 w-4.5" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{t.event}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-[11px] font-extrabold tracking-widest text-[#0c1b33] uppercase">Document Checklist</h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">Ensure required documents are uploaded prior to the next hearing.</p>
              
              <div className="space-y-3 pt-2">
                {c.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100/30">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {doc.status === 'uploaded' ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-gray-700 truncate">{doc.name}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      doc.status === 'uploaded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHearingsCalendarView = () => {
    const calendarDays = [
      { day: 29, isCurrentMonth: false },
      { day: 30, isCurrentMonth: false },
      ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
      { day: 1, isCurrentMonth: false },
      { day: 2, isCurrentMonth: false }
    ];

    return (
      <div className="w-full min-h-[calc(100vh-140px)] select-none">
        {/* Monthly Calendar */}
        <div className="w-full bg-white rounded-3xl border border-gray-150 shadow-sm p-6 flex flex-col justify-between space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="font-serif text-3xl font-extrabold text-[#0B1F3A] tracking-tight">October 2024</h2>
              <p className="text-xs text-[#c59b6d] uppercase font-bold tracking-widest mt-1">Q4 Strategic Litigation Roadmap</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
              {/* Legend */}
              <div className="flex gap-4 items-center mr-2 text-[10px] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full"></span>
                  <span className="text-[#0B1F3A] font-bold">Hearings</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#e05e5e] rounded-full"></span>
                  <span className="text-[#0B1F3A] font-bold">Deadlines</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  <span className="text-[#0B1F3A] font-bold">Court Updates</span>
                </span>
              </div>
              
              {/* Toggles */}
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200">
                <button className="px-4 py-2 bg-white text-[#0B1F3A] rounded-lg shadow-sm font-bold text-[11px] uppercase tracking-wider">Month</button>
                <button className="px-4 py-2 text-gray-500 hover:text-[#0B1F3A] rounded-lg transition-colors font-bold text-[11px] uppercase tracking-wider" onClick={() => alert('Week view integration coming soon.')}>Week</button>
                <button className="px-4 py-2 text-gray-500 hover:text-[#0B1F3A] rounded-lg transition-colors font-bold text-[11px] uppercase tracking-wider" onClick={() => alert('Day view integration coming soon.')}>Day</button>
              </div>
              
              {/* Nav Arrows */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button className="p-2 hover:bg-white text-[#0B1F3A] rounded-lg transition-all cursor-pointer" onClick={() => alert('Viewing September 2024')}>
                  <ArrowRight className="h-4 w-4 rotate-180 text-gray-600 hover:text-[#0B1F3A]" />
                </button>
                <button className="p-2 hover:bg-white text-[#0B1F3A] rounded-lg transition-all cursor-pointer" onClick={() => alert('Viewing November 2024')}>
                  <ArrowRight className="h-4 w-4 text-gray-600 hover:text-[#0B1F3A]" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w, idx) => (
              <div key={idx} className="bg-[#0B1F3A] py-4 text-center text-[11px] font-extrabold tracking-widest text-[#D4AF37] uppercase">
                {w}
              </div>
            ))}

            {calendarDays.map((d, idx) => {
              const event = d.isCurrentMonth ? mockCalendarEvents.find(e => e.day === d.day) : null;
              const isSelected = selectedEvent?.day === d.day && d.isCurrentMonth;
              const isPriority = event?.priority;
              
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (d.isCurrentMonth) {
                      const foundEvent = mockCalendarEvents.find(e => e.day === d.day);
                      setSelectedEvent(foundEvent || null);
                    }
                  }}
                  className={`bg-white min-h-[120px] p-3 flex flex-col justify-between hover:bg-slate-50 transition-all cursor-pointer group relative ${
                    !d.isCurrentMonth ? 'text-gray-300 bg-gray-50/50 pointer-events-none' : 'text-gray-700'
                  } ${isSelected ? 'ring-2 ring-[#D4AF37] ring-inset z-10' : ''} ${
                    isPriority ? 'bg-[#0B1F3A] hover:bg-[#122e54] text-white border border-[#D4AF37]' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[12px] font-black ${isPriority ? 'text-[#D4AF37]' : 'text-[#0B1F3A]'} select-none`}>
                      {d.day}
                    </span>
                    {isPriority && (
                      <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full shadow-sm animate-pulse"></span>
                    )}
                  </div>

                  {event && (
                    <div className="w-full mt-2">
                      {isPriority ? (
                        <div className="p-2.5 rounded-xl bg-[#0B1F3A]/95 border border-[#D4AF37] text-left shadow-md">
                          <span className="text-[8px] font-black text-[#D4AF37] tracking-widest uppercase block mb-0.5">
                            PRIORITY HEARING
                          </span>
                          <span className="text-[10.5px] font-black text-white block truncate">
                            {event.title}
                          </span>
                          <span className="text-[8.5px] text-gray-300 block font-semibold mt-1">
                            {event.details?.hearingTime.split(' - ')[0]} • {event.details?.courtroom}
                          </span>
                        </div>
                      ) : (
                        <div className={`text-[9.5px] font-extrabold uppercase tracking-wider p-2.5 rounded-xl mt-1.5 border-l-2 shadow-sm ${
                          event.color === 'yellow' ? 'bg-[#faf3e8] text-[#7c631a] border-[#D4AF37]' :
                          event.color === 'red' ? 'bg-red-50 text-red-700 border-l-red-500' :
                          'bg-blue-50 text-blue-700 border-l-blue-500'
                        }`}>
                          <div className="text-[7.5px] text-gray-400 font-extrabold tracking-widest uppercase mb-0.5">
                            {event.type === 'court' ? 'COURT UPDATE' : event.type}
                          </div>
                          <div className="truncate font-black">{event.title}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentsView = () => {
    return (
      <div className="space-y-8">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#c59b6d] uppercase">Knowledge Base &gt; Templates</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1b33] tracking-tight mt-1">Document Guidance Center</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-3xl leading-relaxed">
            Access peer-reviewed legal templates, procedural requirements, and filing guidance across major legal domains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mockDocModules.map((m) => {
            const isSelected = selectedDocModule === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedDocModule(m.id)}
                className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-36 group relative ${
                  isSelected ? 'ring-2 ring-[#c59b6d] border-transparent' : 'border-gray-100'
                }`}
              >
                {m.priority && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c59b6d]/5 rounded-full blur-xl pointer-events-none"></div>
                )}
                
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-[#c59b6d] ${
                    isSelected ? 'bg-[#faf3e8] border-[#c59b6d]/30' : 'bg-gray-50 border-gray-100 group-hover:bg-[#faf3e8] transition-colors'
                  }`}>
                    {m.id === 'property' ? <Briefcase className="h-5 w-5" /> :
                     m.id === 'family' ? <Users className="h-5 w-5" /> :
                     m.id === 'consumer' ? <Sun className="h-5 w-5" /> :
                     m.id === 'criminal' ? <AlertCircle className="h-5 w-5" /> :
                     m.id === 'rti' ? <HelpCircle className="h-5 w-5" /> :
                     m.id === 'bail' ? <Lock className="h-5 w-5" /> :
                     <Briefcase className="h-5 w-5" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">{m.title}</h3>
                    <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1">{m.desc}</p>
                  </div>
                </div>

                {m.priority && (
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <span className="text-[8px] font-black bg-[#faf3e8] text-[#c59b6d] px-2 py-0.5 rounded border border-[#c59b6d]/20 uppercase">Priority</span>
                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase">Updated {m.updated}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDocModule === 'bail' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-50">
                <div className="bg-[#faf3e8] p-3 rounded-2xl border border-[#c59b6d]/30 text-[#c59b6d]">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#0c1b33]">Purpose of Bail Applications</h3>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mt-0.5">Procedural Context</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                {mockDocDetail.purpose}
              </p>

              <div className="space-y-3 pt-2">
                {mockDocDetail.objectives.map((o, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-[#c59b6d] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
              <div className="space-y-5">
                <h3 className="text-sm font-serif font-black text-[#0c1b33] uppercase border-b border-gray-50 pb-4 flex items-center justify-between">
                  Template Library
                  <FileDown className="h-4 w-4 text-[#c59b6d]" />
                </h3>

                <div className="space-y-3">
                  {mockDocDetail.templates.map((t, idx) => (
                    <div key={idx} className="bg-gray-50/50 hover:bg-gray-50 p-4 border border-gray-100 rounded-2xl flex items-center justify-between transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-white p-2.5 border border-gray-100 rounded-xl text-gray-400 group-hover:text-[#c59b6d] transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{t.name}</h4>
                          <span className="text-[9px] text-gray-400 block font-semibold mt-1 uppercase tracking-wider">{t.type} • {t.size} • {t.desc}</span>
                        </div>
                      </div>
                      <FileDown className="h-4.5 w-4.5 text-gray-400 group-hover:text-[#c59b6d] transition-colors cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 font-medium shadow-sm">
            Operational details and template library for the <strong className="text-gray-900">{selectedDocModule}</strong> module are being compiled by legal departments.
          </div>
        )}
      </div>
    );
  };

  const renderSettingsView = () => {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33]">System Settings</h2>
        <p className="text-xs text-gray-500 font-medium">Configure Counselor Workspace preferences, notifications, and security keys.</p>
        <div className="border-t border-gray-50 pt-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-700">Dark Mode</span>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="bg-gray-100 px-4 py-2 rounded-xl font-bold border border-gray-200 cursor-pointer">
              {isDarkMode ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportView = () => {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33]">Counsel Support Center</h2>
        <p className="text-xs text-gray-500 font-medium">Need help with digital filing or case syncing? Submit a query to the CaseWatch Technical Desk.</p>
        <div className="border-t border-gray-50 pt-6">
          <p className="text-xs text-[#c59b6d] font-bold uppercase tracking-wider">Contact Email: tech-support@casewatch.in</p>
        </div>
      </div>
    );
  };

  const renderResearchView = () => {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33]">Legal Research Center</h2>
        <p className="text-xs text-gray-500 font-medium">Search precedents, statutes, and judge analytics across all jurisdictions.</p>
        <div className="border-t border-gray-50 pt-6">
          <p className="text-xs text-[#c59b6d] font-bold uppercase tracking-wider">Feature coming soon in Next Release</p>
        </div>
      </div>
    );
  };

  const renderAnalyticsView = () => {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-extrabold text-[#0c1b33]">Litigation Analytics & Insights</h2>
        <p className="text-xs text-gray-500 font-medium">Track your win-rates, disposal times, and hearing frequencies.</p>
        <div className="border-t border-gray-50 pt-6">
          <p className="text-xs text-[#c59b6d] font-bold uppercase tracking-wider">Feature coming soon in Next Release</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex bg-[#f5f7fa] font-sans selection:bg-[#c59b6d] selection:text-[#0c1b33] ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : ''}`}>
      
      {/* 1. LEFT SIDEBAR (NAVIGATION PANEL) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c1b33] text-[#8c9eb9] flex flex-col justify-between transition-transform duration-300 border-r border-[#1a2b47] transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Brand Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#1a2b47]">
            <div className="flex items-center gap-3">
              <div className="bg-[#1a2b47] p-2 rounded-xl text-[#ffffff] flex items-center justify-center border border-[#c59b6d]/30">
                <Scale className="h-5.5 w-5.5 text-[#c59b6d] stroke-[1.8]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#ffffff]">
                  CaseWatch
                </span>
                <span className="block text-[8px] tracking-[0.2em] text-[#c59b6d] font-bold uppercase -mt-0.5">
                  Counselor Space
                </span>
              </div>
            </div>
            
            {/* Close Sidebar Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#1a2b47] text-[#ffffff]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'cases', label: 'Cases', icon: Briefcase },
              { id: 'timeline', label: 'Timeline', icon: Clock, link: '/timeline' },
              { id: 'hearings', label: 'Hearings', icon: Calendar },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'research', label: 'Research', icon: Globe },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNav === item.id;
              if (item.link) {
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all group hover:bg-[#1a2b47]/50 hover:text-[#ffffff]"
                  >
                    <IconComponent className="h-4.5 w-4.5 text-[#8c9eb9] group-hover:text-[#ffffff]" />
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive 
                      ? 'bg-[#1a2b47] text-[#ffffff] border-l-4 border-[#c59b6d] pl-3.5 shadow-md shadow-black/10' 
                      : 'hover:bg-[#1a2b47]/50 hover:text-[#ffffff]'
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#c59b6d]' : 'text-[#8c9eb9] group-hover:text-[#ffffff]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1a2b47] space-y-4">
          {/* New Case Filing CTA Button */}
          <button
            onClick={() => setShowFilingModal(true)}
            className="w-full bg-[#f8d488] hover:bg-[#f6c96b] text-[#0c1b33] font-bold py-3.5 px-4 rounded-xl text-xs shadow-md border-b-2 border-[#c59b6d] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            NEW CASE FILING
          </button>

          <div className="space-y-1.5">
            <button 
              onClick={() => setActiveNav('settings')} 
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#1a2b47] hover:text-[#ffffff] transition-all"
            >
              <Settings className="h-4 w-4" />
              SETTINGS
            </button>
            <button 
              onClick={() => setActiveNav('support')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#1a2b47] hover:text-[#ffffff] transition-all"
            >
              <HelpCircle className="h-4 w-4" />
              SUPPORT
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#0c1b33]/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* 2. CENTRAL OPERATIONAL PANEL */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          {/* Left: Mobile menu triggers & search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Global Search */}
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Global Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-gray-100 bg-[#f5f7fa] rounded-xl focus:outline-none focus:border-[#c59b6d] focus:bg-white transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-transparent h-20 items-center pl-4">
              <button
                onClick={() => setActiveTab('finder')}
                className={`text-xs font-bold uppercase tracking-wider relative h-full flex items-center transition-all ${
                  activeTab === 'finder' ? 'text-[#c59b6d]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Case Finder
                {activeTab === 'finder' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c59b6d] rounded-t-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`text-xs font-bold uppercase tracking-wider relative h-full flex items-center transition-all ${
                  activeTab === 'global' ? 'text-[#c59b6d]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Global Search
                {activeTab === 'global' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c59b6d] rounded-t-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Right: Actions and User details */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-[#f5f7fa] text-gray-400 hover:text-gray-600 transition-colors"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button className="p-2.5 rounded-xl hover:bg-[#f5f7fa] text-gray-400 hover:text-gray-600 relative transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#e05e5e] rounded-full border border-white"></span>
            </button>
            <button className="p-2.5 rounded-xl hover:bg-[#f5f7fa] text-gray-400 hover:text-gray-600 transition-colors">
              <History className="h-4.5 w-4.5" />
            </button>

            {/* Mobile Right drawer trigger */}
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <AlertCircle className="h-5.5 w-5.5 text-[#e05e5e]" />
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-3 border-l border-gray-100 pl-4 relative" ref={profileDropdownRef}>
              <div className="text-right hidden md:block select-none">
                <span className="block text-xs font-bold text-gray-900 leading-none">
                  {user?.name || mockUser.name}
                </span>
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mt-1 font-semibold">
                  {user?.role || mockUser.role}
                </span>
              </div>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-xl"
                title="Account Options"
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                {user?.avatar || mockUser.avatar ? (
                  <img
                    src={user?.avatar || mockUser.avatar}
                    alt={`${user?.name || mockUser.name} Profile`}
                    className="w-10 h-10 rounded-xl object-cover border border-[#c59b6d]/30 group-hover:border-[#c59b6d] transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#0c1b33] text-[#D4AF37] border border-[#c59b6d]/30 flex items-center justify-center font-bold font-serif text-sm group-hover:border-[#c59b6d] transition-all">
                    {(user?.name || mockUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 top-full mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700 shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ${
                  showProfileDropdown
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                {/* Header: User Info Card */}
                <div className="p-5 bg-gradient-to-br from-[#0c1b33] to-[#1a2b47] text-white flex items-center gap-4">
                  {user?.avatar || mockUser.avatar ? (
                    <img
                      src={user?.avatar || mockUser.avatar}
                      alt={user?.name || mockUser.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#1a2b47] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-bold font-serif text-lg">
                      {(user?.name || mockUser.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-0.5 text-left">
                    <h4 className="font-serif text-sm font-bold text-white tracking-tight leading-tight">
                      {user?.name || mockUser.name}
                    </h4>
                    <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                      {user?.role || mockUser.role}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-4 text-xs font-semibold text-gray-650 dark:text-slate-350 text-left">
                  {/* Email Detail */}
                  <div className="space-y-1">
                    <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Email Address</span>
                    <span className="text-[#0c1b33] dark:text-white font-bold block truncate">{user?.email || mockUser.email}</span>
                  </div>

                  {/* Member Since Detail */}
                  <div className="space-y-1">
                    <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Member Since</span>
                    <span className="text-[#0c1b33] dark:text-white font-bold block">
                      {new Date(user?.created_at || user?.createdAt || mockUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Auth Provider Detail */}
                  <div className="space-y-1">
                    <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Authentication Provider</span>
                    <span className="inline-block mt-1">
                      {user?.is_demo ? (
                        <span className="px-2.5 py-1 text-[8.5px] font-black rounded-lg uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                          Demo Access (Mock Data)
                        </span>
                      ) : user?.google_id ? (
                        <span className="px-2.5 py-1 text-[8.5px] font-black rounded-lg uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                          Google OAuth 2.0
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[8.5px] font-black rounded-lg uppercase tracking-wider bg-gray-150 text-gray-700 border border-gray-200">
                          Email & Password
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions: Logout Button */}
                <div className="p-4 bg-gray-50 dark:bg-slate-750 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs shadow-sm shadow-red-200/50 dark:shadow-none transition-all cursor-pointer border-0 animate-pulse-subtle"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Central Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {activeNav === 'dashboard' && renderDashboardOverview()}
          {activeNav === 'cases' && (selectedCaseId === null ? renderCasesView() : renderCaseDetailView())}
          {activeNav === 'hearings' && renderHearingsCalendarView()}
          {activeNav === 'documents' && renderDocumentsView()}
          {activeNav === 'research' && renderResearchView()}
          {activeNav === 'analytics' && renderAnalyticsView()}
          {activeNav === 'settings' && renderSettingsView()}
          {activeNav === 'support' && renderSupportView()}

        </main>
      </div>

      {/* 3. RIGHT SIDEBAR (SIDEBAR INTELLIGENCE) */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-80 bg-[#ebf1f9] border-l border-gray-100 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:flex`}>
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-8">
          {activeNav === 'hearings' ? (
            /* Render Hearing Details Panel or Placeholder Inside Right Sidebar */
            selectedEvent && selectedEvent.details ? (
              <div className="space-y-6 flex-1 animate-in fade-in duration-200 text-xs">
                {/* Header Info */}
                <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-1 text-[8.5px] font-black rounded-lg uppercase tracking-wider ${
                      selectedEvent.details.priorityLevel === 'Urgent' ? 'bg-red-100 text-red-700 border border-red-200' :
                      selectedEvent.details.priorityLevel === 'High' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-105'
                    }`}>
                      {selectedEvent.details.priorityLevel} Priority
                    </span>
                    <h3 className="font-serif text-base font-black text-[#0B1F3A] mt-2 leading-snug">
                      {selectedEvent.details.caseName}
                    </h3>
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">
                      CNR: {selectedEvent.details.caseNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                    title="Clear Selection"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Court Details Grid */}
                <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl p-4 space-y-3 font-semibold text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Jurisdiction</span>
                      <span className="text-gray-800 font-bold block mt-0.5">{selectedEvent.details.courtName}</span>
                    </div>
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Judge</span>
                      <span className="text-gray-800 font-bold block mt-0.5">{selectedEvent.details.judgeName}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-gray-100">
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Hearing Date</span>
                      <span className="text-gray-800 font-bold block mt-0.5">{selectedEvent.details.hearingDate}</span>
                      <span className="text-[#c59b6d] text-[10px] block font-bold mt-0.5">{selectedEvent.details.hearingTime}</span>
                    </div>
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Courtroom</span>
                      <span className="text-gray-800 font-bold block mt-0.5">{selectedEvent.details.courtroom}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-gray-100">
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Status</span>
                      <span className="text-emerald-600 font-bold block mt-0.5">{selectedEvent.details.status}</span>
                    </div>
                    <div>
                      <span className="block text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider">Case Stage</span>
                      <span className="text-gray-800 font-bold block mt-0.5">{selectedEvent.details.caseStage}</span>
                    </div>
                  </div>
                </div>

                {/* Case Stage Timeline Progress */}
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-bold">Case Progress Timeline</span>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-150">
                    {[
                      "Case Filed",
                      "Notice Issued",
                      "First Hearing",
                      "Evidence Stage",
                      "Arguments",
                      "Judgment"
                    ].map((stage, sIdx, timelineStages) => {
                      const currentIdx = timelineStages.indexOf(selectedEvent.details.timelineStage);
                      const isPassed = sIdx <= currentIdx;
                      const isCurrent = sIdx === currentIdx;
                      
                      return (
                        <div key={stage} className="relative flex items-center gap-2">
                          <div className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white z-10 transition-colors ${
                            isCurrent ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/35 bg-[#D4AF37]' :
                            isPassed ? 'border-[#D4AF37] bg-[#D4AF37]' :
                            'border-gray-300'
                          }`}></div>
                          <span className={`text-[11px] font-bold block transition-colors ${
                            isCurrent ? 'text-[#D4AF37] font-black' :
                            isPassed ? 'text-[#0B1F3A]' :
                            'text-gray-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Documents Checklist */}
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-bold">Required Documents</span>
                  <div className="space-y-2">
                    {selectedEvent.details.documents.map((doc, dIdx) => (
                      <div key={dIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100/30">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={doc.checked}
                            readOnly
                            className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-3.5 w-3.5 cursor-not-allowed"
                          />
                          <span className="text-xs font-semibold text-gray-700 truncate">{doc.label}</span>
                        </div>
                        <span className={`text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                          doc.checked ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {doc.checked ? '✓ Ready' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Sections */}
                <div className="space-y-4">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-bold">Hearing Directives & Notes</span>
                  
                  {/* Lawyer Notes */}
                  <div className="bg-amber-50/45 border border-amber-100/60 rounded-xl p-3.5 text-xs font-medium leading-relaxed">
                    <span className="block text-[8px] text-[#7c631a] font-extrabold uppercase tracking-wider mb-1">Lawyer Notes</span>
                    <p className="text-gray-650 italic font-semibold">{selectedEvent.details.notes.lawyerNotes}</p>
                  </div>

                  {/* Personal Notes */}
                  <div className="bg-[#f4f7fa] border border-[#0B1F3A]/10 rounded-xl p-3.5 text-xs font-medium leading-relaxed">
                    <span className="block text-[8px] text-[#0B1F3A] font-extrabold uppercase tracking-wider mb-1">Personal Notes</span>
                    <p className="text-gray-650 font-semibold">{selectedEvent.details.notes.personalNotes}</p>
                  </div>

                  {/* Previous Summary */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs font-medium leading-relaxed">
                    <span className="block text-[8px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Previous Summary</span>
                    <p className="text-gray-500 font-semibold">{selectedEvent.details.notes.previousSummary}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-bold">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => alert('Reminder added successfully.')}
                      className="py-2.5 px-3 bg-[#0B1F3A] hover:bg-[#122e54] text-white text-[10px] font-bold rounded-xl shadow-sm transition-all cursor-pointer text-center"
                    >
                      Add Reminder
                    </button>
                    <button 
                      onClick={() => alert('Downloading court notice...')}
                      className="py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Download Notice
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => { setSelectedCaseId(1); setActiveNav('cases'); }}
                      className="py-2.5 w-full bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-amber-50/30 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      View Full Case
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => { const note = prompt('Enter personal note:'); if (note) alert('Note saved.'); }}
                      className="py-2.5 w-full bg-gray-50 hover:bg-gray-100 text-gray-650 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Add Notes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto select-none animate-in fade-in duration-200">
                <div className="bg-[#faf3e8] border border-[#D4AF37]/25 p-5 rounded-full text-[#D4AF37] flex items-center justify-center shadow-inner">
                  <Scale className="h-10 w-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-[#0B1F3A] font-extrabold text-sm">Select Hearing Date</h4>
                  <p className="text-[11px] text-gray-400 font-semibold max-w-[200px] leading-relaxed mx-auto">
                    Select a hearing date to view details.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* Render Standard Sidebar Content for All Other Pages */
            <>
              {/* Header Mobile Close button */}
              <div className="lg:hidden flex items-center justify-between border-b border-gray-200/50 pb-3">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Alerts & Info</span>
                <button
                  onClick={() => setIsRightPanelOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Upcoming Deadlines */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-extrabold tracking-widest text-[#0c1b33] uppercase">
                    Upcoming Deadlines
                  </h3>
                  <span className="text-[10px] font-black bg-[#e05e5e] text-white px-2 py-0.5 rounded uppercase">
                    3 Urgent
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Response to Discovery', subtitle: 'CASE #441-A', time: 'IN 2 HOURS', urgent: true },
                    { title: 'Expert Witness List', subtitle: 'DOE VS. STATE', time: 'TOMORROW', urgent: false },
                    { title: 'Statute Filing Date', subtitle: 'MILLER TRUST', time: 'OCT 21', urgent: false }
                  ].map((deadline, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                      {deadline.urgent && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#e05e5e]"></div>
                      )}
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">
                        {deadline.title}
                      </h4>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                          {deadline.subtitle}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider ${deadline.urgent ? 'text-[#e05e5e]' : 'text-gray-500'}`}>
                          {deadline.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Notes Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-extrabold tracking-widest text-[#0c1b33] uppercase flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5 text-[#c59b6d]" />
                    Quick Notes
                  </h3>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-60 overflow-hidden">
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setIsSaving(true);
                    }}
                    placeholder="Draft a thought, case reference, or note here..."
                    className="w-full flex-1 p-4 text-xs font-medium text-gray-600 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
                  ></textarea>
                  
                  <div className="px-4 py-3 bg-[#fafbfc] border-t border-gray-100 flex items-center justify-between">
                    {/* Dots indicator */}
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#c59b6d] rounded-full"></span>
                      <span className="w-2.5 h-2.5 bg-[#e05e5e] rounded-full"></span>
                      <span className="w-2.5 h-2.5 bg-gray-200 rounded-full"></span>
                    </div>
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                      {isSaving ? 'SAVING...' : `AUTO-SAVED ${saveTime}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Firm Intelligence Alert */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-extrabold tracking-widest text-[#0c1b33] uppercase">
                  Firm Intelligence
                </h3>
                
                <div className="bg-[#0c1b33] text-white rounded-2xl p-5 border border-[#c59b6d]/20 relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-3 translate-y-3">
                    <Scale className="h-28 w-28 text-white" />
                  </div>
                  
                  <span className="text-[9px] font-extrabold text-[#c59b6d] uppercase tracking-wider block mb-2">
                    POLICY UPDATE: REMOTE FILINGS
                  </span>
                  <p className="text-[10px] text-[#8c9eb9] leading-relaxed font-semibold mb-4">
                    The Clerk's office has updated the digital submission portal protocol as of 9AM today.
                  </p>
                  
                  <a 
                    href="#read-detail" 
                    onClick={(e) => { e.preventDefault(); alert('CaseWatch Policy Document v2.4 loaded.'); }}
                    className="text-[10px] font-extrabold text-[#c59b6d] hover:text-[#f8d488] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                  >
                    READ DETAIL
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Right Drawer Backdrop for Mobile */}
      {isRightPanelOpen && (
        <div 
          onClick={() => setIsRightPanelOpen(false)}
          className="fixed inset-0 bg-[#0c1b33]/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* ==============================================================
          MODAL INTERFACES (FILING & BRIEF REVIEW)
          ============================================================== */}

      {/* A. NEW CASE FILING MODAL */}
      {showFilingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#0c1b33]/85 backdrop-blur-sm" onClick={() => setShowFilingModal(false)}></div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl relative z-10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1b33] text-white px-6 py-5 border-b border-[#1a2b47] flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#c59b6d]" />
                Register New Case Filing
              </h3>
              <button 
                onClick={() => setShowFilingModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#1a2b47] text-[#8c9eb9] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCase} className="p-6 space-y-4 text-xs text-[#0c1b33]">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Case Number / Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WP(C) 1240/2026"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c59b6d]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Court Jurisdiction
                </label>
                <select
                  value={newCourtName}
                  onChange={(e) => setNewCourtName(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c59b6d] bg-white font-medium"
                >
                  <option>Supreme Court of India</option>
                  <option>Delhi High Court</option>
                  <option>Patiala House District Court</option>
                  <option>Bombay High Court</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Litigation Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c59b6d] bg-white font-medium"
                >
                  <option>Hearing Stage</option>
                  <option>Under Review</option>
                  <option>Interim Orders</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilingModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 px-4 rounded-xl text-center transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0c1b33] hover:bg-[#1a2b47] text-white font-bold py-3.5 px-4 rounded-xl text-center border-b border-[#c59b6d] shadow-sm transition-all"
                >
                  REGISTER CASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. BRIEF REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#0c1b33]/85 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl relative z-10 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0c1b33] text-white px-6 py-5 border-b border-[#1a2b47] flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-[#c59b6d]" />
                Brief Case Review: Sterling vs. GDI
              </h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#1a2b47] text-[#8c9eb9] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs text-[#0c1b33] leading-relaxed">
              <div className="bg-[#f5f7fa] p-4 rounded-2xl border border-gray-100">
                <span className="text-[9px] font-extrabold text-[#c59b6d] uppercase tracking-wider block mb-1">CURRENT STANDING</span>
                <p className="font-medium text-gray-700">
                  Global Dynamics Inc. is accused of monopolistic practices in anti-trust filings. Sterling Corp seeks an immediate injunction.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-gray-800 uppercase tracking-wider">Operational Directives:</h4>
                <ul className="space-y-2 font-medium text-gray-600 list-disc pl-4">
                  <li>Injunction hearing scheduled at Courtroom 4B, 5th Circuit under Judge M. Harrison.</li>
                  <li>Marcus Vane (Opposing Counsel) filed a supplemental response arguing jurisdictional boundaries.</li>
                  <li>Exhibit 4 (Forensic Account Audits) must be cross-referenced against original ledgers.</li>
                </ul>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <a
                  href="/api/me" // Mock path to test download trigger
                  onClick={(e) => { e.preventDefault(); alert('Downloading Case Brief PDF Bundle...'); }}
                  className="flex-1 bg-white hover:bg-gray-50 text-[#0c1b33] font-bold py-3.5 px-4 rounded-xl text-center border border-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <FileDown className="h-4.5 w-4.5 text-[#c59b6d]" />
                  DOWNLOAD BRIEF
                </a>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-[#0c1b33] hover:bg-[#1a2b47] text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
