/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#040507",
        panel: {
          DEFAULT: "#253352",
          dark: "#162036",
          light: "#2a3d66",
          translucent: "rgba(37, 51, 82, 0.75)",
          glass: "rgba(22, 32, 54, 0.85)",
          border: "rgba(115, 151, 189, 0.25)",
          highlight: "rgba(168, 191, 220, 0.15)",
        },
        text: {
          primary: "#FBFCFD",
          secondary: "#999CA0",
          subtle: "#595C61",
        },
        accent: {
          light: "#A8BFDC",
          blue: "#41619F",
          secondary: "#7397BD",
          cyan: "#28D7C5",
          glow: "#38BDF8",
        },
        status: {
          normal: "#10B981",
          moderate: "#F59E0B",
          severe: "#EF4444",
          extreme: "#DC2626",
          info: "#38BDF8",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'Michroma'", "'Orbitron'", "'Space Grotesk'", "sans-serif"],
        michroma: ["'Michroma'", "'Orbitron'", "sans-serif"],
        orbitron: ["'Orbitron'", "'Michroma'", "sans-serif"],
        mono: ["'JetBrains Mono'", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glow-cyan': '0 0 20px -3px rgba(40, 215, 197, 0.35)',
        'glow-blue': '0 0 25px -4px rgba(65, 97, 159, 0.45)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
