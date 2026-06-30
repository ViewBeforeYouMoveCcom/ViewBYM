import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { email, password, fullName, token } = await req.json() as {
    email: string;
    password: string;
    fullName: string;
    token: string;
  };

  if (!email || !password || !token) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Validate invite token using anon key (same as client-side validation)
  const { data: invite } = await supabase
    .from("agency_invites")
    .select("id, used_at, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (
    !invite ||
    invite.used_at ||
    (invite.expires_at && new Date(invite.expires_at) < new Date())
  ) {
    return NextResponse.json({ error: "Invalid or expired invite." }, { status: 400 });
  }

  // Sign up — email confirmation depends on your Supabase project settings
  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
