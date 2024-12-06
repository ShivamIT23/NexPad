module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--background-primary)',
          600: 'var(--background-primary-hover)',
          700: 'var(--background-primary-active)',
        },
        neutral: {
          100: 'var(--background-neutral-hover)',
          200: 'var(--background-neutral-active)',
          400: 'var(--foreground-neutral-disabled)',
          600: 'var(--foreground-neutral)',
        }
      }
    }
  }
} 