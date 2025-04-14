// Summary: Root layout component that wraps the application with providers and global styles.

import { Providers } from "./providers";
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
        </Providers>
      </body>
    </html>
  );
}
