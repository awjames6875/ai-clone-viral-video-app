import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // n8n-inspired color palette
        background: "#0D0D0D",
        surface: "#1A1A1A",
        "surface-hover": "#242424",
        border: "#2E2E2E",

        // Primary accent (n8n coral)
        primary: {
          DEFAULT: "#FF6D5A",
          hover: "#FF8574",
          muted: "#FF6D5A20",
        },

        // Secondary (teal/mint)
        secondary: {
          DEFAULT: "#00D4AA",
          hover: "#00E4BA",
          muted: "#00D4AA20",
        },

        // Tertiary (purple)
        tertiary: {
          DEFAULT: "#7C5CFF",
          hover: "#8E72FF",
          muted: "#7C5CFF20",
        },

        // Text colors
        foreground: "#FFFFFF",
        "foreground-secondary": "#A1A1A1",
        "foreground-muted": "#6B6B6B",

        // Status colors
        status: {
          pending: "#FBBF24",
          approved: "#7C5CFF",
          ready: "#00D4AA",
          posted: "#22C55E",
          failed: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
