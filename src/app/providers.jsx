// src/app/providers.jsx
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from NextAuth

// The Providers component wraps your children in the SessionProvider to manage authentication state
export function Providers({ children }) {
  return (
    // SessionProvider manages the session globally, keeping track of the logged-in state
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
