const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}-rgb) / ${opacityValue})`;
    }
    return `var(${variableName})`;
  };
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        theme: {
          bg: withOpacity('--bg-primary'),
          'bg-secondary': withOpacity('--bg-secondary'),
          surface: withOpacity('--surface-color'),
          'surface-elevated': withOpacity('--surface-elevated'),
          'navbar-bg': withOpacity('--navbar-bg'),
          'navbar-border': withOpacity('--navbar-border'),
          'card-bg': withOpacity('--card-bg'),
          'card-hover': withOpacity('--card-hover'),
          'input-bg': withOpacity('--input-bg'),
          'input-border': withOpacity('--input-border'),
          'input-focus': withOpacity('--input-focus'),
          text: withOpacity('--text-primary'),
          'text-secondary': withOpacity('--text-secondary'),
          'text-muted': withOpacity('--text-muted'),
          'text-heading': withOpacity('--text-heading'),
          primary: withOpacity('--color-primary'),
          'accent-hover': withOpacity('--accent-hover'),
          'accent-active': withOpacity('--accent-active'),
          'text-on-primary': withOpacity('--text-on-primary'),
          link: withOpacity('--link-color'),
          'link-hover': withOpacity('--link-hover'),
          border: withOpacity('--border-color'),
          divider: withOpacity('--divider-color'),
          'hover-surface': withOpacity('--hover-surface'),
          'selected-surface': withOpacity('--selected-surface'),
          overlay: withOpacity('--overlay-bg'),
          'success': withOpacity('--success-color'),
          'success-bg': withOpacity('--success-bg'),
          'success-border': withOpacity('--success-border'),
          'warning': withOpacity('--warning-color'),
          'warning-bg': withOpacity('--warning-bg'),
          'warning-border': withOpacity('--warning-border'),
          'error': withOpacity('--error-color'),
          'error-bg': withOpacity('--error-bg'),
          'error-border': withOpacity('--error-border'),
          'info': withOpacity('--info-color'),
          'info-bg': withOpacity('--info-bg'),
          'info-border': withOpacity('--info-border'),
          'disabled-bg': withOpacity('--disabled-bg'),
          'disabled-text': withOpacity('--disabled-text'),
          'skeleton-bg': withOpacity('--skeleton-bg'),
          'skeleton-highlight': withOpacity('--skeleton-highlight'),
          'tooltip-bg': withOpacity('--tooltip-bg'),
          'tooltip-text': withOpacity('--tooltip-text'),
          scrollbar: withOpacity('--scrollbar-color'),
          selection: withOpacity('--selection-color'),
          focus: withOpacity('--focus-ring'),
          'footer-bg': withOpacity('--footer-bg'),
          'footer-heading': withOpacity('--footer-heading'),
          'footer-text': withOpacity('--footer-text'),
          'footer-muted': withOpacity('--footer-muted'),
          'footer-border': withOpacity('--footer-border'),
          'footer-icon': withOpacity('--footer-icon'),
          'footer-hover': withOpacity('--footer-hover'),
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          305: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },

        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },

        neutral: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },

      backgroundImage: {
        'radial': 'radial-gradient(closest-side at 0 0, var(--tw-gradient-stops))',
      },

      fontFamily: {
        sans: [
          'Avenir',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif'
        ],

        outfit: [
          'Outfit',
          'sans-serif'
        ],
      },


      spacing: {
        128: '32rem',
        144: '36rem',
      },


      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },


      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },


      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '40px' }],
        '4xl': ['40px', { lineHeight: '48px' }],
      },


      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-medium': 'floatMedium 6s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'drift-slow': 'drift 30s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out',
      },


      keyframes: {
        floatSlow: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-15px)',
          },
        },

        floatMedium: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(1deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(-1deg)',
          },
        },

        floatFast: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-6px)',
          },
        },

        pulseSubtle: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.85',
          },
        },
      },

    },
  },

  plugins: [],
}