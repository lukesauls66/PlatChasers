import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        custom_silver: "#C0C0C0",
        electricBlue: "#00FFFF",
        neonGreen: "#39FF14",
        crimson: "#DC143C",
        darkPurple: "#5D2F6E",
      },
    },
  },
  plugins: [],
} satisfies Config;
