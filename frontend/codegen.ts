import { CodegenConfig } from "@graphql-codegen/cli";
require('dotenv').config();
const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMzY0OTE1LCJpYXQiOjE3NDA3NjAxMTUsImp0aSI6ImEzZGU4ZTA4YWVjYzQyMjE5NGJjOTdmYWIwMjljMjcyIiwidXNlcl9pZCI6Mn0.wzssoscsJuq4pr4rJy-syI7njG2wPngZeaedvLkE_gE" 
const config: CodegenConfig = {
    overwrite: true,
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
      "./src/codegen/generated.tsx": {
        plugins: [
          "typescript",
          "typescript-operations",
          "typescript-react-apollo"
        ],
        config: {
          withHooks: true,
          gqlTagName: "gql",
        },
      },
    },
  };
  
  export default config;