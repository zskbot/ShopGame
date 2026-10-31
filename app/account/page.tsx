import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="orders-page">
      <section className="orders-content">
        <div className="eyebrow">CUSTOMER AREA</div>
        <h1>Tài khoản <em>ShopGame</em></h1>
        <div className="orders-notice">
          <strong>{session.user.name ?? session.user.email ?? "Người dùng"}</strong>
          <p>Vai trò: {session.user.role}</p>
          <p>ID tài khoản: {session.user.id}</p>
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
