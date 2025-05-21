/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'sceen':'#F3F3E0',
        'themeblue':'#133E87',
        'lightblue':'#608BC1',
        'skyblue':'#133E87',
        'lightgray':'#f9f9f9',
        'purple':'#3d4465'
      }
    },
  },
  plugins: [],
}

