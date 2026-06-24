import React from 'react';
import { cn } from '@/lib/utils';

export interface TerminalCardProps {
  title?: string;
  glowColor?: 'emerald' | 'cyan' | 'violet';
  className?: string;
  children: React.ReactNode;
}

export function TerminalCard({
  title = 'casewatch://telemetry.log',
  glowColor = 'cyan',
  className,
  children,
}: TerminalCardProps) {
  const glowBorder = {
    cyan: 'border-brand-cyan/20 terminal-glow-cyan focus-within:border-brand-cyan/40',
    emerald: 'border-brand-emerald/20 terminal-glow-green focus-within:border-brand-emerald/40',
    violet: 'border-brand-violet/20 focus-within:border-brand-violet/40',
  }[glowColor];

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-black/60 backdrop-blur-xl transition-all duration-500 overflow-hidden",
        glowBorder,
        className
      )}
    >
      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]" />
      
      {/* Scanline Sweep animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-1/2 bg-gradient-to-b from-brand-cyan/0 via-brand-cyan/[0.02] to-brand-cyan/0 absolute top-0 left-0 right-0 animate-scan" />
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-950/80 border-b border-white/5 select-none z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-70" />
        </div>
        <div className="text-xs font-mono text-muted-text/80 tracking-wider truncate max-w-[200px] sm:max-w-sm">
          {title}
        </div>
        <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest hidden sm:block">
          SYS_SECURE
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 font-mono text-sm leading-relaxed overflow-y-auto z-10 relative bg-black/40">
        {children}
      </div>
    </div>
  );
}
