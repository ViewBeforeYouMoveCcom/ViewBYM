import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { propertyId, agencyId, name, email, phone, message, agentEmail, propertyTitle } = body;

  if (!propertyId || !agencyId || !name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const { error: dbError } = await supabase.from("enquiries").insert({
    property_id: propertyId,
    agency_id: agencyId,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
  });

  if (dbError) {
    return NextResponse.json({ error: "Could not save enquiry" }, { status: 500 });
  }

  // Send emails if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && agentEmail) {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL ?? "VBYM <noreply@vbym.co.uk>";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vbym.co.uk";

    await Promise.allSettled([
      // Email to agent
      resend.emails.send({
        from,
        to: agentEmail,
        subject: `New enquiry: ${propertyTitle ?? "Your listing"}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
            <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">New enquiry received</h2>
            <p style="margin-bottom:8px"><strong>Property:</strong> ${propertyTitle ?? "Your listing"}</p>
            <p style="margin-bottom:8px"><strong>Name:</strong> ${name}</p>
            <p style="margin-bottom:8px"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p style="margin-bottom:8px"><strong>Phone:</strong> ${phone}</p>` : ""}
            <p style="margin-bottom:4px"><strong>Message:</strong></p>
            <p style="background:#f5f5f5;border-radius:8px;padding:12px;margin-bottom:20px">${message.replace(/\n/g, "<br>")}</p>
            <a href="${appUrl}/agent/enquiries" style="display:inline-block;background:#08519A;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px">View all enquiries</a>
            <p style="margin-top:24px;font-size:12px;color:#666">This enquiry was submitted via View Before You Move.</p>
          </div>
        `,
      }),
      // Confirmation to buyer
      resend.emails.send({
        from,
        to: email,
        subject: "Your enquiry has been received — VBYM",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
            <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Enquiry received</h2>
            <p style="margin-bottom:12px">Hi ${name}, your enquiry about <strong>${propertyTitle ?? "the property"}</strong> has been sent to the agent. They will be in touch shortly.</p>
            <a href="${appUrl}/browse" style="display:inline-block;background:#08519A;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px">Browse more properties</a>
            <p style="margin-top:24px;font-size:12px;color:#666">View Before You Move is not an estate agency. Enquiries go directly to the listing agent.</p>
          </div>
        `,
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
