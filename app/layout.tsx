import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VelClaw Game Shop — Game top-ups & digital goods",
  description: "A curated storefront for Liên Quân Mobile, Free Fire and PUBG Mobile game services."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
