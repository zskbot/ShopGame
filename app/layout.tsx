import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameHub — Cửa hàng game",
  description: "Nạp game và khám phá dịch vụ Liên Quân, Free Fire, PUBG Mobile.",
  applicationName: "GameHub"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
