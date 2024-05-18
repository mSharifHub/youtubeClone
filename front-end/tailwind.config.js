/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },

        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },

        '.show-scrollbar::-webkit-scrollbar': {
          display: 'block',
        },
        '.show-scrollbar': {
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
        },
      };
      addUtilities(utilities);
    },
  ],
};
