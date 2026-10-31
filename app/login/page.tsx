import Link from "next/link";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="orders-page">
      <section className="orders-content">
        <div className="eyebrow">GAMEHUB ACCOUNT</div>
        <h1>Đăng nhập <em>tài khoản</em></h1>
        <p className="orders-intro">Đăng nhập qua nhà cung cấp OAuth. GameHub không yêu cầu mật khẩu game.</p>
        <div className="orders-empty">
          <form action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/account" });
          }}>
            <button className="primary-button" type="submit">Tiếp tục với GitHub ↗</button>
          </form>
          <form action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/account" });
          }}>
            <button className="primary-button" type="submit">Tiếp tục với Google ↗</button>
          </form>
          <p>Đăng nhập cần OAuth credentials và Neon staging được cấu hình.</p>
          <Link className="orders-back" href="/">← Quay lại cửa hàng</Link>
        </div>
      </section>
    </main>
  );
}
