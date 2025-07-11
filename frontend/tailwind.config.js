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
        thumbsUp: {
          '0%, 100%': { transform: 'scale(1) rotateZ(0deg)' },
          '50%': { transform: 'scale(1.5) rotateZ(-45deg)' },
        },

        beltSwing: {
          '0%, 100%': { transform: 'rotateZ(0deg)' },
          '20%': { transform: 'rotateZ(-25deg)' },
          '50%': { transform: 'rotateZ(25deg)' },
          '80%': { transform: 'rotateZ(-15deg)' },
        },
      },
      animation: {
        'opacity-pulse': 'opacityAndPulse 2s ease-in-out infinite',
        'wave-loading': 'wave 2s ease-in-out infinite',
        'wave-opacity': 'wave 2s ease-in-out infinite,opacityAndPulse 2s ease-in-out infinite',
        'slide-right': 'slideRight 0.25s  ease-out',
        'slide-left': 'slideLeft 0.25s ease-out ',
        'thumbs-up': 'thumbsUp 0.5s ease-in-out',
        'belt-swing': 'beltSwing 0.7s ease-in-out',
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
          'background-color': theme('colors.neutral.600'),
          color: theme('colors.white'),
        },
      };

      addUtilities(darkModelUtilities);
    },
  ],
};
