/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core surfaces — deep, near-black with a cool tint
        ink: {
          950: '#070b10',
          900: '#0b1118',
          850: '#0f1722',
          800: '#131d2b',
          700: '#1b2738',
          600: '#26354b',
        },
        // Pitch green — the primary brand accent
        pitch: {
          DEFAULT: '#13d97a',
          400: '#3ee68f',
          500: '#13d97a',
          600: '#0fae62',
          700: '#0b8a4e',
        },
        // Memecoin pop — electric lime / acid yellow for $WC26 energy
        volt: {
          DEFAULT: '#d6ff3d',
          400: '#e2ff6b',
          500: '#d6ff3d',
          600: '#b6e600',
        },
        // Secondary accent for knockout / heat
        flare: {
          DEFAULT: '#ff5d3b',
          400: '#ff7a5e',
          500: '#ff5d3b',
          600: '#e63f1d',
        },
      },
      fontFamily: {
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(19,217,122,0.25), 0 8px 30px -8px rgba(19,217,122,0.35)',
        volt: '0 0 0 1px rgba(214,255,61,0.3), 0 8px 30px -8px rgba(214,255,61,0.4)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'pitch-stripes':
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 44px)',
        'radial-glow':
          'radial-gradient(900px 500px at 50% -10%, rgba(19,217,122,0.18), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'ball-roll': {
          '0%': { transform: 'translateX(-6px) rotate(0deg)' },
          '100%': { transform: 'translateX(6px) rotate(360deg)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'pop-in': 'pop-in 0.3s ease-out both',
        confetti: 'confetti linear forwards',
      },
    },
  },
  plugins: [],
}
