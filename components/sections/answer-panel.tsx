'use client';

import React from 'react';
import { ShieldCheck, Cpu, Code2, Layers } from 'lucide-react';
import { TerminalCard } from '../ui/terminal-card';

export function AnswerPanel() {
  return (
    <div className="w-full text-white py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-center min-h-screen">
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-xs font-semibold text-brand-emerald">
          <ShieldCheck className="w-3.5 h-3.5" />
          The Solution
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight">
          Case Watch: Integrated Legal Telemetry
        </h2>
        <p className="text-muted-text text-sm sm:text-base max-w-xl font-sans">
          Our parser maps database clusters to single CRN queries, indexing court hearings instantly and providing direct developer hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Solutions list (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans tracking-wide mb-1 text-white">High-Velocity indexing</h3>
              <p className="text-muted-text text-xs sm:text-sm font-sans leading-relaxed">
                Processes over 150 court registry directories simultaneously. Automatic character parser converts legacy scans into structured JSON datasets.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-brand-violet" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans tracking-wide mb-1 text-white">Unified CRN Routing</h3>
              <p className="text-muted-text text-xs sm:text-sm font-sans leading-relaxed">
                Normalizes CRN queries across all states in India. Automatically forwards updates to connected Slack/Telegram/Webhooks.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Code Visualization Terminal (6 cols) */}
        <div className="lg:col-span-6">
          <TerminalCard title="casewatch-sdk://examples/parser.ts" glowColor="cyan">
            <div className="space-y-1.5 text-[11px] font-mono text-neutral-400">
              <div><span className="text-brand-violet">import</span> &#123; CaseWatchClient &#125; <span className="text-brand-violet">from</span> <span className="text-brand-cyan">&apos;@casewatch/sdk&apos;</span>;</div>
              <br />
              <div><span className="text-brand-violet">const</span> client = <span className="text-brand-violet">new</span> <span className="text-brand-cyan">CaseWatchClient</span>(&#123;</div>
              <div>&nbsp;&nbsp;apiKey: <span className="text-brand-cyan">&apos;cw_live_8f3d2a1b9e&apos;</span></div>
              <div>&#125;);</div>
              <br />
              <div><span className="text-neutral-600">// Subscribe to real-time telemetry scans</span></div>
              <div>client.<span className="text-brand-blue">onRegistryScan</span>((item) =&gt; &#123;</div>
              <div>&nbsp;&nbsp;console.<span className="text-brand-blue">log</span>(<span className="text-brand-cyan">`Ingested case: $&#123;item.crn&#125;`</span>);</div>
              <div>&#125;);</div>
              <br />
              <div><span className="text-neutral-600">// Search All-India CRN database</span></div>
              <div><span className="text-brand-violet">const</span> caseDetails = <span className="text-brand-violet">await</span> client.<span className="text-brand-blue">search</span>(<span className="text-brand-cyan">&apos;CRN-HR-204192&apos;</span>);</div>
              <div>console.<span className="text-brand-blue">log</span>(caseDetails.status);</div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
