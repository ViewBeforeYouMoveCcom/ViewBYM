import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@viewbeforeyoumove.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://viewbeforeyoumove.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "jt@universaltvmedia.com";

export async function POST(req: NextRequest) {
  // Service-role client (bypasses RLS) — only for server-side use
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { agencyId, agencyName, contactEmail } = await req.json();

  if (!agencyId || !contactEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify the caller is an admin (check auth header)
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!RESEND_API_KEY) {
    // No email provider configured — log and return ok so UI doesn't break
    console.warn("[VBYM] RESEND_API_KEY not set — approval email not sent to", contactEmail);
    return NextResponse.json({ sent: false, reason: "no_provider" });
  }

  // Send to agency contact + admin copy
  const results = await Promise.allSettled([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: contactEmail,
        subject: "Your agency has been approved — View Before You Move",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
            <h2 style="font-size:22px;font-weight:700;color:#1A3A6C;margin-bottom:8px">
              Your agency is approved!
            </h2>
            <p style="color:#555;line-height:1.6">
              Hi,<br/><br/>
              We're pleased to let you know that <strong>${agencyName}</strong> has been approved on
              <strong>View Before You Move</strong>. You can now log in to your agent portal,
              add listings, and upload VR tours.
            </p>
            <a href="${APP_URL}/agents/login"
              style="display:inline-block;margin-top:20px;padding:12px 24px;background:#08519A;color:#fff;font-weight:700;border-radius:10px;text-decoration:none">
              Sign in to Agent Portal →
            </a>
            <p style="margin-top:28px;font-size:13px;color:#999">
              If you have any questions, reply to this email or visit
              <a href="${APP_URL}/contact" style="color:#08519A">${APP_URL}/contact</a>.
            </p>
          </div>
        `,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[APPROVAL] ${agencyName} — Contact: ${contactEmail}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
            <p style="font-weight:700;margin-bottom:12px">Admin copy — Agency approved</p>
            <p style="margin-bottom:8px"><strong>Agency:</strong> ${agencyName}</p>
            <p style="margin-bottom:8px"><strong>Contact email:</strong> ${contactEmail}</p>
            <p style="margin-bottom:12px"><strong>Action taken:</strong> Approval email sent to agency contact</p>
            <p style="font-size:12px;color:#666">This is an automated admin notification.</p>
          </div>
        `,
      }),
    }),
  ]);

  const mainSuccess = results[0].status === "fulfilled" && (await results[0].value).ok;
  if (!mainSuccess) {
    const err = results[0].status === "fulfilled" ? await results[0].value.text() : "unknown error";
    console.error("[VBYM] Resend error:", err);
    return NextResponse.json({ sent: false, reason: "resend_error" }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
