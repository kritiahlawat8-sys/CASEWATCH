/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  FileText, 
  User, 
  Home, 
  Globe, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  Menu, 
  X, 
  Send,
  HelpCircle,
  AlertCircle,
  Bell,
  AlertTriangle
} from 'lucide-react'

// Sample guides data for the interactive widget
const SAMPLE_GUIDES = [
  {
    id: 'passport',
    title: 'Apply for Passport (Fresh)',
    icon: User,
    time: '2 - 4 weeks',
    cost: '₹1,500',
    difficulty: 'Medium',
    steps: [
      {
        title: 'Register & Fill Online Form',
        duration: '30 mins',
        cost: 'Free',
        location: 'Passport Seva Online Portal',
        description: 'Create an account on the official Passport Seva Portal, log in, and fill out the online application form with precise personal details.',
        checklist: [
          'Register at passportindia.gov.in',
          'Fill out personal & family information',
          'Provide references of two local citizens',
          'Review details carefully before final submission'
        ],
        documents: ['None required online (input details only)']
      },
      {
        title: 'Book Appointment Slot',
        duration: '15 mins',
        cost: '₹1,500 (Normal fee)',
        location: 'Online Payment Gateway',
        description: 'Pay the mandatory fee online to unlock appointment booking. Choose your nearest Passport Seva Kendra (PSK) and book a convenient slot.',
        checklist: [
          'Select "Pay and Schedule Appointment"',
          'Pay via Netbanking, Credit/Debit card, or UPI',
          'Select PSK/POPSK regional office',
          'Download and print the Appointment Receipt'
        ],
        documents: ['Online Payment Confirmation / Printout']
      },
      {
        title: 'Gather Core Documents',
        duration: '1 - 2 days',
        cost: 'Varies',
        location: 'Home / Digilocker',
        description: 'Collect all required original documents. Having these organized beforehand is the number one way to prevent rejection.',
        checklist: [
          'Proof of Address (Aadhaar, utility bill, or bank passbook)',
          'Proof of Date of Birth (Birth certificate or Matriculation certificate)',
          'Non-ECR proof (if applicable: 10th standard pass certificate)',
          'Arrange one set of self-attested photocopies of all documents'
        ],
        documents: ['Aadhaar Card', '10th Marksheet/Birth Certificate', 'Printed PSK receipt']
      },
      {
        title: 'Visit Passport Seva Kendra (PSK)',
        duration: '2 - 3 hours',
        cost: 'Free',
        location: 'Selected PSK Office',
        description: 'Arrive 15 minutes before your scheduled slot. Walk through the counters for document scanning, biometrics, and interview with granting officers.',
        checklist: [
          'Show appointment receipt at entry gate',
          'Proceed to Counter A: Biometrics, photo, and document scanning',
          'Proceed to Counter B: Original document verification by Verification Officer',
          'Proceed to Counter C: Interview with Granting Officer',
          'Collect the Exit Slip'
        ],
        documents: ['All original documents', 'PSK Entry token (issued at gate)']
      },
      {
        title: 'Police Verification',
        duration: '3 - 10 days',
        cost: 'Free (Do not pay bribe)',
        location: 'Local Police Station',
        description: 'A local police officer from your station will visit your registered address, or contact you to visit the station, to confirm your residence status and criminal record check.',
        checklist: [
          'Receive call/visit from the verification officer',
          'Present originals and copies of residence proof',
          'Get statements signed by two neighbors acting as witnesses',
          'Ensure the status updates to "Clear" online'
        ],
        documents: ['Landlord NOC (if renting)', 'Neighbor ID copies', 'Aadhaar Card']
      },
      {
        title: 'Collect Passport',
        duration: '3 - 5 days',
        cost: 'Free',
        location: 'Registered Home Address',
        description: 'Your passport is printed, laminated, and dispatched via Speed Post. It will only be handed over to you or a close family member with authorization.',
        checklist: [
          'Track Speed Post tracking number via SMS',
          'Remain present at home or authorize a relative',
          'Show identification to postman',
          'Inspect the passport for spelling accuracy'
        ],
        documents: ['Aadhaar or Voter ID of receiver']
      }
    ]
  },
  {
    id: 'aadhar',
    title: 'Update Aadhaar Address',
    icon: FileText,
    time: '3 - 7 days',
    cost: '₹50',
    difficulty: 'Easy',
    steps: [
      {
        title: 'Log in to MyAadhaar Portal',
        duration: '5 mins',
        cost: 'Free',
        location: 'UIDAI online portal',
        description: 'Log in using your Aadhaar number and the one-time password (OTP) sent to your registered mobile number.',
        checklist: [
          'Visit myaadhaar.uidai.gov.in',
          'Enter 12-digit Aadhaar number',
          'Complete Captcha and click Send OTP',
          'Input OTP and log in'
        ],
        documents: ['Aadhaar Card (Registered Mobile Number must be active)']
      },
      {
        title: 'Initiate Address Update',
        duration: '10 mins',
        cost: 'Free',
        location: 'UIDAI portal dashboard',
        description: 'Select "Address Update" from the services panel, choose "Update Aadhaar Online", and enter your new residential details.',
        checklist: [
          'Select "Address Update" -> "Update Aadhaar Online"',
          'Read instructions and proceed',
          'Fill in correct C/O (Care Of) details',
          'Enter the exact new address fields (PIN, State, District, Area, Building)'
        ],
        documents: ['None (input step)']
      },
      {
        title: 'Upload Address Proof',
        duration: '10 mins',
        cost: 'Free',
        location: 'UIDAI document upload',
        description: 'Select a valid supporting address document from the drop-down menu and upload a clear, scanned image or PDF copy.',
        checklist: [
          'Select proof type (e.g., Rent Agreement, Passport, Bank Statement, electricity bill)',
          'Ensure document is in your name and lists the exact new address',
          'Upload PDF or JPEG (under 2MB)',
          'Review the preview of your details'
        ],
        documents: ['Scanned copy of proof (e.g. Registered Rent Agreement/Voter ID/Electricity Bill)']
      },
      {
        title: 'Pay Processing Fee',
        duration: '5 mins',
        cost: '₹50',
        location: 'UIDAI Payment Gateway',
        description: 'Pay the non-refundable online processing fee of ₹50 using credit/debit cards, UPI, or Net Banking.',
        checklist: [
          'Choose payment merchant (PayU or Razorpay)',
          'Complete the transaction of ₹50',
          'Download the Acknowledgement Slip containing the Service Request Number (SRN)',
          'Save SRN to track update status'
        ],
        documents: ['Online Payment receipt']
      },
      {
        title: 'Track & Download Update',
        duration: '3 - 7 days',
        cost: 'Free',
        location: 'UIDAI online',
        description: 'UIDAI backend verification officers check the uploaded document. Once approved, the database updates and your new E-Aadhaar is ready.',
        checklist: [
          'Check status every 2 days using the SRN',
          'Wait for "Your Aadhaar has been updated" confirmation',
          'Download e-Aadhaar PDF from portal',
          'Unlock using password (first 4 letters of name in CAPITAL + year of birth)'
        ],
        documents: ['SRN number']
      }
    ]
  },
  {
    id: 'rent',
    title: 'Draft & Execute Rent Agreement',
    icon: Home,
    time: '2 - 3 days',
    cost: '₹300 - ₹800',
    difficulty: 'Medium',
    steps: [
      {
        title: 'Negotiate Terms & Draft Content',
        duration: '1 day',
        cost: 'Free',
        location: 'Mutual discussions',
        description: 'Landlord and tenant agree on primary terms: monthly rent, security deposit, lock-in period, maintenance, and rules for pets/renovations.',
        checklist: [
          'Confirm rent amount, due date, and late fees',
          'Agree on security deposit amount (typically 2-6 months rent)',
          'Set agreement duration (usually 11 months to avoid compulsory registration laws)',
          'Specify notice period (normally 1 or 2 months)'
        ],
        documents: ['Owner ID & Address Proof', 'Tenant ID & Address Proof']
      },
      {
        title: 'Finalize Draft Clauses',
        duration: '2 hours',
        cost: 'Free',
        location: 'Drafting tool / Word Processor',
        description: 'Draft the agreement incorporating all terms. Include standard clauses for termination, maintenance responsibilities, and dispute resolution.',
        checklist: [
          'Input names, parents\' names, and permanent addresses of both parties',
          'Specify rent escalation clause (typically 5-10% renewal increase)',
          'List items/appliances provided in the flat',
          'Detail who pays utilities (Water, Electricity, Society maintenance)'
        ],
        documents: ['Draft text template']
      },
      {
        title: 'Purchase Stamp Paper',
        duration: '2 hours',
        cost: '₹100 - ₹500',
        location: 'Licensed Stamp Vendor / Online e-Stamp',
        description: 'Purchase non-judicial stamp paper of appropriate value from a licensed vendor or state e-stamping portal.',
        checklist: [
          'Determine required stamp value (usually ₹100 or ₹200 for 11-month leases)',
          'Purchase e-stamp paper online or buy physical stamp from court/vendor',
          'Ensure the stamp paper lists the landlord or tenant as the first party'
        ],
        documents: ['Stamp duty fee', 'Identifier names']
      },
      {
        title: 'Print, Sign, and Witness',
        duration: '1 hour',
        cost: 'Free',
        location: 'Home / Office',
        description: 'Print the agreement text onto the stamp paper (and adjoining green ledger sheets). Both parties and two witnesses sign to finalize execution.',
        checklist: [
          'Print agreement text on stamp paper and additional pages',
          'Landlord and Tenant sign the bottom of every single page',
          'Two witnesses sign the signature block with names and addresses',
          'Self-attest Aadhaar copies of all signees'
        ],
        documents: ['Printed Agreement', 'Aadhaar of parties & witnesses']
      },
      {
        title: 'Notarization (Highly Recommended)',
        duration: '1 hour',
        cost: '₹100 - ₹200',
        location: 'Notary Public Office / Court',
        description: 'Take the signed agreement to a registered Notary Public who will verify identities and stamp the document, lending it legal credibility.',
        checklist: [
          'Visit notary booth near local court',
          'Present parties or signed document with witnesses\' IDs',
          'Notary stamps the agreement and records it in their ledger register',
          'Affix notary stamp and notary registration stickers'
        ],
        documents: ['Signed Agreement', 'ID proofs of parties']
      }
    ]
  }
];

