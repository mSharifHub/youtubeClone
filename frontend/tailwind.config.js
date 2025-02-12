/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },

        opacityAndPulse: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        },

        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1.5px)' },
        },


      },
      animation: {
        'opacity-pulse': 'opacityAndPulse 2s ease-in-out infinite',
        'wave-loading': 'wave 2s ease-in-out infinite',
        'wave-opacity':
          'wave 2s ease-in-out infinite,opacityAndPulse 2s ease-in-out infinite',
        'slide-right': 'slideRight 0.25s  ease-out',
        'slide-left': 'slideLeft 0.25s ease-out ',
      },

      colors: {
        darkTheme: '#0f0f0f',
      },
    },
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
