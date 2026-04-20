import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(210 18% 90%)",
        input: "hsl(210 18% 95%)",
        ring: "hsl(222 47% 11%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(224 11% 14%)",
        muted: {
          DEFAULT: "hsl(210 20% 98%)",
          foreground: "hsl(215 13% 45%)",
        },
        primary: {
          DEFAULT: "hsl(224 11% 14%)",
          foreground: "hsl(0 0% 100%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
