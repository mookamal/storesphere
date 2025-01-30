"use client";

import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { useSession } from "next-auth/react";

// Dynamic Clint creation with tokenisation
function makeDynamicClient(session) {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
    }
  }));

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

// Session management sub-component
function AuthAwareApolloProvider({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="mx-auto my-auto w-screen h-screen flex justify-center items-center">
    loading...
  </div>;

  return (
    <ApolloNextAppProvider makeClient={() => makeDynamicClient(session)}>
      {children}
    </ApolloNextAppProvider>
  );
}

export function ApolloWrapper({ children }) {
  return (
    <AuthAwareApolloProvider>
      {children}
    </AuthAwareApolloProvider>
  );
}