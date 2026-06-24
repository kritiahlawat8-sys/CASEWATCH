'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HeroTerminal } from '@/components/sections/hero-terminal';
import { HaryanaWorkflows } from '@/components/sections/haryana-workflows';
import { ThreeKineticStream } from '@/components/ui/three-kinetic-stream';
import { cn } from '@/lib/utils';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the window
  const { scrollYProgress } = useScroll();

  // Smooth scroll interpolation
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  // Active dot tracking
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest < 0.28) {
        setActiveDot(0);
      } else if (latest < 0.58) {
        setActiveDot(1);
      } else if (latest < 0.84) {
        setActiveDot(2);
      } else {
        setActiveDot(3);
      }
    });
  }, [scrollYProgress]);

  // Section 1: Hero (0 to 100vh) - Fades and scales down into background
  const heroOpacity = useTransform(smoothScroll, [0, 0.22, 0.32], [1, 1, 0]);
  const heroScale = useTransform(smoothScroll, [0, 0.32], [1, 0.85]);
  const heroBlur = useTransform(smoothScroll, [0, 0.22, 0.32], ["blur(0px)", "blur(0px)", "blur(12px)"]);
  const heroY = useTransform(smoothScroll, [0, 0.32], [0, -60]);

  // Section 2: Real-time Pipeline (100 to 200vh) - Slides in from right/bottom, scales down to background
  const pipelineX = useTransform(smoothScroll, [0.22, 0.35, 0.55, 0.65], ["100vw", "0vw", "0vw", "-30vw"]);
  const pipelineOpacity = useTransform(smoothScroll, [0.22, 0.32, 0.55, 0.65], [0, 1, 1, 0]);
  const pipelineScale = useTransform(smoothScroll, [0.22, 0.35, 0.55, 0.65], [0.9, 1, 1, 0.72]);
  const pipelineBlur = useTransform(smoothScroll, [0.55, 0.65], ["blur(0px)", "blur(10px)"]);

  // Section 3: Timeline Tracker (200 to 300vh) - Fades/scales in from center, fades out
  const timelineOpacity = useTransform(smoothScroll, [0.55, 0.65, 0.82, 0.90], [0, 1, 1, 0]);
  const timelineScale = useTransform(smoothScroll, [0.55, 0.65, 0.82, 0.90], [1.3, 1, 1, 0.85]);
  const timelineY = useTransform(smoothScroll, [0.55, 0.65, 0.82, 0.90], [100, 0, 0, -80]);

  // Section 4: Haryana Filing / Final CTA (300 to 400vh)
  const filingOpacity = useTransform(smoothScroll, [0.82, 0.90], [0, 1]);
  const filingScale = useTransform(smoothScroll, [0.82, 0.90], [0.88, 1]);
  const filingY = useTransform(smoothScroll, [0.82, 0.90], [80, 0]);

  // Navbar blur background based on scroll progress
  const navBg = useTransform(scrollYProgress, [0, 0.1], ["rgba(0, 0, 0, 0)", "rgba(5, 5, 5, 0.85)"]);
  const navBorder = useTransform(scrollYProgress, [0, 0.1], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.05)"]);
  const navBlur = useTransform(scrollYProgress, [0, 0.1], ["blur(0px)", "blur(20px)"]);

  // Clicking dots to jump scroll to corresponding sections
  const handleDotClick = (idx: number) => {
    const scrollTargets = [0.0, 0.35, 0.7, 0.95];
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: scrollTargets[idx] * totalHeight,
      behavior: 'smooth'
    });
  };

  // Timeline line draw animation progress based on scroll in Section 3
  const timelineProgress = useTransform(smoothScroll, [0.62, 0.80], [0, 1]);

  return (
    <div className="relative h-[400vh] bg-background text-white selection:bg-[#00D6FF]/20 font-sans">
      
      {/* 3D background Gavel & Scales scene */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <ThreeKineticStream activeState={activeDot} />
        {/* Faint grid overlay with animation */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none animate-grid-shift z-10" />
      </div>

      {/* ─── STICKY WRAPPER FOR SECTIONS ─── */}
      <div className="fixed inset-0 h-screen w-screen flex items-center justify-center overflow-hidden pointer-events-none z-10">
        
        {/* SECTION 1: THE HERO (0-100vh) */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlur, y: heroY }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pointer-events-auto z-10"
        >
          <div className="max-w-4xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xs font-semibold tracking-[6px] text-brand-cyan uppercase font-mono"
            >
              Court Intelligence · Document Guidance · Legal Clarity
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.15 }}
              className="text-5xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent"
            >
              Know Your Case.<br />Know Your Rights.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-16 h-[2px] bg-gradient-to-r from-brand-blue to-brand-cyan mx-auto"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-muted-text text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
            >
              CaseWatch tracks live court hearings, translates legal orders into plain language, and guides citizens through the justice system — free, forever.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <button 
                onClick={() => handleDotClick(1)}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#e8c96a] text-black font-bold font-mono text-xs tracking-wider transition-transform hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(201,168,76,0.3)] cursor-pointer"
              >
                Track Your Case
              </button>
              <button 
                onClick={() => handleDotClick(2)}
                className="px-8 py-4 rounded-lg border border-muted-border text-white/80 hover:text-white font-mono text-xs tracking-wider hover:border-white/30 transition-all cursor-pointer bg-white/5"
              >
                How It Works
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* SECTION 2: THE REAL-TIME PIPELINE (100-200vh) */}
        <motion.div
          style={{ x: pipelineX, opacity: pipelineOpacity, scale: pipelineScale, filter: pipelineBlur }}
          className="absolute inset-0 flex items-center justify-center px-14 md:px-24 pointer-events-auto z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase font-bold">
                CRN SCANNER TELEMETRY ENGINE
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                High-Velocity<br />Judicial Scanner
              </h2>
              <p className="text-muted-text text-sm md:text-base leading-relaxed max-w-md font-light">
                Directly connected to the All-India digital court network. Verify case statuses in real-time, generate secure hashes, and read parsed summaries.
              </p>
            </div>
            
            <div className="lg:col-span-7 w-full h-[520px] rounded-2xl bg-background-card border border-muted-border animate-border-flow overflow-hidden p-1 shadow-2xl relative">
              {/* Scanline animation overlay */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-cyan opacity-80 animate-scan z-30 shadow-[0_0_12px_#00F0FF]" />
              <HeroTerminal />
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: THE TIMELINE TRACKER (200-300vh) */}
        <motion.div
          style={{ opacity: timelineOpacity, scale: timelineScale, y: timelineY }}
          className="absolute inset-0 flex flex-col justify-center items-center px-14 md:px-24 pointer-events-auto z-30"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase font-bold">Timeline Tracker</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-1">Snapping Process Flow</h2>
            </div>
            
            <div className="relative max-w-2xl mx-auto py-12">
              {/* Animated Timeline Vector Line */}
              <div className="absolute left-[30px] top-4 bottom-4 w-[2px] bg-muted-border">
                <motion.div
                  style={{ scaleY: timelineProgress }}
                  className="w-full h-full bg-gradient-to-b from-brand-cyan to-brand-violet origin-top"
                />
              </div>

              <div className="flex flex-col gap-14 relative">
                {/* Step 1 */}
                <div className="flex items-center gap-8 pl-2">
                  <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center font-mono text-xl font-bold bg-background-terminal border border-brand-cyan text-brand-cyan shadow-[0_0_16px_rgba(0,240,255,0.2)] animate-pulse-fast relative z-10">
                    01
                  </div>
                  <div className="flex-1 p-5 rounded-xl bg-background-card border border-muted-border">
                    <h3 className="text-white font-bold text-base mb-1">Search Cases</h3>
                    <p className="text-muted-text text-xs font-light">Input CRN indexes to trace hearing telemetry files instantly.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-8 pl-2">
                  <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center font-mono text-xl font-bold bg-background-terminal border border-brand-violet text-brand-violet shadow-[0_0_16px_rgba(139,92,246,0.2)] relative z-10">
                    02
                  </div>
                  <div className="flex-1 p-5 rounded-xl bg-background-card border border-muted-border">
                    <h3 className="text-white font-bold text-base mb-1">Decipher Orders</h3>
                    <p className="text-muted-text text-xs font-light">Convert legal document jargon into simplified multi-language summaries.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-8 pl-2">
                  <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center font-mono text-xl font-bold bg-background-terminal border border-brand-cyan text-brand-cyan shadow-[0_0_16px_rgba(0,240,255,0.2)] relative z-10">
                    03
                  </div>
                  <div className="flex-1 p-5 rounded-xl bg-background-card border border-muted-border">
                    <h3 className="text-white font-bold text-base mb-1">Trigger Submissions</h3>
                    <p className="text-muted-text text-xs font-light">Execute document wizards to automatically draft filings for local jurisdictions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4: HARYANA FILING / IMPACT (300-400vh) */}
        <motion.div
          style={{ opacity: filingOpacity, scale: filingScale, y: filingY }}
          className="absolute inset-0 flex items-center justify-center px-14 md:px-24 pointer-events-auto z-40"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono tracking-widest text-brand-violet uppercase font-bold">
                HARYANA WORKFLOW WIZARD
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Automate Local Documentation
              </h2>
              <p className="text-muted-text text-sm font-light">
                Fill templates directly matching Haryana court schedules. Calculate stamp duties and submit verification receipts instantly.
              </p>
              
              {/* Impact Micro Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted-border">
                <div>
                  <span className="text-brand-cyan text-2xl font-black font-mono block">10,000+</span>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Cases Tracked</span>
                </div>
                <div>
                  <span className="text-brand-violet text-2xl font-black font-mono block">100% Free</span>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Legal Aid Access</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 w-full h-[540px] overflow-y-auto bg-background-card border border-muted-border rounded-2xl p-6 shadow-2xl relative">
              <HaryanaWorkflows />
            </div>
          </div>
        </motion.div>

      </div>

      {/* ─── PERSISTENT CHROME: NAV BAR ─── */}
      <motion.nav 
        id="nav" 
        style={{ backgroundColor: navBg, borderColor: navBorder, backdropFilter: navBlur }}
        className="fixed top-0 left-0 right-0 z-[200] px-14 py-5 flex items-center justify-between border-b"
      >
        <button onClick={() => handleDotClick(0)} className="n-logo font-bold bg-transparent border-none text-left cursor-pointer text-white">
          ⚖ CaseWatch
        </button>
        
        <ul className="n-links list-none flex gap-8 items-center">
          <li><button onClick={() => handleDotClick(0)} className={cn("bg-transparent border-none hover:text-brand-cyan uppercase font-mono text-[10px] tracking-widest cursor-pointer transition-colors", activeDot === 0 ? "text-brand-cyan font-bold" : "text-white/50")}>Overview</button></li>
          <li><button onClick={() => handleDotClick(1)} className={cn("bg-transparent border-none hover:text-brand-cyan uppercase font-mono text-[10px] tracking-widest cursor-pointer transition-colors", activeDot === 1 ? "text-brand-cyan font-bold" : "text-white/50")}>CRN Engine</button></li>
          <li><button onClick={() => handleDotClick(2)} className={cn("bg-transparent border-none hover:text-brand-cyan uppercase font-mono text-[10px] tracking-widest cursor-pointer transition-colors", activeDot === 2 ? "text-brand-cyan font-bold" : "text-white/50")}>How It Works</button></li>
          <li><button onClick={() => handleDotClick(3)} className={cn("bg-transparent border-none hover:text-brand-cyan uppercase font-mono text-[10px] tracking-widest cursor-pointer transition-colors", activeDot === 3 ? "text-brand-cyan font-bold" : "text-white/50")}>Haryana Filing</button></li>
        </ul>

        <button onClick={() => handleDotClick(1)} className="n-btn cursor-pointer font-mono text-[10px] tracking-widest font-bold">
          Track a Case
        </button>
      </motion.nav>

      {/* ─── PERSISTENT CHROME: BOTTOM MARQUEE ─── */}
      <div id="ticker" className="fixed bottom-0 left-0 right-0 z-[200] bg-background-card/90 backdrop-blur-md border-t border-muted-border py-3.5 select-none pointer-events-none">
        <div className="tick-inner">
          {["DOCUMENT FILING GUIDES • FRAUD PREVENTION • FREE FOR ALL CITIZENS • 15+ DOCUMENT TYPES • 3 LANGUAGES SUPPORTED • RTI FILING", "DOCUMENT FILING GUIDES • FRAUD PREVENTION • FREE FOR ALL CITIZENS • 15+ DOCUMENT TYPES • 3 LANGUAGES SUPPORTED • RTI FILING"].map((text, idx) => (
            <span key={idx} className="tick-item font-mono text-[10px] tracking-[3px] text-brand-cyan uppercase flex items-center gap-2">
              <span className="tick-dot bg-brand-cyan" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ─── PERSISTENT CHROME: RIGHT-SIDE VERTICAL NAVIGATION CHECKPOINTS ─── */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-[200] select-none">
        {/* Vertical Track line */}
        <div className="absolute w-[1px] bg-white/10" style={{ top: 8, bottom: 8 }} />
        
        {/* Snapping glowing cyan active dot indicator */}
        <motion.div 
          className="absolute w-3.5 h-3.5 rounded-full bg-brand-cyan shadow-[0_0_12px_#00F0FF,0_0_24px_rgba(0,240,255,0.6)] z-20 pointer-events-none"
          animate={{ y: activeDot * 42 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          style={{ top: 2 }}
        />

        <div className="flex flex-col gap-[28px] relative">
          {Array.from({ length: 4 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={cn(
                "w-3.5 h-3.5 rounded-full border transition-all duration-300 relative z-10 cursor-pointer",
                activeDot === idx 
                  ? "bg-transparent border-transparent" 
                  : "bg-white/10 border-white/5 hover:bg-white/30"
              )}
              aria-label={`Go to section ${idx + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
