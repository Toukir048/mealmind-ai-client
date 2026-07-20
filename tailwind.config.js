import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { canvas: '#fffaf2' },
      borderRadius: { card: '1rem' },
      boxShadow: { soft: '0 10px 30px rgba(41, 37, 36, 0.08)' },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mealmind: {
          primary: '#059669',
          secondary: '#d97706',
          accent: '#ef6f61',
          neutral: '#292524',
          'base-100': '#fffaf2',
          'base-200': '#f5efe6',
          'base-300': '#e7ded2',
          'base-content': '#292524',
          info: '#059669',
          success: '#059669',
          warning: '#d97706',
          error: '#ef6f61'
        },
      },
    ],
  },
};
