import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import NeonAdapter from "@auth/neon-adapter";
import { getDbPool } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const pool = getDbPool();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(pool ? { adapter: NeonAdapter(pool) } : {}),
  providers: [
    Credentials({
      name: "Gmail và mật khẩu",
      credentials: {
        email: { label: "Gmail", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!pool || !email.endsWith("@gmail.com") || !password) return null;

        const result = await pool.query<{
          id: string;
          name: string | null;
          email: string;
          password_hash: string | null;
          role: string;
        }>(
          "select id, name, email, password_hash, role from public.users where lower(email) = $1 limit 1",
          [email]
        );
        const user = result.rows[0];
        if (!user?.password_hash || !(await verifyPassword(password, user.password_hash))) return null;

        return {
          id: user.id,
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id && pool) {
        const result = await pool.query<{ role: string }>(
          "select role from public.users where id = $1 limit 1",
          [user.id]
        );
        token.role = result.rows[0]?.role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "customer";
      }
      return session;
    },
  },
});
