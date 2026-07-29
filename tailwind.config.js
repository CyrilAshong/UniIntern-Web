/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2b4a',
          light: '#2d4270',
          dark: '#0f1a2e',
        },
        teal: {
          DEFAULT: '#00c896',
          light: '#e6faf5',
          dark: '#00a87e',
        },
      },
    },
  },
  plugins: [],
}