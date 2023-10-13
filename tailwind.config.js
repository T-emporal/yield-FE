/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { colors: { temporal: "#00A9A4" } },
  },
  plugins: [require("@tailwindcss/forms")],
};
