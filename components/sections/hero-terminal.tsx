'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassInput } from '../ui/glass-input';
import { TerminalCard } from '../ui/terminal-card';
import { KineticText } from '../ui/kinetic-text';
import { generateTelemetryItem, RegistryTelemetryItem, searchCRN, CaseDetails } from '@/lib/utils/telemetry';
import { Search, Play, Pause, RefreshCw, X, ShieldAlert, Cpu, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function HeroTerminal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCase, setActiveCase] = useState<CaseDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Telemetry stream state
  const [telemetryStream, setTelemetryStream] = useState<RegistryTelemetryItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const streamRef = useRef<HTMLDivElement>(null);

  // Load initial telemetry stream items
  useEffect(() => {
    const items = Array.from({ length: 8 }, generateTelemetryItem);
    setTelemetryStream(items);
  }, []);

  // Set interval to push new telemetry items
  useEffect(() => {
    if (!isStreaming || activeCase) return;

    const interval = setInterval(() => {
      setTelemetryStream(prev => {
        const next = [...prev, generateTelemetryItem()];
        // Keep list bounded for performance
        if (next.length > 50) {
          next.shift();
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming, activeCase]);

  // Autoscroll telemetry logs
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [telemetryStream]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const result = searchCRN(searchQuery);
    setActiveCase(result);
    setHasSearched(true);
    if (result) {
      setIsStreaming(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveCase(null);
    setHasSearched(false);
    setIsStreaming(true);
  };

  const handleCaseSelect = (crn: string) => {
    setSearchQuery(crn);
    const result = searchCRN(crn);
    setActiveCase(result);
    setHasSearched(true);
    setIsStreaming(false);
  };

  return (
    <div className="w-full relative h-full flex flex-col justify-center items-center py-2 px-4 md:px-8 bg-radial-glow/20 overflow-hidden">
      
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 animate-grid-shift pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-brand-violet/5 blur-[140px] pointer-events-none" />

      {/* Main hero typography container */}
      <div className="text-center z-10 max-w-4xl mx-auto space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-semibold text-brand-cyan tracking-wide"
        >
          <Cpu className="w-3.5 h-3.5 animate-pulse-fast text-brand-cyan" />
          ALL-INDIA COURT REGISTRY TELEMETRY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-sans leading-[1.1] selection:bg-brand-cyan/30"
        >
          Unifying Judicial Scans with <br className="hidden sm:inline" />
          <KineticText
            words={["CaseWatch", "High-Velocity Search", "Automated Filing", "Decentralized Telemetry"]}
            className="text-transparent"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-text text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed"
        >
          High-performance legal intelligence mapping real-time judicial registry pipelines. Parse CRN telemetry, track case progressions, and draft specialized filings.
        </motion.p>
      </div>

      {/* Search Input Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-3xl z-10 mb-8"
      >
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <GlassInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search All-India case status by CRN... Try 'CRN-SC-100245' or 'CRN-HR-204192'"
            icon={<Search className="w-5 h-5 text-brand-cyan" />}
            glowColor="cyan"
            className="text-base py-3.5 pr-10"
          />
          {hasSearched && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 rounded-lg bg-neutral-900 border border-white/5 hover:bg-neutral-800 transition-colors flex items-center justify-center text-muted-text hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="px-6 rounded-lg bg-brand-cyan text-black font-semibold hover:bg-brand-cyan/90 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center font-mono text-sm tracking-wide gap-1"
          >
            PARSE
          </button>
        </form>
        <div className="mt-2.5 flex flex-wrap gap-2 items-center justify-start text-[11px] font-mono text-neutral-500">
          <span>Quick Scans:</span>
          {['CRN-SC-100245', 'CRN-HR-204192', 'CRN-DL-450912', 'CRN-MH-889312'].map((demoCrn) => (
            <button
              key={demoCrn}
              onClick={() => handleCaseSelect(demoCrn)}
              className="text-brand-cyan/60 hover:text-brand-cyan transition-colors underline cursor-pointer"
            >
              {demoCrn}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Hero Terminal / Case Details Console Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl z-10"
      >
        <AnimatePresence mode="wait">
          {activeCase ? (
            // Search case details display
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <TerminalCard title={`registry://query-result?crn=${activeCase.crn}`} glowColor="cyan">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-300">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-brand-cyan uppercase tracking-wider block font-bold mb-0.5">Title</span>
                      <span className="text-white text-base font-semibold">{activeCase.title}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-cyan uppercase tracking-wider block font-bold mb-0.5">Court Registry</span>
                      <span className="text-white font-mono text-xs">{activeCase.court}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-cyan uppercase tracking-wider block font-bold mb-0.5">Hon&apos;ble Judge</span>
                      <span className="text-white font-semibold">{activeCase.judge}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-cyan uppercase tracking-wider block font-bold mb-0.5">Current Filing Hash</span>
                      <span className="text-brand-cyan font-mono text-xs break-all leading-normal">{activeCase.hash}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 bg-neutral-950/50 p-4 rounded-lg border border-white/5">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-0.5">Petitioner</span>
                      <span className="text-white font-medium text-xs">{activeCase.petitioner}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-0.5">Respondent</span>
                      <span className="text-white font-medium text-xs">{activeCase.respondent}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-0.5">Filing Date</span>
                        <span className="text-white font-mono text-xs">{activeCase.filedDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-0.5">Next Hearing</span>
                        <span className="text-brand-cyan font-mono font-bold text-xs">{activeCase.nextHearing}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-2">Verified Artifacts</span>
                      <div className="space-y-1.5">
                        {activeCase.documents.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                            <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                              <FileCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                              {doc.name}
                            </span>
                            <span className="text-neutral-600 shrink-0">{doc.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-brand-emerald">
                    <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                    Secure cryptographic validation verified
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 transition-all font-mono text-[10px] text-brand-cyan uppercase font-bold"
                  >
                    Resume Telemetry Stream <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </TerminalCard>
            </motion.div>
          ) : (
            // Stream view
            <motion.div
              key="stream"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <TerminalCard title="registry://all-india.court.telemetry-stream" glowColor="cyan">
                {/* Control bar */}
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-text">
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      isStreaming ? "bg-brand-emerald animate-pulse" : "bg-neutral-600"
                    )} />
                    {isStreaming ? 'STREAMING REAL-TIME PIPELINES' : 'STREAM PAUSED'}
                  </div>
                  <button
                    onClick={() => setIsStreaming(!isStreaming)}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-[10px] text-neutral-400 flex items-center gap-1.5"
                  >
                    {isStreaming ? <><Pause className="w-3 h-3" /> Pause Feed</> : <><Play className="w-3 h-3" /> Resume Feed</>}
                  </button>
                </div>

                {/* Telemetry rows */}
                <div
                  ref={streamRef}
                  className="space-y-2 h-[280px] overflow-y-auto pr-1 scroll-smooth"
                >
                  {telemetryStream.map((item, idx) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2 rounded text-[11px] font-mono border transition-all duration-300",
                        idx === telemetryStream.length - 1 ? "bg-brand-cyan/5 border-brand-cyan/20 text-white" : "bg-neutral-950/20 border-white/[0.02] text-neutral-400"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-neutral-600">[{item.timestamp}]</span>
                        <span className="text-white font-semibold">{item.registry}</span>
                        <span className="text-neutral-500">|</span>
                        <span className="text-neutral-300 font-bold">{item.crn}</span>
                        <span className="text-neutral-500">|</span>
                        <span className="text-neutral-400 truncate max-w-[150px] sm:max-w-none">{item.caseType}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-1 sm:mt-0">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider",
                          item.status === 'SCANNING' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                          item.status === 'PARSED' && 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
                          item.status === 'INDEXED' && 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20',
                          item.status === 'WARNING' && 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20'
                        )}>
                          {item.status}
                        </span>
                        <span className="text-neutral-500 text-[10px] hidden sm:inline">{item.speedMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TerminalCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informational Warning overlay */}
        {hasSearched && !activeCase && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-brand-crimson/10 border border-brand-crimson/20 text-sm flex items-start gap-3 text-brand-crimson"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">CRN Not Found In Active Indexes</div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                The specified CRN format does not match currently parsed registries. For verification purposes, please try entering a valid format such as <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">CRN-SC-100245</code>, <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">CRN-HR-204192</code>, or <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono font-bold">CRN-HR-491024</code> to invoke our dynamic parser.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}
