"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { PopupProvider } from "@/app/context/PopupContext";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <PopupProvider>{children}</PopupProvider>
    </SessionProvider>
  );
}
