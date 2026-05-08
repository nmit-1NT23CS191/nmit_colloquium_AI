/** @type {import('tailwindcss').Config} */
import animatePlugin from "tailwindcss-animate";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [animatePlugin],
}