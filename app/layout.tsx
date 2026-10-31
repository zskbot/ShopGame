import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopGame — Nạp game & tài khoản game",
  description: "ShopGame - cửa hàng Liên Quân, Free Fire, PUBG Mobile. Hỗ trợ khách hàng và giao dịch xem trước."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
