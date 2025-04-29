// src/app/layout.jsx
import { Providers } from "./providers";
import Footer from "@/app/components/Layout/Footer";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './styles/globals.css';

export const metadata = {
  title: "Lonnrot Library",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* make mobile responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
          <body
        className={`
        flex flex-col min-h-screen
        bg-[url('/images/baseImage.png')]
         bg-no-repeat bg-center bg-cover bg-fixed
       `}
      >
        <Providers>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

