/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities, theme }) {
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

      const darkModelUtilities = {
        '.dark-modal': {
          'background-color': theme('colors.neutral.800'),
          color: theme('colors.white'),
        },
      };

      addUtilities(darkModelUtilities);
    },
  ],
};
