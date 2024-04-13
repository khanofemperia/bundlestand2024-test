import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/elements/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fill: {
        red: "#ef4444",
      },
      borderRadius: {
        "14px": "0.875rem",
      },
      textColor: {
        gray: "#707070",
        black: "#262626",
        blue: "#0a5ddc",
        blue2: "#084db5",
        green: "#009e00",
        red: "#ef4444",
        gray4: "#707070",
        gold: "#af8100",
        brown: "#89532f",
        "ghost-gray": "#9c9c9c",
      },
      backgroundColor: {
        black: "#333333",
        blue: "#0a5ddc",
        blue2: "#084db5",
        green: "#009e00",
        gold: "#af8100",
        gray: "#f5f5f5",
        gray2: "#eeeeee",
        gray3: "#cecece",
        gray4: "#707070",
        brown: "#8d6e63",
        red: "#ef4444",
      },
      borderColor: {
        DEFAULT: "#d6d6d6",
        blue: "#0a5ddc",
        blue2: "#084db5",
        black: "#333333",
        gray2: "#eeeeee",
        gray3: "#cecece",
        green: "#009e00",
        red: "#ef4444",
      },
      colors: {
        blue: "#0a5ddc",
        gold: "#af8100",
        "text-gray": "#707070",
      },
      boxShadow: {
        DEFAULT:
          "0px 1.6px 3.6px rgba(0,0,0,0.13), 0px 0px 2.9px rgba(0,0,0,0.11)",
        custom2:
          "#b9b9b940 0px 3px 2px 0px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
        custom3: "#78787840 0px 3px 2px 0px, #0000002e 0px 0px 1px 1px",
      },
      backgroundImage: {
        "black-paper": "url('/backgrounds/black-paper.png')",
        "asfalt-dark": "url('/backgrounds/asfalt-dark.png')",
        "gradient-squares": "url('/backgrounds/gradient-squares.png')",
        "fabric-of-squares": "url('/backgrounds/fabric-of-squares.png')",
        "45-degree-fabric-light":
          "url('/backgrounds/45-degree-fabric-light.png')",
        "green-dust-and-scratches":
          "url('/backgrounds/green-dust-and-scratches.png')",
      },
    },
  },
  plugins: [],
};
export default config;
