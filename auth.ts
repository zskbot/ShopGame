import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NeonAdapter from "@auth/neon-adapter";
import { getDbPool } from "@/lib/db";

const pool = getDbPool();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(pool ? { adapter: NeonAdapter(pool) } : {}),
  providers: [GitHub, Google],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id && pool) {
        const result = await pool.query<{ role: string }>(
          "select role from users where id = $1 limit 1",
          [user.id]
        );
        token.role = result.rows[0]?.role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "customer";
      }
      return session;
    }
  }
});
