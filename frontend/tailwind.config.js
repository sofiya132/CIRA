/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F9FA",
        surface: "#FFFFFF",
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Institutional Deep Indigo
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          cobalt: '#2563EB',
        },
        urgency: {
          critical: {
            bg: '#FEF2F2',
            border: '#FECACA',
            text: '#B91C1C',
            badge: '#991B1B',
            dot: '#EF4444',
          },
          high: {
            bg: '#FFFBEB',
            border: '#FDE68A',
            text: '#B45309',
            badge: '#92400E',
            dot: '#F59E0B',
          },
          medium: {
            bg: '#F0F9FF',
            border: '#BAE6FD',
            text: '#0369A1',
            badge: '#075985',
            dot: '#0EA5E9',
          },
          low: {
            bg: '#F4F4F5',
            border: '#E4E4E7',
            text: '#52525B',
            badge: '#3F3F46',
            dot: '#71717A',
          },
          resolved: {
            bg: '#F0FDF4',
            border: '#BBF7D0',
            text: '#15803D',
            badge: '#166534',
            dot: '#22C55E',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 6px -1px rgba(15, 23, 42, 0.06), 0 1px 4px -2px rgba(15, 23, 42, 0.04)',
        'float': '0 12px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'converge-in': {
          '0%': { opacity: 0, transform: 'scale(0.96) translateX(-10px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateX(0)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'converge-in': 'converge-in 0.35s ease-out forwards',
      }
    },
  },
  plugins: [],
}
