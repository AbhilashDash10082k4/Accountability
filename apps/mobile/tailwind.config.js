/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./features/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#051424",
        surface: "#051424",
        "on-surface": "#d4e4fa",
        primary: "#c6c6cc",
        secondary: "#44e2cd",
        tertiary: "#bdc2ff",
        "surface-container": "#122131",
        "surface-variant": "#273647",
        "on-surface-variant": "#c6c6cb",
        "secondary-container": "#03c6b2",
        "on-secondary-fixed": "#00201c",
        "secondary-fixed-dim": "#3cddc7",
      },
      fontFamily: {
        inter: ["Inter"],
        geist: ["Geist"],
      },
    },
  },
  plugins: [],
}