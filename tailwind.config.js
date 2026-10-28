const c = (v) => `rgb(var(--${v}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        ink: c('ink'),
        muted: c('muted'),
        line: c('line'),
        accent: c('accent'),
        'accent-ink': c('accent-ink'),
        sun: c('sun'),
        'sun-ink': c('sun-ink'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
