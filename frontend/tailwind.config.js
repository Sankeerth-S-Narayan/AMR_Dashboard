/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          650: '#374151',
          750: '#1f2937',
        }
      }
    },
  },
  plugins: [],
}
