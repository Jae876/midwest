export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Midwest Heritage-inspired palette: warm neutrals + deep forest green
        'ibkr-navy': '#173f38',
        'ibkr-blue': '#6d8f81',
        'ibkr-light-blue': '#f5efe7',
        'ibkr-dark': '#112d29',
        'ibkr-gray-900': '#1f2d2b',
        'ibkr-gray-800': '#2a3b37',
        'ibkr-gray-700': '#425a54',
        'ibkr-gray-600': '#59736d',
        'ibkr-gray-500': '#7d918a',
        'ibkr-gray-400': '#a6b5af',
        'ibkr-gray-300': '#d7ded8',
        'ibkr-gray-200': '#e9efe9',
        'ibkr-gray-100': '#f5f3ef',
        'ibkr-success': '#4d7c6a',
        'ibkr-warning': '#c28b4c',
        'ibkr-danger': '#b6534d',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium': '0 8px 16px -2px rgba(90, 26, 36, 0.1)',
        'outline': '0 0 0 1px rgba(90, 26, 36, 0.1)',
      },
      borderWidth: {
        '3': '3px',
      },
      borderColor: {
        'ibkr': '#e5e7eb',
      },
    },
  },
  plugins: [],
}
