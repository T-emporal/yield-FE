import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { colors: { temporal: "#00A9A4", temporal50: "#00A9A488" } },
    screens: { lg: "1280px", xl: "1440px", "2xl": "1600px", "3xl": "1920px" },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
