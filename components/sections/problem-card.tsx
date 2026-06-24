'use client';

import React from 'react';
import { AlertOctagon, HelpCircle, HardDrive, Unlink } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProblemCard() {
  const problems = [
    {
      icon: <HardDrive className="w-6 h-6 text-brand-crimson" />,
      title: "Isolated Registry Silos",
      desc: "All-India courts function on disjointed database clusters, causing delay in retrieving nationwide civil and criminal history."
    },
    {
      icon: <Unlink className="w-6 h-6 text-brand-violet" />,
      title: "Broken Filing Telemetry",
      desc: "Legal practitioners lack real-time feedback loops during filings, resulting in high rates of administrative rejections."
    },
    {
      icon: <AlertOctagon className="w-6 h-6 text-brand-cyan" />,
      title: "CRN Parse Overload",
      desc: "Manual ingestion of Case Registration Numbers leads to lookup bottlenecks and severe lag in tracking case lifecycles."
    }
  ];

  return (
    <div className="w-full text-white py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-center min-h-screen">
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-crimson/10 border border-brand-crimson/20 text-xs font-semibold text-brand-crimson">
          <HelpCircle className="w-3.5 h-3.5" />
          The Legacy Friction
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight">
          Shattered Case Registry Infrastructures
        </h2>
        <p className="text-muted-text text-sm sm:text-base max-w-xl">
          Traditional court filings operate within localized legacy networks. Case Watch bypasses these limitations by indexing court telemetry dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((prob, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, borderColor: 'rgba(239, 68, 68, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/20 relative group overflow-hidden"
          >
            {/* Background color glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-crimson/0 to-brand-crimson/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              {prob.icon}
            </div>

            <h3 className="text-lg font-bold font-sans tracking-wide mb-2 text-white">
              {prob.title}
            </h3>
            
            <p className="text-muted-text font-sans text-sm leading-relaxed">
              {prob.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
