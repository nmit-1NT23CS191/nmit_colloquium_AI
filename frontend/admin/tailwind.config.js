/** @type {import('tailwindcss').Config} */
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: 'var(--bg-main)',
        card: 'var(--bg-card)',
        muted: 'var(--text-muted)',
        'text-main': 'var(--text-main)',
        'border-main': 'var(--border-color)',
      }
    },
  },
  plugins: [animatePlugin],
}

