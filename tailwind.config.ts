import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-anton)', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        bg: '#f4f6fc',
        surface: '#fff',
        surface2: '#f0f3fb',
        ink: '#15182b',
        muted: '#5f6478',
        faint: '#b7bed4',
        line: 'rgba(21,24,43,.10)',
        line2: 'rgba(21,24,43,.18)',
        blue: {
          DEFAULT: '#3855e5',
          dark: '#2f47bf',
          light: '#5971e9',
          lightest: '#d7ddfa',
        },
        navy: {
          DEFAULT: '#1b2358',
          2: '#2c3a8c',
          lightest: '#e7ebf8',
        },
        accent: {
          DEFAULT: '#fe4624',
          dark: '#cb381c',
          lightest: '#feece9',
        },
      },
      borderRadius: {
        s: '8px',
        m: '16px',
        l: '32px',
      },
      boxShadow: {
        s95: '0 1px 2px rgba(21,24,43,.05), 0 8px 24px rgba(21,24,43,.06)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #1b2358 0%, #2c3a8c 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
