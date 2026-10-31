import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHost = forwardedHost?.split(",")[0]?.trim() ?? request.headers.get("host");

  if (origin && requestHost) {
    try {
      if (new URL(origin).host !== requestHost) {
        return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
    }
  }

  const pool = getDbPool();
  if (!pool) {
    return NextResponse.json({ error: "Đăng ký hiện chưa khả dụng. Máy chủ chưa kết nối cơ sở dữ liệu." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Tên hiển thị phải có từ 1 đến 80 ký tự." }, { status: 400 });
  }
  if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) {
    return NextResponse.json({ error: "Chỉ chấp nhận địa chỉ Gmail kết thúc bằng @gmail.com." }, { status: 400 });
  }
  if (password.length < 10 || password.length > 128) {
    return NextResponse.json({ error: "Mật khẩu phải có từ 10 đến 128 ký tự." }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query<{ id: string }>(
      "insert into public.users (name, email, password_hash) values ($1, $2, $3) returning id",
      [name, email, passwordHash]
    );
    return NextResponse.json({ ok: true, userId: result.rows[0]?.id }, { status: 201 });
  } catch (error) {
    const databaseError = error as { code?: string };
    if (databaseError.code === "23505") {
      return NextResponse.json({ error: "Gmail này đã có tài khoản. Hãy đăng nhập." }, { status: 409 });
    }
    return NextResponse.json({ error: "Không thể tạo tài khoản lúc này. Vui lòng thử lại sau." }, { status: 500 });
  }
}
