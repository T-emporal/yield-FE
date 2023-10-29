/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { colors: { temporal: "#00A9A4", temporal50: "#00A9A488" } },
  },
  plugins: [require("@tailwindcss/forms")],
};
