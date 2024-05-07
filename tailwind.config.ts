import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        customFont: ['"Custom Font"', "nyt-karnakcondensed"],
      },
      colors: {
        'nyt-blue': '#b0c4ef',
        'nyt-yellow': '#f9df6d',
        'nyt-purple': '#ba81c5',
        'nyt-green': '#a0c35a',
        'nyt-gray': '#efefe6',
        'nyt-grayer':'#5a594e',
      },
      height: {
        'allConnections': '25.5rem',
      },
      width: {
        'connectionW':'39rem',
      }
    },
  },
  plugins: [],
};
export default config;
