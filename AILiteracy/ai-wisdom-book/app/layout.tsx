import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Usage Wisdom for Designers",
  description: "A comprehensive guide to working effectively with AI for human-centered design practice",
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
