module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          200: '#f4d88a',
          400: '#d4a750',
          500: '#c18f3a',
          700: '#8a5b1f'
        },
        night: {
          900: '#0b0a09',
          800: '#141210',
          700: '#1c1814'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(212, 167, 80, 0.25)'
      }
    }
  },
  plugins: []
};