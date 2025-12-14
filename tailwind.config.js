/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        classivo: {
          cream: "rgb(var(--classivo-cream) / <alpha-value>)",
          lightblue: "rgb(var(--classivo-lightblue) / <alpha-value>)",
          blue: "rgb(var(--classivo-blue) / <alpha-value>)",
          black: "rgb(var(--classivo-black) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
