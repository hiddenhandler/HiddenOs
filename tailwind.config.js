/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:    { DEFAULT: '#F5F0E8', 2: '#EDE8DC', 3: '#E4DDCE', 4: '#D8D0BF' },
        parchment:'#FAF7F2',
        ink:      { DEFAULT: '#1A1510', 2: '#2E2820', 3: '#5C5242', 4: '#8A7D6A' },
        gold:     { DEFAULT: '#8B6914', 2: '#B08A2A', 3: '#D4A840' },
        sage:     { DEFAULT: '#2D6B4A', light: 'rgba(45,107,74,0.12)' },
        crimson:  { DEFAULT: '#8B2020', light: 'rgba(139,32,32,0.08)' },
        navy:     { DEFAULT: '#1E4A7A', light: 'rgba(30,74,122,0.08)' },
      },
      fontFamily: {
        sans:  ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono:  ['Space Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,21,16,0.06), 0 4px 16px rgba(26,21,16,0.04)',
        'card-md': '0 2px 8px rgba(26,21,16,0.08), 0 12px 32px rgba(26,21,16,0.06)',
      },
    },
  },
  plugins: [],
}
