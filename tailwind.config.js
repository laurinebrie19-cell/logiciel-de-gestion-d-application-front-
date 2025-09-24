// tailwind.config.js
export default {
  darkMode: "class", // Obligatoire pour le contrôle manuel
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f9fafb",
          900: "#111827",
        },
      },
    },
  },
  plugins: [import("@tailwindcss/forms")],
};
