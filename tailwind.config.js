/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // для React / Next.js
    "./public/index.html"          // для статических HTML
  ],
  safelist: [
    "bg-green-200",
    "text-green-800",
    "bg-red-200",
    "text-red-800"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
