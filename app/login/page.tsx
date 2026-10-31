"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setBusy(false);
    if (result?.error) {
      setError("Gmail hoặc mật khẩu không chính xác, hoặc tài khoản chưa được thiết lập mật khẩu.");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <main className="orders-page auth-page">
      <section className="orders-content auth-card">
        <div className="eyebrow">CINEWAVE ACCOUNT</div>
        <h1>Chào mừng <em>trở lại</em></h1>
        <p className="orders-intro">Đăng nhập bằng địa chỉ Gmail và mật khẩu của bạn.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Địa chỉ Gmail</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="ban@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="login-password">Mật khẩu</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Đang đăng nhập..." : "Đăng nhập"}</button>
        </form>
        <p className="auth-switch">Chưa có tài khoản? <Link href="/register">Tạo tài khoản mới</Link></p>
        <Link className="orders-back" href="/">← Về CineWave</Link>
      </section>
    </main>
  );
}
