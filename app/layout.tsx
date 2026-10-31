import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopGame — Cửa hàng game online",
  description: "ShopGame - khám phá tài khoản, vật phẩm và dịch vụ Liên Quân Mobile, Free Fire và PUBG Mobile."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
