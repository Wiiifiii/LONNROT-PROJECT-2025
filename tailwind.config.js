import typography from '@tailwindcss/typography';
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
        // Page background
        page:       '#f5f5f5',
        'page-dark':'#0e1217',
        // Card / reader background
        card:       '#ffffff',
        'card-dark':'#111827',
        // Toolbar background
        toolbar:       '#ffffff',
        'toolbar-dark':'#111827',
        // Accent (links, highlights)
        accent:      '#0284c7',
        'accent-dark':'#38bdf8',
        // Primary text
        'text-primary':      '#111827',
        'text-primary-dark': '#e5e7eb',
        // Secondary text
        'text-secondary':      '#4b5563',
        'text-secondary-dark': '#9ca3af',
      }
    }
  },
  plugins: [
    typography,
  ],
}
