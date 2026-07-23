/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F0',
        surface: '#FFFFFF',
        ink: '#14161B',
        'ink-soft': '#565A66',
        lime: '#C8FF3D',
        coral: '#FF5A3C',
        success: '#16A34A',
        border: '#E9E4D8',
        muted: '#F1EEE6',
        destructive: '#DC2626',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        sheet: '28px',
        ticket: '16px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(20,22,27,.06)',
        sheet: '0 -8px 32px rgba(20,22,27,.12)',
        float: '0 8px 24px rgba(20,22,27,.14)',
      },
    },
  },
  plugins: [],
}
