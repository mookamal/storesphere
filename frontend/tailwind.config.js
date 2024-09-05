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
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}