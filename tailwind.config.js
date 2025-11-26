/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale - Midnight Purple Premium
        surface: {
          DEFAULT: '#0a0118',
          50: '#1a0f2e',
          100: '#1f1538',
          200: '#291d45',
          300: '#362a54',
        },
        accent: {
          DEFAULT: '#a78bfa',
          light: '#c4b5fd',
          dark: '#8b5cf6',
          muted: 'rgba(167, 139, 250, 0.15)',
        },
        primary: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#ec4899',
          light: '#f9a8d4',
          dark: '#db2777',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(167, 139, 250, 0.4)',
        'glow-sm': '0 0 20px rgba(167, 139, 250, 0.25)',
        'glow-md': '0 10px 40px rgba(167, 139, 250, 0.3)',
        'glow-lg': '0 20px 60px rgba(167, 139, 250, 0.35)',
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.5)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.7)',
        'elevated-lg': '0 20px 50px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

