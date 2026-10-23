import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Brand palette: royal blue for trust, orange for the quote and call buttons.
      // The names come from the first (auto-only) design and are kept so every page keeps working.
      colors: {
        asphalt: "#11294F", // ink: headings, strong text, text on orange buttons
        navy: "#173B73", // deep blue: dark bands, footer, hero overlay
        road: "#475569", // body text
        line: { DEFAULT: "#F28C28", dark: "#E07818" }, // orange: primary calls to action
        sky: "#2864B4", // royal blue: links, eyebrows, secondary buttons
        mist: "#F5F8FC", // pale blue-gray section background
        rail: "#DCE3ED", // borders
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
