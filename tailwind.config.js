const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: "class", 
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {fontFamily: {
      manrope: ['Manrope', 'sans-serif'],
      serifDisplay: ['"DM Serif Display"', 'serif'],
    },
  },

  },
  darkMode: 'class',
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-ultra-thin::-webkit-scrollbar': {
          width: '8px',
        },
        '.scrollbar-ultra-thin::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '.scrollbar-ultra-thin::-webkit-scrollbar-thumb': {
          'background-color': '#d1d5db', // light mode: gray-300
          'border-radius': '8px',
        },
        '.dark .scrollbar-ultra-thin::-webkit-scrollbar-thumb': {
          'background-color': '#6B7280', // dark mode: emerald-400
        },

        '.scrollbar-stock-selector::-webkit-scrollbar': {
          height: '8px', // horizontal scrollbar height
        },
        '.scrollbar-stock-selector::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '.scrollbar-stock-selector::-webkit-scrollbar-thumb': {
          'background-color': '#d1d5db', // gray-400
          'border-radius': '8px',
        },
        '.dark .scrollbar-stock-selector::-webkit-scrollbar-thumb': {
          'background-color': '#6B7280', // emerald-400
        },
      });
    }),
  ],
  safelist: [
    'bg-[#232a31]',
    'dark:bg-[#1d2228]',
    'ring-black/10',
    'shadow-2xl',
    'rounded-xl',
    'divide-gray-700',
    'hover:bg-gray-700',
    'text-red-400',
    'hover:text-red-600'
  ],
}
