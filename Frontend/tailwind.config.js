/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#3490dc",
          "secondary": "#ffed4a",
          "accent": "#38c172",
          "neutral": "#f5f5f5",
          "base-100": "#ffffff", // Set base-100 to white
        },
      },
    ],
  },
}
