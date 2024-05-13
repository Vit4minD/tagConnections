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
        'nyt-grayer': '#5a594e',
        'nyt-covered': '#7f7f7f',
      },
      height: {
        'allConnections': '25.5rem',
      },
      width: {
        'connectionW': '39rem',
      },
      animation: {
        fade: 'fadeInText 300ms ease-in-out',
        shrink: 'shrinking 200ms ease-in-out forwards',
        popUp: 'popup 300ms ease-in-out forwards'
      },
      keyframes: {
        fadeInText: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shrinking: {
          from: {scale: '1'},
          to: {scale: '0',
            opacity: '0',
          },
        },
        popup: {
          from: {scale: '0'},
          to: {scale: '1'},
        }
      },
      transitionDuration: {
        '50': '50ms',
      },
    },
  },
  plugins: [],
};
export default config;