const CATEGORIES = [
  {
    title: "Identity Documents",
    count: "12 Guides",
    description: "Passports, Aadhaar updates, PAN cards, Voter ID corrections, and Driver's Licenses.",
    icon: User,
    color: "bg-blue-50 text-blue-800 border-blue-100"
  },
  {
    title: "Legal Affidavits",
    count: "8 Guides",
    description: "Name changes, income proofs, gap certificates, single-status, and custom stamp declarations.",
    icon: FileText,
    color: "bg-amber-50 text-amber-800 border-amber-100"
  },
  {
    title: "Property & Rent",
    count: "6 Guides",
    description: "Rent agreements, police verification of tenants, sale deeds, lease renewals, and NOCs.",
    icon: Home,
    color: "bg-emerald-50 text-emerald-800 border-emerald-100"
  },
  {
    title: "RTI & Govt Requests",
    count: "10 Guides",
    description: "Right to Information applications, municipal complaints, birth/death records, and FIR copies.",
    icon: Globe,
    color: "bg-purple-50 text-purple-800 border-purple-100"
  }
];

const POPULAR_SEARCHES = [
  { term: "CRL/2024/004521", id: "crl-4521" },
  { term: "LPA/2023/008912", id: "lpa-8912" },
  { term: "W.P.(C)/2024/001140", id: "wp-1140" }
];

