import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineWave — Khám phá thế giới điện ảnh",
  description: "CineWave là không gian khám phá phim, thể loại và nội dung điện ảnh. Thư viện và tính năng phát phim đang được phát triển.",
  applicationName: "CineWave",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
