/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#F8FFF8",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(0,0,0,0.08), 0 2px 8px -4px rgba(0,0,0,0.04)",
        card: "0 8px 32px -12px rgba(0,0,0,0.10), 0 2px 8px -4px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