function LandingPage() {
  const { user, logout } = useAuth();
  // Scroll Y tracker for the dark viewport overlay
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
    }
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Demo Widget states (Case Tracker Preview)
  const [caseSearchNumber, setCaseSearchNumber] = useState('CRL/2024/004521');
  const [showCaseResult, setShowCaseResult] = useState(false);

  // Early Access Email Sign-up state
  const [email, setEmail] = useState('');
  const [signupSubmitted, setSignupSubmitted] = useState(false);

  // Click outside search suggestions handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle hero search click
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchSelection(searchQuery);
    } else {
      handleSearchSelection('CRL/2024/004521');
    }
  };

  const handleSearchSelection = (term) => {
    setCaseSearchNumber(term);
    setShowCaseResult(true);
    setShowSuggestions(false);
    setSearchQuery('');
    
    // Scroll to interactive widget with a neat offset
    const widgetSection = document.getElementById('interactive-demo');
    if (widgetSection) {
      widgetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredSuggestions = POPULAR_SEARCHES.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSignupSubmitted(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  // Calculate overlay values based on scroll
  const overlayProgress = Math.min(1, scrollY / 80);
  const overlayOpacity = 1 - overlayProgress;

  // Reduced motion support
  const isAnimated = !reduceMotion;

  // 1. Heading Style (disabled scroll-driven animation)
  const headingStyle = {};

  // 2. Navbar Style (disabled scroll-driven animation)
  const navbarStyle = {};

  // 3. Hero Other elements Style (disabled scroll-driven animation)
  const heroOtherStyle = {};

  // 4. Rest of website Style (disabled scroll-driven animation)
  const restOfSiteStyle = {};

  return (
    <>
      <div className="min-h-screen bg-cream font-sans flex flex-col antialiased selection:bg-tan selection:text-primary-dark">
      <div className="h-2 w-full wood-gradient-line shadow-sm"></div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-primary/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Wordmark */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="bg-primary hover:bg-primary-light transition-all p-2.5 rounded-lg text-cream flex items-center justify-center shadow-md shadow-primary/20 border border-wood/30">
                <Scale className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                  CaseWatch
                </span>
                <span className="block text-[10px] tracking-[0.15em] text-wood font-medium uppercase font-sans -mt-1">
                  Legal Intelligence
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#how-it-works" 
                onClick={() => setActiveNav('how-it-works')}
                className={`text-sm font-medium transition-colors hover:text-wood ${activeNav === 'how-it-works' ? 'text-wood font-semibold' : 'text-primary/85'}`}
              >
                How It Works
              </a>
              <a 
                href="#browse-guides" 
                onClick={() => setActiveNav('browse-guides')}
                className={`text-sm font-medium transition-colors hover:text-wood ${activeNav === 'browse-guides' ? 'text-wood font-semibold' : 'text-primary/85'}`}
              >
                Browse Guides
              </a>
              <a 
                href="#about" 
                onClick={() => setActiveNav('about')}
                className={`text-sm font-medium transition-colors hover:text-wood ${activeNav === 'about' ? 'text-wood font-semibold' : 'text-primary/85'}`}
              >
                About Mission
              </a>
            </nav>

            {/* Desktop Action */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-xs text-primary/65 font-medium truncate max-w-[130px]" title={user.email}>
                    Welcome, {user.email.split('@')[0]}
                  </span>
                  <Link 
                    to="/dashboard"
                    className="text-xs font-semibold text-primary hover:text-wood px-4 py-2 transition-all border border-[#101B33]/15 rounded-xl hover:border-[#a67c52]"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="bg-primary hover:bg-[#1B2A4A] text-cream px-5 py-2.5 rounded-xl text-xs font-medium shadow-md border-b-2 border-[#a67c52]/50 active:translate-y-[1px] transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-xs font-semibold text-primary hover:text-wood px-4 py-2 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-primary hover:bg-[#1B2A4A] text-cream px-6 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-primary/10 border-b-2 border-[#a67c52]/50 active:translate-y-[1px] transition-all flex items-center gap-2"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-primary hover:bg-cream-alt transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-primary/5 bg-cream/98 shadow-inner animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-3">
              <a 
                href="#how-it-works" 
                onClick={() => { setMobileMenuOpen(false); setActiveNav('how-it-works'); }}
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-primary hover:bg-cream-alt transition-colors"
              >
                How It Works
              </a>
              <a 
                href="#browse-guides" 
                onClick={() => { setMobileMenuOpen(false); setActiveNav('browse-guides'); }}
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-primary hover:bg-cream-alt transition-colors"
              >
                Browse Guides
              </a>
              <a 
                href="#about" 
                onClick={() => { setMobileMenuOpen(false); setActiveNav('about'); }}
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-primary hover:bg-cream-alt transition-colors"
              >
                About Mission
              </a>
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="px-4 py-1.5 text-xs text-primary/60 truncate font-semibold border-b border-primary/5 mb-1">
                      Session: {user.email}
                    </div>
                    <Link 
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg text-sm font-semibold border border-primary/20 text-primary hover:bg-cream-alt transition-all"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full text-center py-3 rounded-lg text-sm font-semibold bg-primary text-cream hover:bg-[#1B2A4A] transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg text-sm font-semibold border border-primary/20 text-primary hover:bg-cream-alt transition-all"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 rounded-lg text-sm font-semibold bg-primary text-cream hover:bg-[#1B2A4A] transition-all"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-cream to-cream-alt">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-tan/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-wood/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Small Badge */}
            <div style={heroOtherStyle}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wood/10 border border-wood/20 text-wood-dark text-xs font-semibold uppercase tracking-wider mb-6">
                <ShieldCheck className="h-4 w-4 stroke-[2]" />
                Government & Legal paperwork, simplified
              </div>
            </div>

            {/* Main Headline */}
            <h1 style={headingStyle} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.1] mb-6">
              Never miss a hearing. Never lose track of a case.
            </h1>

            {/* Hero Remaining Content Wrapper */}
            <div style={heroOtherStyle}>
              {/* Subtext */}
              <p className="text-lg text-primary/75 leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
              Navigating Indian courts shouldn't feel impossible. CaseWatch tracks your case status, alerts you before every hearing, and explains complex court orders in plain language — so you always know what's happening and what to do next.
            </p>

            {/* Search and Suggestions */}
            <div className="relative max-w-xl mx-auto mb-12" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Search e.g., Passport, Aadhaar address, Rent agreement..." 
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-primary/10 bg-cream shadow-md focus:shadow-lg focus:border-wood focus:outline-none text-primary placeholder-primary/40 transition-all font-sans"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-cream font-medium px-7 py-4 rounded-xl shadow-md border-b-2 border-wood/50 hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  Track Your Case
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && searchQuery.trim() !== '' && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-cream border border-primary/10 rounded-xl shadow-2xl divide-y divide-primary/5 overflow-hidden text-left animate-in fade-in duration-100">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSearchSelection(item.term)}
                        className="w-full px-5 py-3.5 hover:bg-cream-alt flex items-center justify-between text-primary/80 transition-colors text-sm"
                      >
                        <span className="font-medium">{item.term}</span>
                        <span className="text-[10px] text-wood font-semibold uppercase tracking-wider bg-wood/10 px-2 py-0.5 rounded border border-wood/20">
                          Launch Checklist
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-primary/55 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-wood" />
                      No exact matches. Type "passport" or "rent" to test, or click to proceed to the interactive sandbox below.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links / Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
              <span className="text-xs text-primary/50 font-medium mr-1.5">Try a Sample:</span>
              <button 
                onClick={() => handleSearchSelection('Passport')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cream hover:bg-cream-alt border border-primary/10 hover:border-wood/40 transition-all text-primary/80"
              >
                Passport Fresh
              </button>
              <button 
                onClick={() => handleSearchSelection('Aadhaar')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cream hover:bg-cream-alt border border-primary/10 hover:border-wood/40 transition-all text-primary/80"
              >
                Aadhaar Address
              </button>
              <button 
                onClick={() => handleSearchSelection('Rent')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cream hover:bg-cream-alt border border-primary/10 hover:border-wood/40 transition-all text-primary/80"
              >
                Rent Agreement
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div style={restOfSiteStyle}>
      {/* INTERACTIVE DEMO WIDGET SECTION */}
      <section id="interactive-demo" className="py-20 bg-primary-dark text-cream relative">
        <div className="absolute inset-0 wood-grain-accent opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wood to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-wood font-semibold text-xs uppercase tracking-widest block mb-3">LIVE CASE TRACKER PREVIEW</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">
              See how CaseWatch works in real time
            </h2>
            <p className="text-cream/75 max-w-xl mx-auto font-sans text-sm sm:text-base">
              Enter your case number below to preview our real-time court tracking, calendar sync, and AI order explanation features.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-primary border border-wood/25 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Fake Case Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/40" />
                <input 
                  type="text" 
                  value={caseSearchNumber}
                  onChange={(e) => setCaseSearchNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowCaseResult(true);
                    }
                  }}
                  placeholder="Enter case number (e.g., CRL/2024/004521)" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-wood/20 bg-primary-dark/50 text-cream placeholder-cream/40 focus:outline-none focus:border-wood transition-all font-sans"
                />
              </div>
              <button 
                onClick={() => setShowCaseResult(true)}
                className="bg-wood hover:bg-wood-light text-primary-dark font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                Track Case
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Demo Result Card (animated) */}
            {showCaseResult && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-6 text-left">
                
                {/* Case Info Header Card */}
                <div className="bg-cream text-primary rounded-xl p-6 border border-wood/20 shadow-md">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 pb-4 border-b border-primary/10">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary">
                        Sharma vs. State of Delhi
                      </h3>
                      <p className="text-xs text-primary/60 font-semibold tracking-wider uppercase mt-1">
                        CRL/2024/004521 • Delhi High Court
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Next Hearing Scheduled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm">
                    <div>
                      <span className="block text-[10px] text-primary/45 uppercase tracking-wider font-bold mb-1">
                        Last Hearing
                      </span>
                      <p className="font-semibold text-primary/95">15 March 2024</p>
                      <p className="text-xs text-primary/65 mt-0.5">Arguments heard, next date given</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-primary/45 uppercase tracking-wider font-bold mb-1">
                        Next Hearing Date
                      </span>
                      <p className="font-semibold text-wood-dark font-serif text-base">28 June 2024</p>
                      <p className="text-xs text-primary/65 mt-0.5">Listed for Final Hearing stage</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-primary/45 uppercase tracking-wider font-bold mb-1">
                        Presiding Judge
                      </span>
                      <p className="font-semibold text-primary/95">Hon. Justice R.K. Mehta</p>
                      <p className="text-xs text-primary/65 mt-0.5">Single-Judge Bench</p>
                    </div>
                  </div>

                  {/* Past Hearings Timeline Strip */}
                  <div className="mt-8 pt-6 border-t border-primary/10">
                    <span className="block text-[10.5px] text-primary/45 uppercase tracking-widest font-bold mb-4">
                      Past Hearings Timeline
                    </span>
                    <div className="grid grid-cols-4 gap-2 relative">
                      {/* Horizontal connecting line */}
                      <div className="absolute top-[9px] left-[12%] right-[12%] h-0.5 bg-primary/10"></div>
                      
                      {[
                        { date: '10 Jan 2024', label: 'Adjourned' },
                        { date: '28 Jan 2024', label: 'Notice Issued' },
                        { date: '20 Feb 2024', label: 'Reply Filed' },
                        { date: '15 Mar 2024', label: 'Arguments' },
                      ].map((item, index) => (
                        <div key={index} className="text-center relative">
                          <div className="w-5 h-5 rounded-full bg-cream border-2 border-wood mx-auto flex items-center justify-center relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-wood"></div>
                          </div>
                          <span className="block text-xs font-semibold text-primary mt-2">{item.date}</span>
                          <span className="block text-[9px] text-primary/55 mt-0.5 font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3 Alert Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Yellow: Hearing reminder alert */}
                  <div className="bg-amber-500/10 border border-amber-500/35 rounded-xl p-5 text-amber-100 flex gap-3">
                    <div className="bg-amber-500/20 p-2.5 rounded-lg border border-amber-500/30 flex items-center justify-center self-start text-amber-400">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-200">Hearing Reminder</h4>
                      <p className="text-xs text-amber-100/85 mt-1 leading-relaxed">
                        Hearing is scheduled in 6 days (28 June 2024). Auto-added to your Calendar.
                      </p>
                    </div>
                  </div>

                  {/* Blue: Order uploaded alert */}
                  <div className="bg-blue-500/10 border border-blue-500/35 rounded-xl p-5 text-blue-100 flex gap-3">
                    <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30 flex items-center justify-center self-start text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-blue-200">Order Uploaded</h4>
                      <p className="text-xs text-blue-100/85 mt-1 leading-relaxed">
                        AI parsed order from 15 March: Court ordered State to submit response by 20 May.
                      </p>
                    </div>
                  </div>

                  {/* Red: Document required alert */}
                  <div className="bg-rose-500/10 border border-rose-500/35 rounded-xl p-5 text-rose-100 flex gap-3">
                    <div className="bg-rose-500/20 p-2.5 rounded-lg border border-rose-500/30 flex items-center justify-center self-start text-rose-400">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-rose-200">Action Required</h4>
                      <p className="text-xs text-rose-100/85 mt-1 leading-relaxed">
                        A certified copy of the Trial Court record must be uploaded before the next hearing.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
            
            {/* Disclaimer / Note */}
            <div className="text-center mt-6 text-xs text-cream/40 font-medium">
              Demo data only. Real tracking requires case registration on CaseWatch.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-wood font-semibold text-xs uppercase tracking-widest block mb-3">HOW CASEWATCH WORKS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              Your court cases, simplified
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-cream border-2 border-wood flex items-center justify-center mx-auto mb-6 shadow-md shadow-wood/5 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl font-bold text-wood">01</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-3">Track Your Case</h3>
              <p className="text-sm text-primary/75 leading-relaxed max-w-xs mx-auto">
                Enter your case number and court details. We instantly pull your complete case history, past orders, and current status from official court records.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group relative">
              {/* Connecting line on desktop */}
              <div className="hidden md:block absolute top-8 left-[-15%] right-[85%] h-0.5 bg-primary/10 -translate-y-1/2"></div>
              
              <div className="w-16 h-16 rounded-full bg-cream border-2 border-wood flex items-center justify-center mx-auto mb-6 shadow-md shadow-wood/5 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl font-bold text-wood">02</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-3">Stay Ahead of Hearings</h3>
              <p className="text-sm text-primary/75 leading-relaxed max-w-xs mx-auto">
                Get automatic alerts for upcoming hearing dates, sudden adjournments, and next steps — so you never miss a critical court date.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group relative">
              {/* Connecting line on desktop */}
              <div className="hidden md:block absolute top-8 left-[-15%] right-[85%] h-0.5 bg-primary/10 -translate-y-1/2"></div>

              <div className="w-16 h-16 rounded-full bg-cream border-2 border-wood flex items-center justify-center mx-auto mb-6 shadow-md shadow-wood/5 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl font-bold text-wood">03</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-3">Understand What Happened</h3>
              <p className="text-sm text-primary/75 leading-relaxed max-w-xs mx-auto">
                Our AI reads complex court orders and explains exactly what was decided, what documents you need next, and what action you must take.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE CATEGORIES SECTION */}
      <section id="browse-guides" className="py-24 bg-cream-alt border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-wood font-semibold text-xs uppercase tracking-widest block mb-3">Browse Blueprint Catalog</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                Comprehensive Guides for Every Procedure
              </h2>
            </div>
            <a 
              href="#interactive-demo"
              className="text-xs font-bold text-wood hover:text-wood-dark flex items-center gap-1.5 transition-colors self-start pb-1.5 border-b-2 border-wood/20 hover:border-wood/80"
            >
              Launch Interactive Sandbox 
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-cream rounded-2xl p-6 border border-primary/5 shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon tag */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${cat.color}`}>
                      <CatIcon className="h-5 w-5" />
                    </div>

                    <h3 className="font-serif text-lg font-bold text-primary mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-primary/70 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                    <span className="text-xs text-primary/55 font-semibold">
                      {cat.count}
                    </span>
                    <button 
                      onClick={() => {
                        let target = 'CRL/2024/004521';
                        if (cat.title.includes('Aadhar') || cat.title.includes('Identity')) target = 'CRL/2024/004521';
                        if (cat.title.includes('Affidavits')) target = 'LPA/2023/008912';
                        if (cat.title.includes('Property')) target = 'W.P.(C)/2024/001140';
                        handleSearchSelection(target);
                      }}
                      className="text-xs font-bold text-wood hover:text-wood-dark flex items-center gap-1 transition-colors"
                    >
                      Browse
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION & ABOUT SECTION */}
      <section id="about" className="py-24 bg-cream relative">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-tan/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Interactive Visual mock representing Modern Law Library */}
            <div className="relative">
              {/* Outer Decorative Border */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-wood to-tan rounded-2xl opacity-35 blur-sm"></div>
              
              {/* Inner Mock Card */}
              <div className="relative bg-primary text-cream p-8 rounded-2xl shadow-xl border border-wood/35 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-wood/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tan/15 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-8 border-b border-wood/15 pb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-wood" />
                    <span className="font-serif text-sm font-bold text-cream">CaseWatch Desk v1.0</span>
                  </div>
                  <span className="text-[9px] bg-wood/25 text-tan px-2 py-0.5 rounded border border-wood/30 uppercase font-bold font-sans">
                    Legal Core
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-primary-dark/50 rounded-xl border border-wood/15">
                    <h4 className="font-serif text-sm font-bold text-cream mb-1">Empowering the citizen</h4>
                    <p className="text-xs text-cream/70 leading-relaxed">
                      We gather local procedures, state statutes, and administrative guidelines, rendering them readable and actionable. No legal jargon. Just instructions.
                    </p>
                  </div>

                  <div className="p-4 bg-primary-dark/50 rounded-xl border border-wood/15">
                    <h4 className="font-serif text-sm font-bold text-cream mb-1">State-by-State Portability</h4>
                    <p className="text-xs text-cream/70 leading-relaxed">
                      Whether you are registering a lease in Bangalore or updating a Voter ID in Delhi, we handle the regional differences under the hood.
                    </p>
                  </div>
                </div>

                {/* Micro graphical signature */}
                <div className="mt-8 flex items-center justify-between text-[10px] text-cream/45 border-t border-wood/15 pt-4">
                  <span>SECURE SSL ENCRYPTED</span>
                  <span>VERIFIED BY PRACTITIONERS</span>
                </div>
              </div>
            </div>

            {/* Right: Text Information */}
            <div>
              <span className="text-wood font-semibold text-xs uppercase tracking-widest block mb-3">OUR MISSION</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-6">
                Making Indian courts accessible to everyone
              </h2>
              <p className="text-sm sm:text-base text-primary/80 leading-relaxed mb-6 font-sans">
                For generations, navigating the Indian court system has been overwhelming. Confusing case numbers, missed hearing dates, complex legal orders, and lack of transparency leave ordinary citizens lost in a system that was meant to serve them.
              </p>
              <p className="text-sm sm:text-base text-primary/80 leading-relaxed mb-8 font-sans">
                <strong>CaseWatch</strong> was built to change that. We believe every citizen deserves to know the status of their case, understand what happened in their last hearing, and never miss an important court date — without needing to hire someone just to explain the basics.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                <div>
                  <span className="block text-3xl font-serif font-bold text-primary">10,000+</span>
                  <span className="text-xs text-primary/55 font-medium">Court Cases Tracked</span>
                </div>
                <div>
                  <span className="block text-3xl font-serif font-bold text-primary">95%</span>
                  <span className="text-xs text-primary/55 font-medium">Hearing Alert Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS CTA SECTION */}
      <section id="early-access" className="py-20 bg-cream-alt border-t border-primary/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-cream rounded-3xl p-8 sm:p-12 lg:p-16 border border-wood/25 shadow-2xl relative overflow-hidden text-center">
            {/* Background elements */}
            <div className="absolute inset-0 wood-grain-accent opacity-5"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-wood/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-tan/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative max-w-2xl mx-auto">
              <span className="text-wood font-semibold text-xs uppercase tracking-widest block mb-4">Join the Waitlist</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-6">
                Be the first to access CaseWatch Premium
              </h2>
              <p className="text-sm sm:text-base text-cream/75 leading-relaxed mb-8">
                Get notified when we launch our auto-filling assistance portal, direct notary appointments, and legal advice hotlines in your region.
              </p>

              {signupSubmitted ? (
                <div className="max-w-md mx-auto p-4 bg-wood/10 border border-wood/30 rounded-xl text-tan font-semibold text-sm flex items-center justify-center gap-2.5 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="h-5 w-5 text-wood-light" />
                  Thank you! You have been added to our priority waitlist.
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <div className="w-full relative">
                    <input 
                      type="email" 
                      required 
                      placeholder="Enter your email address" 
                      className="w-full px-4 py-3.5 rounded-xl bg-primary-dark/80 text-cream placeholder-cream/45 border border-wood/35 focus:outline-none focus:border-wood text-sm font-sans"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full sm:w-auto bg-wood hover:bg-wood-light text-primary-dark font-bold px-7 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                  >
                    Subscribe
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}

              <p className="text-[10px] text-cream/45 mt-4">
                We value your privacy. No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-dark text-cream/80 border-t border-wood/15 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-wood text-primary-dark p-2 rounded-lg">
                  <Scale className="h-5 w-5 stroke-[2]" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-cream">
                  CaseWatch
                </span>
              </div>
              <p className="text-xs text-cream/55 leading-relaxed font-sans">
                Making administration simple, transparent, and citizens first. No brokers, no secrets, just results.
              </p>
              <div className="text-[10px] text-wood/65 font-bold uppercase tracking-widest pt-2">
                VERIFIED LEGAL ENGINE
              </div>
            </div>

            {/* Column 2: Browse */}
            <div>
              <h4 className="font-serif text-sm font-bold text-cream mb-4 tracking-wide">Sample Cases</h4>
              <ul className="space-y-2.5 text-xs text-cream/60">
                <li>
                  <button onClick={() => handleSearchSelection('CRL/2024/004521')} className="hover:text-wood transition-colors">
                    CRL/2024/004521 (Sharma vs. State)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSearchSelection('LPA/2023/008912')} className="hover:text-wood transition-colors">
                    LPA/2023/008912 (Malhotra vs. MCD)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSearchSelection('W.P.(C)/2024/001140')} className="hover:text-wood transition-colors">
                    W.P.(C)/2024/001140 (Gupta vs. UOI)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div>
              <h4 className="font-serif text-sm font-bold text-cream mb-4 tracking-wide">Citizen resources</h4>
              <ul className="space-y-2.5 text-xs text-cream/60">
                <li><a href="#how-it-works" className="hover:text-wood transition-colors">How It Works</a></li>
                <li><a href="#about" className="hover:text-wood transition-colors">Our Mission</a></li>
                <li><a href="#interactive-demo" className="hover:text-wood transition-colors">Sandbox Demo</a></li>
                <li><a href="#early-access" className="hover:text-wood transition-colors">Join Priority Queue</a></li>
              </ul>
            </div>

            {/* Column 4: Contact/Legal */}
            <div>
              <h4 className="font-serif text-sm font-bold text-cream mb-4 tracking-wide">Get in Touch</h4>
              <ul className="space-y-2.5 text-xs text-cream/60 font-sans">
                <li>Email: <span className="text-cream">advocacy@casewatch.org</span></li>
                <li>Phone: <span className="text-cream">+91 (11) 4022-8090</span></li>
                <li>Address: Connaught Place, New Delhi, India</li>
              </ul>
            </div>

          </div>

          {/* Sub-footer */}
          <div className="mt-16 pt-8 border-t border-wood/15 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/45 gap-4">
            <div>
              &copy; {new Date().getFullYear()} CaseWatch Technologies. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#about" className="hover:text-wood transition-colors">Privacy Policy</a>
              <a href="#about" className="hover:text-wood transition-colors">Terms of Service</a>
              <a href="#about" className="hover:text-wood transition-colors">Legal Disclaimer</a>
            </div>
          </div>
        </div>
        
        {/* Bottom Wood Decorative Strip */}
        <div className="h-1.5 w-full wood-gradient-line"></div>
      </footer>
    </div>
    </div> {/* closes restOfSiteStyle wrapper */}
    </>
  )
}

import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import TimelineTracker from './components/TimelineTracker.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<ProtectedRoute guestOnly={true}><Login /></ProtectedRoute>} />
      <Route path="/signup" element={<ProtectedRoute guestOnly={true}><Signup /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><TimelineTracker /></ProtectedRoute>} />
    </Routes>
  );
}
