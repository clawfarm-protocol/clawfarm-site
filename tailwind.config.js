/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)',
        ink: 'var(--text-high)',
        'ink-mid': 'var(--text-mid)',
        'ink-low': 'var(--text-low)',
        'ink-dim': 'var(--text-dim)',
        accent: 'var(--accent)',
        signal: 'var(--green)',
        amber: 'var(--amber)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif-italic)'],
      },
      fontSize: {
        'display-sm': ['clamp(40px, 6vw, 56px)', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(56px, 8vw, 80px)', { lineHeight: '1.02', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(72px, 10vw, 112px)', { lineHeight: '0.98', letterSpacing: '-0.055em' }],
        'display-xl': ['clamp(88px, 12vw, 128px)', { lineHeight: '0.96', letterSpacing: '-0.06em' }],
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter: '-0.045em',
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
      },
      backdropBlur: {
        chrome: '14px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
    },
  },
  plugins: [],
}
