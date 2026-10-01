/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blanco: '#ffffff',
        petalo: '#f3c4c0',
        seda: '#f8d0cb',
        'rosa-palo': '#a94f63',
        vino: '#5b2333',
        ciruela: '#3e1a26',
        malva: '#8a5a6b',
        champagne: '#c6a27c',
        borde: '#ebd3ce',
      },
      fontFamily: {
        titulo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        texto: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}