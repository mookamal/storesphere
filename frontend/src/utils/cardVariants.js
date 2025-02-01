export const cardVariants = {
  base: `
    rounded-xl
    border 
    bg-white 
    shadow-sm
    overflow-hidden 
    transition-all 
    duration-300 
    hover:shadow-md 
    hover:-translate-y-1 
    active:translate-y-0 
    dark:bg-gray-900 
    dark:border-gray-700/80
    group
    relative
    isolate
  `,
  header: `
    px-5
    py-4 
    bg-gradient-to-r 
    from-gray-50 
    to-gray-100/30 
    border-b 
    border-gray-200/70 
    flex 
    items-center 
    justify-between 
    dark:from-gray-800 
    dark:to-gray-800/50 
    dark:border-gray-700/50
    backdrop-blur-sm
  `,
  content: `
    p-5
    space-y-4
    relative
    after:absolute
    after:inset-0
    after:bg-gradient-to-br
    after:from-transparent
    after:to-white/20
    after:opacity-0
    group-hover:after:opacity-100
    after:transition-opacity
    after:duration-300
    dark:after:to-gray-900/20
  `,
  title: `
    text-lg
    font-semibold
    text-gray-900
    tracking-tight
    flex
    items-center
    gap-2
    dark:text-gray-100
    [&_svg]:text-gray-400
    dark:[&_svg]:text-gray-500
  `,
  interactive: `
    cursor-pointer 
    hover:bg-gray-50 
    active:bg-gray-100 
    transition-colors 
    duration-150 
    dark:hover:bg-gray-800/70 
    dark:active:bg-gray-800 
    aria-pressed:bg-gray-100
    dark:aria-pressed:bg-gray-800
  `,
  footer: `
    px-5
    py-4 
    border-t 
    border-gray-200/70 
    bg-gray-50 
    dark:border-gray-700/50 
    dark:bg-gray-800/30
    flex
    justify-end
    gap-2
  `,
  media: {
    base: `
      relative 
      overflow-hidden 
      aspect-video
      bg-gray-100
      dark:bg-gray-800
    `,
    image: `
      object-cover 
      w-full 
      h-full 
      transition-opacity 
      duration-300 
      group-hover:opacity-90
    `
  }
};