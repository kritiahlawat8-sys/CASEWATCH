'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export function ChaosMetric() {
  // Counting stats simulation
  const [pendingCount, setPendingCount] = useState(44280190);
  const [speedCount, setSpeedCount] = useState(94.2);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate real-time cases adding
      setPendingCount(prev => prev + Math.floor(Math.random() * 4));
      setSpeedCount(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.max(92.0, Math.min(98.5, prev + delta)).toFixed(1));
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: <Database className="w-5 h-5 text-brand-cyan" />,
      label: "Pending Cases Nationwide",
      value: pendingCount.toLocaleString(),
      change: "+2.4 / sec",
      changeColor: "text-brand-crimson"
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-violet" />,
      label: "Avg. Ingestion Inefficiency",
      value: "18.2 Days",
      change: "-74% Index Lag",
      changeColor: "text-brand-emerald"
    },
    {
      icon: <Activity className="w-5 h-5 text-brand-cyan" />,
      label: "Parser Telemetry Rate",
      value: `${speedCount} MB/s`,
      change: "Stable Bandwidth",
      changeColor: "text-brand-cyan"
    }
  ];

  return (
    <div className="w-full text-white py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-center min-h-screen">
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-semibold text-brand-cyan">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          The Backlog Metrics
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight">
          Quantifying Ingestion Chaos
        </h2>
        <p className="text-muted-text text-sm sm:text-base max-w-xl font-sans">
          Live stream counts showing database delays. Standard legal platforms lag behind incoming registry volumes. Case Watch is built to scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-text uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            
            <div className="text-3xl font-bold font-sans tracking-tight mb-2">
              {stat.value}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className={stat.changeColor}>{stat.change}</span>
              <span className="text-neutral-600">vs historical baseline</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
