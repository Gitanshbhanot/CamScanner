/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        lexend: ["Lexend", "Helvetica" ,"sans-serif"],
      },
      transitionDuration: {
        1200: "1200ms",
        1600: "1600ms",
        2000: "2000ms",
        2400: "2400ms",
        3200: "3200ms",
        4800: "4800ms",
        6000: "6000ms",
        8000: "8000ms",
        10000: "10000ms",
        12000: "12000ms",
      },
      fontSize: {
        xxs: "8px",
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "18px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.75)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeSlideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "80%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        //   fadeInDelayed: {
        //     '0%': { opacity: '0' },
        //     '20%': { opacity: '0' },
        //     '100%': { opacity: '1' },
        //   },
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-in-out forwards",
        slideInLeft: "slideInLeft 1.5s ease-in-out forwards",
        scaleUp: "scaleUp 1.5s ease-in-out forwards",
        fadeSlideUp: "fadeSlideUp 1.5s ease-in-out forwards",
        bounceIn: "bounceIn 1.5s ease-in-out forwards",
        //   fadeInDelayed: 'fadeInDelayed 1.5s ease-in-out forwards',
      },
    },
    screens: {
      xs: "420px",
      mob: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
