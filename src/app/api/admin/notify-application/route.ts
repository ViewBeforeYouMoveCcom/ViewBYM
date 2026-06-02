import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hassangoindi234@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://viewbeforeyoumove.com";

export async function POST(req: NextRequest) {
  const { agentEmail, agentName, agencyName, type } = await req.json();
  // type: "request_access" | "agency_approved"

  if (!agentEmail || !type) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    if (type === "request_access") {
      // Notify admin of new access request
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[ACCESS REQUEST] ${agentName ?? agentEmail} requested agent access`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
            <p style="font-weight:700;margin-bottom:12px">New agent access request</p>
            <p style="margin-bottom:8px"><strong>Name:</strong> ${agentName ?? "Unknown"}</p>
            <p style="margin-bottom:8px"><strong>Email:</strong> ${agentEmail}</p>
            ${agencyName ? `<p style="margin-bottom:8px"><strong>Agency:</strong> ${agencyName}</p>` : ""}
            <a href="${APP_URL}/admin/applications"
              style="display:inline-block;margin-top:16px;padding:10px 20px;background:#08519A;color:#fff;font-weight:700;border-radius:8px;text-decoration:none">
              Review Application →
            </a>
          </div>
        `,
      });
    }

    if (type === "agency_approved") {
      // Notify agent their agency is approved + admin copy
      await Promise.all([
        sendEmail({
          to: agentEmail,
          subject: "Your agency has been approved — View Before You Move",
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
              <h2 style="font-size:22px;font-weight:700;color:#08519A;margin-bottom:8px">
                Your agency is approved!
              </h2>
              <p style="color:#555;line-height:1.6">
                Hi ${agentName ?? ""},<br/><br/>
                We're pleased to let you know that <strong>${agencyName}</strong> has been approved on
                <strong>View Before You Move</strong>. You can now log in to your agent portal,
                add listings, and upload VR tours.
              </p>
              <a href="${APP_URL}/agents/login"
                style="display:inline-block;margin-top:20px;padding:12px 24px;background:#08519A;color:#fff;font-weight:700;border-radius:10px;text-decoration:none">
                Sign in to Agent Portal →
              </a>
              <p style="margin-top:28px;font-size:13px;color:#999">
                Questions? <a href="${APP_URL}/contact" style="color:#08519A">Contact us</a>
              </p>
            </div>
          `,
        }),
        sendEmail({
          to: ADMIN_EMAIL,
          subject: `[AGENCY APPROVED] ${agencyName} — ${agentEmail}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
              <p style="font-weight:700;margin-bottom:12px">Agency approved — admin copy</p>
              <p style="margin-bottom:8px"><strong>Agency:</strong> ${agencyName}</p>
              <p style="margin-bottom:8px"><strong>Contact:</strong> ${agentEmail}</p>
              <p style="font-size:12px;color:#666">Approval confirmation sent to agent.</p>
            </div>
          `,
        }),
      ]);
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[notify-application] Email error:", err);
    return NextResponse.json({ sent: false }, { status: 500 });
  }
}
