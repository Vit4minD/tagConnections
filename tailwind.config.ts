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
        'homepage':'#9edae4'
      },
      height: {
        'allConnections': '25.5rem',
        'smallConnections': '22.594rem',
      },
      width: {
        'connectionW': '39rem',
        'smallW': '97.5svw',
      },
      animation: {
        fade: 'fadeInText 300ms ease-in-out',
        shrink: 'shrinking 200ms ease-in-out forwards',
        popUp: 'popup 400ms ease-in-out forwards',
        shake: 'shake 0.5s ease-in-out',
        bounceOnce: 'bounceOnce 1.4s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeInText: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shrinking: {
          from: { scale: '1' },
          to: {
            scale: '0',
            opacity: '0',
          },
        },
        popup: {
          from: {
            scale: '.1',
            opacity: '0'
          },
          to: {
            scale: '1',
            opacity: '1'
          },
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
      },
      transitionDuration: {
        '50': '50ms',
      },
      slideUp: {
        '0%': {
          transform: 'translateY(100%)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
    },
  },
  plugins: [],
};
export default config;
function bezier(arg0: number, arg1: number, arg2: number, arg3: number) {
  throw new Error("Function not implemented.");
}

