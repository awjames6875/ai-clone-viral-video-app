import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Video App",
  description: "Viral video content automation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
