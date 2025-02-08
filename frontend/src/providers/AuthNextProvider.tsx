"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Define the props interface for type safety
interface AuthNextProviderProps {
  children: ReactNode;
}

// Convert the component to use TypeScript
export default function AuthNextProvider({ children }: AuthNextProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}