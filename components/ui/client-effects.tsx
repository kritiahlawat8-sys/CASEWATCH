'use client';

import React, { useEffect, useState } from 'react';

export function ClientEffects() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ─── LOADER TIMER ───
    const loadTimer = setTimeout(() => {
      const loader = document.getElementById('ldr');
      if (loader) {
        loader.style.opacity = '0';
        // Remove from DOM after transition finishes
        const fadeTimer = setTimeout(() => {
          setLoading(false);
        }, 800);
        return () => clearTimeout(fadeTimer);
      } else {
        setLoading(false);
      }
    }, 2000);

    // ─── DUAL CURSOR TRACKING ───
    const cur = document.getElementById('cursor');
    const curt = document.getElementById('cursor-trail');
    
    if (!cur || !curt) return;

    let cx = 0, cy = 0;
    let tcx = 0, tcy = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      
      // Update central laser dot
      cur.style.left = `${cx}px`;
      cur.style.top = `${cy}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Lerped trail animation frame
    let animId: number;
    const trailLoop = () => {
      tcx += (cx - tcx) * 0.14;
      tcy += (cy - tcy) * 0.14;
      
      curt.style.left = `${tcx}px`;
      curt.style.top = `${tcy}px`;
      
      animId = requestAnimationFrame(trailLoop);
    };
    trailLoop();

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Custom Cursor Elements */}
      <div className="hidden md:block pointer-events-none">
        <div id="cursor" />
        <div id="cursor-trail" />
      </div>

      {/* Preloader Splash screen */}
      {loading && (
        <div id="loader" className="fixed inset-0 bg-[#0a0a0f] z-[10000] flex flex-col items-center justify-center gap-[20px]">
          <div id="loader-icon">⚖️</div>
          <div id="loader-bar">
            <div id="loader-fill" />
          </div>
          <div id="loader-text">Loading CaseWatch</div>
        </div>
      )}
    </>
  );
}
export default ClientEffects;
