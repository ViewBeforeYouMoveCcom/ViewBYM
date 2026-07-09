import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://viewbeforeyoumove.com";

export async function POST(req: NextRequest) {
  const { recipientEmail, token } = await req.json() as {
    recipientEmail: string;
    token: string;
  };

  if (!recipientEmail || !token) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const inviteUrl = `${APP_URL}/agents/join/${token}`;

  try {
    await sendEmail({
      to: recipientEmail,
      subject: "You've been invited to join View Before You Move",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
          <h2 style="font-size:22px;font-weight:700;color:#08519A;margin-bottom:8px">
            You're invited to join View Before You Move
          </h2>
          <p style="color:#555;line-height:1.6">
            You've been invited to list your properties on <strong>View Before You Move</strong>,
            the UK's immersive property platform. Click the button below to create your agency
            account — no application needed, you'll be set up and ready to list immediately.
          </p>
          <a href="${inviteUrl}"
            style="display:inline-block;margin-top:20px;padding:12px 28px;background:#08519A;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:15px">
            Accept invite &amp; create account →
          </a>
          <p style="margin-top:24px;font-size:13px;color:#666">
            This invite link can only be used once and expires after a set period.<br/>
            If you did not expect this email, you can safely ignore it.
          </p>
          <p style="margin-top:20px;font-size:12px;color:#999">
            Questions? <a href="${APP_URL}/contact" style="color:#08519A">Contact us</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[send-invite-email] SMTP error:", message);
    return NextResponse.json({ sent: false, error: message }, { status: 500 });
  }
}
