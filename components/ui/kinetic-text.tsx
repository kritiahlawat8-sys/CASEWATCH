'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface KineticTextProps {
  words: string[];
  intervalMs?: number;
  className?: string;
  wordClassName?: string;
}

export function KineticText({
  words,
  intervalMs = 2500,
  className,
  wordClassName,
}: KineticTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [words, intervalMs]);

  return (
    <span className={cn("inline-flex justify-start items-center relative overflow-hidden h-[1.2em] min-w-[180px] sm:min-w-[280px] px-1 vertical-align-middle", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={cn(
            "absolute left-0 font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet origin-left",
            wordClassName
          )}
          initial={{ y: '70%', opacity: 0, rotateX: -60 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '-70%', opacity: 0, rotateX: 60 }}
          transition={{
            y: { type: 'spring', stiffness: 120, damping: 14 },
            opacity: { duration: 0.15 },
            rotateX: { duration: 0.25 }
          }}
          style={{ transformOrigin: "50% 50% -20px" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible text block to keep spacing correct */}
      <span className="opacity-0 select-none pointer-events-none">
        {words.reduce((longest, current) => current.length > longest.length ? current : longest, '')}
      </span>
    </span>
  );
}
