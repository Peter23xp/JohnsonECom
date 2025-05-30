/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C0C0C',
        background: '#F5F5F5',
        text: '#1A1A1A',
        accent: '#8A9A5B',
        secondary: '#D6CAB4',
        hover: '#A3B18A',
        neutral: '#C4C4C4'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
} 