import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        villa: {
          cream: '#FAF7F2',
          green: '#3D5A3E',
          'green-light': '#5C7D5D',
          gold: '#C9A84C',
          dark: '#1A1A1A',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
