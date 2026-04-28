/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void: "#080810",
        surface: { 1: "#0E0E1A", 2: "#13131F", 3: "#1A1A28", 4: "#22223A" },
        neon: {
          violet: "#7C3AED", glow: "#A855F7", pink: "#EC4899",
          cyan: "#06B6D4", green: "#10B981", amber: "#F59E0B",
        },
        tx: { primary: "#F0F0FF", secondary: "#9090B0", muted: "#5A5A78" },
      },
      animation: {
        "slide-in": "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-up": "fadeUp 0.3s ease forwards",
      },
      keyframes: {
        slideIn: { from: { opacity: 0, transform: "translateX(-12px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        fadeUp: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
