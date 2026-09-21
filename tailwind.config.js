/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f7f7f8', 100: '#eeeef1', 200: '#d9d9e0', 300: '#b8b8c4',
          400: '#8f8fa0', 500: '#6f6f82', 600: '#585869', 700: '#474756',
          800: '#2a2a35', 900: '#16161d', 950: '#0a0a0f',
        },
        ember: {
          50: '#fff6ed', 100: '#ffe9d4', 200: '#ffcfa8', 300: '#ffad70',
          400: '#ff8037', 500: '#ff5f0f', 600: '#f04306', 700: '#c73007',
          800: '#9e280e', 900: '#7f250f',
        },
        crimson: {
          50: '#fef2f3', 100: '#fde3e5', 200: '#fbccd0', 300: '#f7a3aa',
          400: '#f06d79', 500: '#e33d4d', 600: '#c81d31', 700: '#a81527',
          800: '#8c1524', 900: '#781524',
        },
        gold: {
          50: '#fdfaef', 100: '#faf1d1', 200: '#f4e1a0', 300: '#edc965',
          400: '#e6b13c', 500: '#d99722', 600: '#c0751b', 700: '#a05619',
          800: '#83441b', 900: '#6c3919',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'flame-gradient': 'linear-gradient(135deg, #ff5f0f 0%, #c81d31 100%)',
        'gold-gradient': 'linear-gradient(135deg, #edc965 0%, #d99722 100%)',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(0,0,0,0.35)',
        glow: '0 0 30px -5px rgba(255,95,15,0.45)',
        glass: '0 8px 32px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
