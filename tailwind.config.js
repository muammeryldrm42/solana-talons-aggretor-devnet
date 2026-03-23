/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0d1324",
        "surface-2": "#121a30",
        "surface-3": "#182240",
        border: "#263251",
        ink: "#eef3ff",
        muted: "#9dafd6",
        accent: "#64f1d6",
        accent2: "#6ea8ff",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(100,241,214,0.08), 0 16px 48px rgba(4,12,29,0.35)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(110,168,255,0.24), transparent 35%), radial-gradient(circle at top right, rgba(100,241,214,0.18), transparent 30%), linear-gradient(180deg, rgba(15,22,42,1) 0%, rgba(6,9,17,1) 100%)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
