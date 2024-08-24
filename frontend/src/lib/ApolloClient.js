import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: process.env.GRAPHQL_BACKEND_URL,
        headers: {
            'Authorization':  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1MTQzOTQ5LCJpYXQiOjE3MjQ1MzkxNDksImp0aSI6ImY4ZTQxYWJkOTJkNjQwYTA5MDM4ZmZjM2U1YTU0ZDliIiwidXNlcl9pZCI6NjB9.yu5XVoxqOtGCPi2cVBYsTCw7zocJlo9hoY5aI0o153s",
          },
    }),
  });
});