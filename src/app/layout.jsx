import React from "react";
import { Providers } from "@/app/providers";
import NotificationProvider from "@/app/components/Layout/NotificationProvider.client";
import Navbar from "@/app/components/Layout/Navbar";
import Footer from "@/app/components/Layout/Footer";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@/app/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={
          `flex flex-col min-h-screen
           bg-[url('/images/baseImage.png')]
           bg-no-repeat bg-center bg-cover bg-fixed`
        }
      >
        <Providers>
          <NotificationProvider>
            <Navbar />
            <div className="flex-grow mt-16">
              {children}
            </div>
          </NotificationProvider>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
