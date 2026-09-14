/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F5',
        surface: '#FFFFFF',
        charcoal: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2A2A2A',
        },
        terracotta: {
          500: '#E05A2B',
          600: '#D9531E',
          700: '#B83F12',
        },
        forest: {
          700: '#2D4B3E',
          800: '#1E362C',
        },
        warmgray: {
          100: '#F3F0EC',
          200: '#E8E4DF',
          500: '#8C857B',
          700: '#5C5852',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 18, 18, 0.05)',
        'lifted': '0 12px 32px -4px rgba(18, 18, 18, 0.08)',
        'drawer': '-10px 0 40px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
