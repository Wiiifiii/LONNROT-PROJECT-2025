// in src/app/layout.jsx (or your root layout)
import { Providers } from "./providers";
import PopupContainer from "@/app/components/PopupContainer"; // adjust the path if needed
import "./styles/globals.css";

export const metadata = {
  title: "Lonrot Library",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <PopupContainer /> {/* Add this so the popup stays visible globally */}
        </Providers>
      </body>
    </html>
  );
}
