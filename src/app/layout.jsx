// in src/app/layout.jsx (or your root layout)
import { Providers } from "./providers";
import "./styles/globals.css";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      
      <body className="bg-[url('/images/LogInPage.png')] bg-cover bg-center">
        <Providers>
          {children}
         
        </Providers>
      </body>
    </html>
  );
}
