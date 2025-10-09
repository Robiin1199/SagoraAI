import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F2F7FF",
          100: "#E6F0FF",
          200: "#BDD7FF",
          300: "#94BDFF",
          400: "#4C8BFF",
          500: "#1C5DFF",
          600: "#1446CC",
          700: "#0E3399",
          800: "#082266",
          900: "#041333"
        },
        success: "#22c55e",
        warning: "#facc15",
        danger: "#ef4444"
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(28, 93, 255, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
