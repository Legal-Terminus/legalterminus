/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#374151',
          muted: '#6b7280',
          faint: '#9ca3af',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f8f9fa',
          card: '#f5f5f5',
          strong: '#e5e7eb',
          dark: '#101010',
        },
        hairline: {
          DEFAULT: '#e5e7eb',
          soft: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
        sidebar: '1px 0 0 0 #e5e7eb',
        md: '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      screens: {
        xs: '375px',
      },
      keyframes: {
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(37,99,235,0.45)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(37,99,235,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0)' },
        },
        'flow-dash': {
          to: { backgroundPosition: '0 -16px' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s infinite',
        'flow-dash': 'flow-dash 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
