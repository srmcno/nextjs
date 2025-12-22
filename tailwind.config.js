/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Gill Sans family - using web-safe alternatives
        // Gill Sans -> Gill Sans MT -> Calibri -> sans-serif fallback
        sans: [
          'Gill Sans',
          'Gill Sans MT',
          'Calibri',
          'Trebuchet MS',
          'sans-serif'
        ]
      },
      colors: {
        // Official Choctaw Nation Brand Colors
        choctaw: {
          // Primary Brand Colors
          brown: '#421400',      // PMS 4625 - Primary logo brown
          green: '#00853E',      // PMS 356 - Natural Resources/Environmental
          
          // Great Seal Colors
          sealBlue: '#009ADA',   // PMS 2925
          sealRed: '#EF373E',    // PMS 1795
          sealYellow: '#C9A904', // PMS 116
          
          // Lighter variations for backgrounds
          brownLight: '#5a1c00',
          greenLight: '#00a84d',
        },
        // Legacy colors for backward compatibility
        settlement: {
          blue: '#009ADA',       // Updated to Great Seal Blue
          teal: '#00853E',       // Updated to Natural Resources Green
          navy: '#421400',       // Updated to Choctaw Brown
        }
      }
    }
  },
  plugins: []
}
