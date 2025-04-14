// Summary: Provides session context to the application using NextAuth's SessionProvider.

"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
