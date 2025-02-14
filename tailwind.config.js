/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A276B',
        secondary: '#f26b20',
        hover: '#4a276b',
        preferred: '#f9a826',
        'preferred-light': '#fffaf2',
        'custom-gray': '#f9fafc'
      },
      animation: {
        'custom-ping': 'custom-ping 1.8s ease-in-out infinite',
      },
      keyframes: {
        'custom-ping': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

