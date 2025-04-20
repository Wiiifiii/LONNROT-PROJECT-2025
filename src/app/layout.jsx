// src/app/layout.jsx
import { Providers } from "./providers";
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
        {/* make it responsive on mobile/ipad */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-[url('/images/LogInPage.png')] bg-cover bg-center">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
