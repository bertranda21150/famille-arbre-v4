import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

async function requireAccess() {
  const cookieStore = await cookies();
  return cookieStore.get("famille_access")?.value === "ok";
}

export async function GET(req: Request) {
  if (!(await requireAccess())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const familyCode = (searchParams.get("familyCode") || "").trim();

  if (!familyCode) {
    return NextResponse.json({ error: "familyCode required" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("persons")
    .select("*")
    .eq("family_code", familyCode)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await requireAccess())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const family_code = String(body.family_code || "").trim();
  const first_name = String(body.first_name || "").trim();
  const last_name = String(body.last_name || "").trim();
  const birth_year = Number(body.birth_year);

  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();

  if (!family_code || !first_name || !last_name || !birth_year) {
    return NextResponse.json(
      { error: "family_code, first_name, last_name, birth_year required" },
      { status: 400 }
    );
  }

  const payload: Record<string, any> = {
    family_code,
    first_name,
    last_name,
    birth_year,
  };

  // Champs facultatifs
  if (email) payload.email = email;
  if (phone) payload.phone = phone;

  const { error } = await supabaseServer.from("persons").insert(payload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
