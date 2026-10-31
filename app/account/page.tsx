import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="orders-page auth-page">
      <section className="orders-content auth-card">
        <div className="eyebrow">CINEWAVE MEMBER</div>
        <h1>Tài khoản <em>CineWave</em></h1>
        <div className="orders-notice">
          <strong>{session.user.name ?? session.user.email ?? "Thành viên"}</strong>
          <p>Gmail: {session.user.email}</p>
          <p>Vai trò: {session.user.role}</p>
        </div>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button className="primary-button" type="submit">Đăng xuất</button>
        </form>
      </section>
    </main>
  );
}
