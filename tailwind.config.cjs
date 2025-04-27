/* eslint-disable @typescript-eslint/no-require-imports */
const typography = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page:        '#f5f5f5',
        'page-dark': '#0e1217',
        card:        '#ffffff',
        'card-dark': '#111827',
        toolbar:       '#ffffff',
        'toolbar-dark':'#111827',
        accent:       '#0284c7',
        'accent-dark':'#38bdf8',
        'text-primary':      '#111827',
        'text-primary-dark': '#e5e7eb',
        'text-secondary':      '#4b5563',
        'text-secondary-dark':'#9ca3af',
      },
    },
  },
  plugins: [
    typography,
  ],
}
