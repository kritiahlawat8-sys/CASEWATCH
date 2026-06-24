/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#000000',
          card: '#050505',
          terminal: '#0a0a0a',
        },
        brand: {
          cyan: '#00F0FF',
          blue: '#0055FF',
          violet: '#8B5CF6',
          emerald: '#10B981',
          crimson: '#EF4444',
        },
        muted: {
          text: '#A3A3A3',
          border: '#262626',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'scan': 'scan 6s linear infinite',
        'grid-shift': 'grid-shift 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'border-flow': 'border-flow 4s ease infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'grid-shift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-flow': {
          '0%, 100%': { 'border-color': 'rgba(6, 182, 212, 0.2)' },
          '50%': { 'border-color': 'rgba(139, 92, 246, 0.6)' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 60%)',
        'violet-glow': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
