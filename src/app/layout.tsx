import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Projector Control Center',
  description: 'Control interface for the Cilindir VR Pod projector system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}