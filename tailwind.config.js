/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { colors: { temporal: "#00A9A4", temporal50: "#00A9A488" } },
    screens: { lg: "1280px", xl: "1440px", "2xl": "1600px", "3xl": "1920px" },
  },
  plugins: [require("@tailwindcss/forms")],
};
