"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthNextProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
