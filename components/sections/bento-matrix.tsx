'use client';

import React from 'react';
import { Search, Bell, Map, Award, ArrowRight, Zap, CloudLightning, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface BentoMatrixProps {
  onNavigateToHaryana: () => void;
}

export function BentoMatrix({ onNavigateToHaryana }: BentoMatrixProps) {
  return (
    <div className="w-full text-white py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-center min-h-screen">
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-semibold text-brand-cyan">
          <Zap className="w-3.5 h-3.5" />
          Feature Matrix
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight">
          Next-Gen Feature Scaffolding
        </h2>
        <p className="text-muted-text text-sm sm:text-base max-w-xl font-sans">
          Discover specialized micro-services unified under the Case Watch ecosystem. Designed for speed, security, and developer agility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-none md:grid-rows-2">
        {/* Card 1: High-Velocity Search Engine (2 Cols) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 md:col-span-2 flex flex-col justify-between group cursor-pointer hover:border-brand-cyan/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-6">
              <Search className="w-5 h-5 text-brand-cyan" />
            </div>
            <h3 className="text-lg font-bold font-sans mb-2 text-white group-hover:text-brand-cyan transition-colors">
              High-Velocity Search Engine
            </h3>
            <p className="text-muted-text text-sm font-sans leading-relaxed max-w-md">
              Instant indexing of 25+ High Court databases. Search Case Registration Numbers (CRN) in milliseconds with automatic metadata mapping.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-mono text-brand-cyan">
            <span>Query latency &lt; 85ms</span>
            <CloudLightning className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Custom Alerts & Webhooks (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col justify-between group hover:border-brand-violet/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center mb-6">
              <Bell className="w-5 h-5 text-brand-violet" />
            </div>
            <h3 className="text-lg font-bold font-sans mb-2 text-white group-hover:text-brand-violet transition-colors">
              Registry Triggers
            </h3>
            <p className="text-muted-text text-sm font-sans leading-relaxed">
              Connect webhooks to receive instant notifications on hearing dates, orders, and filing updates.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-mono text-brand-violet">
            <span>Slack & Telegram APIs</span>
          </div>
        </div>

        {/* Card 3: Nationwide Map Scope (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col justify-between group hover:border-brand-cyan/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-6">
              <Map className="w-5 h-5 text-brand-cyan" />
            </div>
            <h3 className="text-lg font-bold font-sans mb-2 text-white group-hover:text-brand-cyan transition-colors">
              Nationwide Index
            </h3>
            <p className="text-muted-text text-sm font-sans leading-relaxed">
              Unified database mapping case histories across all states, districts, and commercial courts in India.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-mono text-brand-cyan">
            <span>99.8% Index Coverage</span>
          </div>
        </div>

        {/* Card 4: Specialized Haryana Workflows (2 Cols - Interactive) */}
        <div 
          onClick={onNavigateToHaryana}
          className="glass-panel p-6 rounded-2xl border border-brand-violet/20 bg-neutral-950/40 md:col-span-2 flex flex-col justify-between group cursor-pointer hover:border-brand-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center mb-6">
                <Award className="w-5 h-5 text-brand-violet" />
              </div>
              <h3 className="text-lg font-bold font-sans mb-2 text-white group-hover:text-brand-violet transition-colors flex items-center gap-1.5">
                Haryana Document Workflows
              </h3>
              <p className="text-muted-text text-sm font-sans leading-relaxed max-w-md">
                Specialized module for automated form generation, e-filing template creation, and validation protocols aligned directly with the Haryana Court Manual rules.
              </p>
            </div>
            
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-violet/10 border border-brand-violet/20 text-xs font-mono text-brand-violet self-start sm:self-auto font-bold uppercase tracking-wider">
              LOCAL MODULE
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-500">Includes Affidavit & Eviction models</span>
            <span className="flex items-center gap-1 text-brand-violet font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
              Launch localized console <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
