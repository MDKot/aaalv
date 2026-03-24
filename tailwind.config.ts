import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-dark": "#A88B3D",
        charcoal: "#1A1A1A",
        "charcoal-light": "#2A2A2A",
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      keyframes: {
        "pulse-bg": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "pulse-bg": "pulse-bg 8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
