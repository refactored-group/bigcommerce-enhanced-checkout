/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#512a74',
        hover: '#4a276b',
        preferred: '#f9a826',
      },
    },
  },
  plugins: [],
}

