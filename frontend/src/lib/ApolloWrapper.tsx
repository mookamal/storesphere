"use client";

import LoadingElement from "@/components/LoadingElement";
import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

// Create a dynamic Apollo Client with token-based authentication
function makeDynamicClient(session: any) {
    // Create an authentication link to inject the access token
    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            Authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
        }
    }));

    // Create an HTTP link to the GraphQL endpoint
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    });

    // Return a new Apollo Client with authentication and HTTP links
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
}

// Provide Apollo Client with session-aware authentication
function AuthAwareApolloProvider({ children }: { children: ReactNode }) {
    // Get the current session status
    const { data: session, status } = useSession();

    // Show a loading screen while session is being fetched
    if (status === "loading") return <LoadingElement
        size="lg"
        color="primary"
        fullScreen={true}
    />;

    // Provide Apollo Client with the current session
    return (
        <ApolloNextAppProvider makeClient={() => makeDynamicClient(session)}>
            {children}
        </ApolloNextAppProvider>
    );
}

// Wrapper component to provide Apollo Client with authentication
export function ApolloWrapper({ children }: { children: ReactNode }) {
    return (
        <AuthAwareApolloProvider>
            {children}
        </AuthAwareApolloProvider>
    );
}