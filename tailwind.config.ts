import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1115",
        card: "#161a22",
        muted: "#8f99ab",
        accent: "#94a3b8",
        stroke: "#2a3342"
      },
      animation: {
        sway: "sway 4s ease-in-out infinite",
        pulseGrow: "pulseGrow 550ms ease-out"
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-1.2deg)" },
          "50%": { transform: "rotate(1.2deg)" }
        },
        pulseGrow: {
          "0%": { transform: "scale(0.98)", opacity: "0.75" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
