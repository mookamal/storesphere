export const customThemeTable = {
    head: {
        "base": "group/head text-xs text-gray-700 dark:text-coal-500",
        "cell": {
            "base": "bg-gray-200 px-6 py-3 dark:bg-yellow-100"
        }
    },
    body: {
        "base": "group/body",
        "cell": {
          "base": "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
        }
      }
};

export const customThemeSelect = {
    base: "",
    field: {
        select: {
            colors: {
                success: "bg-yellow font-bold dark:bg-coal-100",
            },
        },
    },
};