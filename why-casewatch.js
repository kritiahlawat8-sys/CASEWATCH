/**
 * why-casewatch.js
 * ─────────────────────────────────────────────────────
 * Optimised vanilla JS implementation for the scroll-driven text reveal.
 * Features:
 *   1. Text Spanning — splits paragraph words into individual single spans
 *                      preserving semantic wrappers (em, strong).
 *   2. Geometry Caching — caches layout measurements on resize/load to prevent
 *                          layout thrashing (DOM read/write isolation).
 *   3. Passive rAF Scroll Loop — debounces scroll updates for 60fps performance.
 *   4. Overview Animations — IntersectionObserver for section entrances.
 */

(function () {
  'use strict';

  /** Clamp a value between lo and hi */
  function clamp(val, lo, hi) {
    return Math.max(lo, Math.min(hi, val));
  }

  /* ── 1. Text Splitter ──────────────────────────────── */

  /**
   * Recursively splits text nodes into spans with class 'reveal-word'.
   * Preserves inline formatting tags like <em> and <strong>.
   */
  function splitIntoWords(el) {
    const wordSpans = [];

    function recurse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        // Split by whitespace characters, keeping them as tokens
        const tokens = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        tokens.forEach(token => {
          if (/^\s+$/.test(token)) {
            // Re-insert whitespace text nodes for natural spacing
            fragment.appendChild(document.createTextNode(token));
          } else if (token !== '') {
            const span = document.createElement('span');
            span.className = 'reveal-word';
            span.textContent = token;
            fragment.appendChild(span);
            wordSpans.push(span);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Convert childNodes to array first since DOM is mutated in-place
        const children = Array.from(node.childNodes);
        children.forEach(child => recurse(child));
      }
    }

    recurse(el);
    return wordSpans;
  }

  /* ── 2. Scroll Animation Engine ────────────────────── */

  function initRevealAnimation() {
    const whySection = document.getElementById('why-casewatch');
    const revealEl   = document.getElementById('why-reveal-text');

    if (!whySection || !revealEl) return;

    // Split text into spans
    const words = splitIntoWords(revealEl);
    const totalWords = words.length;

    if (totalWords === 0) return;

    // Layout Cache Variables
    let textElementTopOnPage = 0;
    let windowHeight = 0;

    // Track how many words were lit last frame
    let lastLitCount = -1;

    // Performance-optimised layout caching
    function cacheLayout() {
      const rect = revealEl.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      textElementTopOnPage = rect.top + scrollTop;
      windowHeight = window.innerHeight;
    }

    // Initial cache run
    cacheLayout();

    // Re-cache layout on resize, load, and DOM updates
    window.addEventListener('resize', cacheLayout, { passive: true });
    window.addEventListener('load', cacheLayout, { passive: true });

    // Progress Calculation
    function updateProgress() {
      const scrollTop = window.scrollY || window.pageYOffset;

      // Reveal starts when top of paragraph enters the bottom of the viewport,
      // and completes when the top of the paragraph reaches the middle (50vh)
      const startScroll = textElementTopOnPage - windowHeight;
      const endScroll   = textElementTopOnPage - windowHeight * 0.5;
      const scrollRange = endScroll - startScroll;

      if (scrollRange <= 0) return;

      const progress = clamp((scrollTop - startScroll) / scrollRange, 0, 1);

      // Illuminate Words (based on progress percentage)
      const litCount = Math.round(progress * totalWords);

      if (litCount !== lastLitCount) {
        for (let i = 0; i < totalWords; i++) {
          if (i < litCount) {
            if (!words[i].classList.contains('is-lit')) {
              words[i].classList.add('is-lit');
            }
          } else {
            if (words[i].classList.contains('is-lit')) {
              words[i].classList.remove('is-lit');
            }
          }
        }
        lastLitCount = litCount;
      }
    }

    // Passive scroll handler using requestAnimationFrame
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial run on mount/load
    updateProgress();
  }

  /* ── 3. Overview Section (Stagger Entrance) ───────── */

  function initOverviewAnimations() {
    const header = document.querySelector('.overview-header.js-fade-in-up');
    const cards  = document.querySelectorAll('.feature-card.js-stagger-card');

    if (!header && !cards.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    if (header) {
      const headerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { ...observerOptions, threshold: 0.2 });

      headerObserver.observe(header);
    }

    if (cards.length) {
      const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index, 10) || 0;
            entry.target.style.transitionDelay = `${idx * 90}ms`;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      cards.forEach(card => cardObserver.observe(card));
    }
  }

  /* ── Initialization ────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRevealAnimation();
      initOverviewAnimations();
    });
  } else {
    initRevealAnimation();
    initOverviewAnimations();
  }

})();