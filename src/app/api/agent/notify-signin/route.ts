import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hassangoindi234@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://viewbeforeyoumove.com";

export async function POST(req: NextRequest) {
  const { agentEmail, agentName } = await req.json();
  if (!agentEmail) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  try {
    await Promise.all([
      // Email to the agent
      sendEmail({
        to: agentEmail,
        subject: "Welcome to View Before You Move — Agent Portal",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
            <h2 style="font-size:22px;font-weight:700;color:#08519A;margin-bottom:8px">
              Welcome, ${agentName ?? "Agent"}!
            </h2>
            <p style="color:#555;line-height:1.6">
              You've signed in to the View Before You Move agent portal.<br/><br/>
              Your account is currently <strong>pending review</strong>. Our team will verify your details
              and approve your agency within 1–2 business days. You'll receive a confirmation email once approved.
            </p>
            <a href="${APP_URL}/agent/dashboard"
              style="display:inline-block;margin-top:20px;padding:12px 24px;background:#08519A;color:#fff;font-weight:700;border-radius:10px;text-decoration:none">
              Go to Agent Portal →
            </a>
            <p style="margin-top:28px;font-size:13px;color:#999">
              Questions? <a href="${APP_URL}/contact" style="color:#08519A">Contact us</a>
            </p>
          </div>
        `,
      }),
      // Email to admin
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `[NEW AGENT SIGN-IN] ${agentName ?? agentEmail} just signed in`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
            <p style="font-weight:700;margin-bottom:12px">New agent signed in</p>
            <p style="margin-bottom:8px"><strong>Name:</strong> ${agentName ?? "Unknown"}</p>
            <p style="margin-bottom:8px"><strong>Email:</strong> ${agentEmail}</p>
            <p style="margin-bottom:16px">This agent has signed in for the first time and is awaiting agency approval.</p>
            <a href="${APP_URL}/admin/agencies"
              style="display:inline-block;padding:10px 20px;background:#08519A;color:#fff;font-weight:700;border-radius:8px;text-decoration:none">
              Review in Admin Panel →
            </a>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[notify-signin] Email error:", err);
    return NextResponse.json({ sent: false }, { status: 500 });
  }
}
