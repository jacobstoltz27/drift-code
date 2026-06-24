/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        indigo: '#3A36FF',
        bg: '#050505',
        card: '#0d0d12',
        surface: '#08080f',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['Clash Display', 'DM Serif Display', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
