export const cardVariants = {
    base: `
      rounded-2xl 
      border 
      border-gray-200/50 
      bg-white 
      shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] 
      overflow-hidden 
      transition-all 
      duration-300 
      hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] 
      hover:scale-[1.01] 
      active:scale-[0.99]
      dark:bg-gray-800 
      dark:border-gray-700/50
    `,
    header: `
      px-4 
      py-3 
      bg-gray-50 
      border-b 
      border-gray-200 
      flex 
      items-center 
      justify-between 
      dark:bg-gray-900/30 
      dark:border-gray-700
    `,
    content: `
      p-4 
      space-y-4 
      relative 
      before:absolute 
      before:inset-0 
      before:bg-gradient-to-br 
      before:from-transparent 
      before:to-gray-50/10 
      before:opacity-0 
      hover:before:opacity-100 
      before:transition-opacity 
      before:duration-300
    `,
    title: `
      text-sm 
      font-semibold 
      text-gray-700 
      uppercase 
      tracking-wider 
      dark:text-gray-200
    `,
    interactive: `
      cursor-pointer 
      hover:bg-gray-50 
      active:bg-gray-100 
      transition-colors 
      duration-200
    `
  };