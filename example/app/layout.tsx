import { Inter as FontSans } from "@next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontSans.className}`}>
      <head />
      <body>{children}</body>
    </html>
  );
}
