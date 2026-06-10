/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],

  theme: {
    extend: {
      colors: {
        'shadow-red': '#ff003c',

        abyss: {
          900: '#09090b',
          800: '#18181b',
          700: '#27272a'
        }
      }
    }
  },

  plugins: []
}