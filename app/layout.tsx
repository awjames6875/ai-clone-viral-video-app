import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Video App",
  description: "AI-powered viral video content automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
