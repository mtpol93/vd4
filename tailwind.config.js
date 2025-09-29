/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Title', 'sans-serif'],
        body: ['Body', 'sans-serif'],
        sans: ['Body', 'sans-serif'], // Make Body the default sans font
      },
    },
  },
  plugins: [],
};