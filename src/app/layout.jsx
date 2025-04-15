// in src/app/layout.jsx (or your root layout)
import { Providers } from "./providers";
import PopupContainer from "@/app/components/PopupContainer"; // adjust the path if needed
import "./styles/globals.css";

export const metadata = {
  title: "Lonrot Library",
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
      <body>
        <Providers>
          {children}
          <PopupContainer /> {/* Add this so the popup stays visible globally */}
        </Providers>
      </body>
    </html>
  );
}
