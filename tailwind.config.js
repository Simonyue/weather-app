/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        weather: {
          dark: '#0f172a',
          card: 'rgba(30, 41, 59, 0.7)',
          cardHover: 'rgba(51, 65, 85, 0.8)',
          accent: '#38bdf8',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
