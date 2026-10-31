"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Mật khẩu phải có ít nhất 10 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Hai mật khẩu không trùng khớp.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim().toLowerCase(), password }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Không thể tạo tài khoản. Vui lòng thử lại.");
        setBusy(false);
        return;
      }

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      setBusy(false);
      if (result?.error) {
        setError("Tài khoản đã tạo. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setBusy(false);
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    }
  }

  return (
    <main className="orders-page auth-page">
      <section className="orders-content auth-card">
        <div className="eyebrow">JOIN CINEWAVE</div>
        <h1>Tạo tài khoản <em>mới</em></h1>
        <p className="orders-intro">Đăng ký bằng Gmail và mật khẩu. Chỉ chấp nhận địa chỉ @gmail.com.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Tên hiển thị</label>
          <input id="register-name" type="text" autoComplete="name" maxLength={80} placeholder="Tên của bạn" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="register-email">Địa chỉ Gmail</label>
          <input id="register-email" type="email" autoComplete="email" placeholder="ban@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="register-password">Mật khẩu</label>
          <input id="register-password" type="password" autoComplete="new-password" minLength={10} maxLength={128} placeholder="Ít nhất 10 ký tự" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <label htmlFor="register-confirm">Nhập lại mật khẩu</label>
          <input id="register-confirm" type="password" autoComplete="new-password" minLength={10} maxLength={128} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Đang tạo tài khoản..." : "Đăng ký"}</button>
        </form>
        <p className="auth-switch">Đã có tài khoản? <Link href="/login">Đăng nhập</Link></p>
        <Link className="orders-back" href="/">← Về CineWave</Link>
      </section>
    </main>
  );
}
