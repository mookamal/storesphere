export const cardVariants = {
  base: `
    rounded-lg 
    border 
    bg-white 
    shadow-md 
    overflow-hidden 
    transition-transform 
    duration-300 
    hover:shadow-lg 
    hover:scale-105 
    active:scale-95 
    dark:bg-gray-900 
    dark:border-gray-800 
    dark:shadow-none 
    dark:hover:shadow-md 
  `,
  header: `
    px-4 
    py-3 
    bg-gray-100 
    border-b 
    border-gray-200 
    flex 
    items-center 
    justify-between 
    dark:bg-gray-800 
    dark:border-gray-700 
  `,
  content: `
    p-4 
    space-y-4 
    relative 
    before:absolute 
    before:inset-0 
    before:bg-gradient-to-r 
    before:from-transparent 
    before:to-gray-100/10 
    before:opacity-0 
    hover:before:opacity-100 
    before:transition-opacity 
    before:duration-300 
    dark:before:to-gray-800/30
  `,
  title: `
    text-base 
    font-semibold 
    text-gray-800 
    uppercase 
    tracking-wide 
    dark:text-gray-200 
  `,
  interactive: `
    cursor-pointer 
    hover:bg-gray-100 
    active:bg-gray-200 
    transition-colors 
    duration-200 
    dark:hover:bg-gray-800 
    dark:active:bg-gray-700 
  `
};
