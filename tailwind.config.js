/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    'space-x-2',
    'space-y-4',
    'overflow-hidden',
    // Add other classes that are being purged
    {
      pattern: /space-(x|y)-./,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}