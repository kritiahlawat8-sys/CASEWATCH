import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  glowColor?: 'cyan' | 'violet' | 'emerald';
  containerClassName?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, glowColor = 'cyan', containerClassName, type = 'text', ...props }, ref) => {
    const glowClass = {
      cyan: 'focus:border-brand-cyan/40 focus:ring-1 focus:ring-brand-cyan/20 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
      violet: 'focus:border-brand-violet/40 focus:ring-1 focus:ring-brand-violet/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      emerald: 'focus:border-brand-emerald/40 focus:ring-1 focus:ring-brand-emerald/20 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    }[glowColor];

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-text/60">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-lg bg-black/40 backdrop-blur-md border border-white/5 py-3 text-white placeholder-neutral-500 transition-all duration-300 font-sans text-sm focus:outline-none",
            icon ? "pl-11 pr-4" : "px-4",
            glowClass,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export { GlassInput };
