import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    flowbite.content(),
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "screen-primary": "#F6F8FA",
        "m-white": "#FFFFFF",
      },
      colors: {
        "primary-text": "#1E3A2B",
        "yellow": '#EFF87A',

        "baby-blue": '#CFDCFF',
        "coal-50": "#1b1c22",
        "coal-100": "#15171c",
        "coal-200": "#13141a",
        "coal-300": "#111217",
        "coal-400": "#0f1014",
        "coal-500": "#0d0e12",
        "coal-600": "#0b0c10",
        "coal-black": "#000",
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}