import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;

  const agencyName = clean(body?.agencyName);
  const contactName = clean(body?.contactName);
  const businessEmail = clean(body?.businessEmail).toLowerCase();

  if (!agencyName || !contactName || !businessEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { error } = await supabase
    .from("agent_applications")
    .insert({
      agency_name: agencyName,
      branch_location: clean(body?.agencyLocation) || null,
      contact_name: contactName,
      contact_role: clean(body?.contactRole) || null,
      business_email: businessEmail,
      phone: clean(body?.phone) || null,
      website: clean(body?.website) || null,
      status: "new",
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
