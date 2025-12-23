import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answer } = await req.json();

  const expected = (process.env.SECRET_ANSWER || "").trim().toLowerCase();
  const given = String(answer || "").trim().toLowerCase();

  if (!expected || given !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Cookie 30 jours
  res.cookies.set("famille_access", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
