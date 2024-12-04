import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      h1: [
        "1.5rem",
        {
          lineHeight: "1.5rem",
        },
      ],
      h2: [
        "0.875rem",
        {
          lineHeight: "0.875rem",
        },
      ],
      h3: [
        "0.75rem",
        {
          lineHeight: "0.75rem",
        },
      ],
    },
    colors: {
      mutedGray: "#71717A",
      gray: "#A1A1AA",
      "bg-filed": "#212124",
      white: "#ffffff",
      darkgreen: "#05A37D",
      black: "#000000",
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
