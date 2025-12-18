/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Modern system stack for best mobile readability
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      colors: {
        // Custom settlement-themed colors
        settlement: {
          blue: '#0284c7', // Sky-600
          teal: '#0d9488', // Teal-600
          navy: '#0f172a', // Slate-900
        }
      }
    }
  },
  plugins: []
}
