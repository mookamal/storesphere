import { CodegenConfig } from "@graphql-codegen/cli";
require('dotenv').config();
const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwMDM4NzQzLCJpYXQiOjE3Mzk0MzM5NDMsImp0aSI6ImE4ODc3OTZiNDQwNDRkZDY5YWVkNTg4YzAwOGI4ZjMxIiwidXNlcl9pZCI6Mn0.wezrfM7drM601GD6eRee5yMTkRzMduRZgMSJF5DCuA4" 
const config: CodegenConfig = {
    schema: {
        'http://api.nour.com/graphql': {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      },
    documents: ["src/graphql/**/*.ts"],
    generates: {
        "./src/graphql/": {
            // TODO
            preset: "client",
            presetConfig: {
                // TODO
                gqlTagName: "gql",
            },
        },
        "./src/graphql/types.ts": {
            // TODO
            plugins: ["typescript", "typescript-operations"],
        },
    },
    ignoreNoDocuments: true,
};

export default config;