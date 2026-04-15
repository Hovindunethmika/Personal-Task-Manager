/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0D0D",
          50: "#1a1a1a",
          100: "#111111",
        },
        paper: {
          DEFAULT: "#F5F0E8",
          dark: "#EDE8DF",
        },
        accent: {
          DEFAULT: "#E8572A",
          hover: "#D44820",
        },
        muted: "#8C8070",
        done: "#2A7A4B",
        progress: "#2A5FE8",
      },
      animation: {
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.25s ease forwards",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
