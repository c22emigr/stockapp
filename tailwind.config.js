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
  plugins: [],
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
