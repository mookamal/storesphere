export const customThemeTable = {
    head: {
        "base": "group/head text-xs",
        "cell": {
            "base": "bg-baby-blue px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-coal-500"
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