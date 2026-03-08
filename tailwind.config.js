/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf8',
          100: '#d1f5ee',
          500: '#0f766e',
          700: '#115e59',
          900: '#0b3b39',
        },
      },
    },
  },
  plugins: [],
}
