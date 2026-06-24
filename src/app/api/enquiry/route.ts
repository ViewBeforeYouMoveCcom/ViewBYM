import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, agencyId, name, phone, message, agentEmail, propertyTitle } = body;

    if (!propertyId || !agencyId || !name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Please sign in before sending an enquiry." },
        { status: 401 }
      );
    }

    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    
    const { data: { user: authUser }, error: authError } = await userSupabase.auth.getUser(token);
    
    if (authError || !authUser?.id || !authUser?.email) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Please sign in before sending an enquiry." },
        { status: 401 }
      );
    }

    const buyerEmail = authUser.email.trim().toLowerCase();

    const enquiry = {
      property_id: propertyId,
      agency_id: agencyId,
      user_id: authUser.id,
      name: name.trim(),
      email: buyerEmail,
      phone: phone?.trim() || null,
      message: message.trim(),
    };

    const { error: dbError } = await userSupabase.from("enquiries").insert(enquiry);

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && agentEmail) {
      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL ?? "VBYM <noreply@vbym.co.uk>";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vbym.co.uk";
      const adminEmail = process.env.ADMIN_EMAIL ?? "jt@universaltvmedia.com";

      await Promise.allSettled([
        resend.emails.send({
          from,
          to: agentEmail,
          subject: `New enquiry: ${propertyTitle ?? "Your listing"}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
              <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">New enquiry received</h2>
              <p style="margin-bottom:8px"><strong>Property:</strong> ${propertyTitle ?? "Your listing"}</p>
              <p style="margin-bottom:8px"><strong>Name:</strong> ${name}</p>
              <p style="margin-bottom:8px"><strong>Email:</strong> <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>
              ${phone ? `<p style="margin-bottom:8px"><strong>Phone:</strong> ${phone}</p>` : ""}
              <p style="margin-bottom:4px"><strong>Message:</strong></p>
              <p style="background:#f5f5f5;border-radius:8px;padding:12px;margin-bottom:20px">${message.replace(/\n/g, "<br>")}</p>
              <a href="${appUrl}/agent/enquiries" style="display:inline-block;background:#08519A;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px">View all enquiries</a>
              <p style="margin-top:24px;font-size:12px;color:#666">This enquiry was submitted via View Before You Move.</p>
            </div>
          `,
        }),
        resend.emails.send({
          from,

          
          to: buyerEmail,
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
        resend.emails.send({
          from,
          to: adminEmail,
          subject: `[ENQUIRY] ${name} — ${propertyTitle ?? "Property"}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
              <p style="margin-bottom:8px"><strong>Admin copy — New enquiry submitted</strong></p>
              <p style="margin-bottom:8px"><strong>Property:</strong> ${propertyTitle ?? "Unknown"}</p>
              <p style="margin-bottom:8px"><strong>From:</strong> ${name}</p>
              <p style="margin-bottom:8px"><strong>Email:</strong> ${buyerEmail}</p>
              ${phone ? `<p style="margin-bottom:8px"><strong>Phone:</strong> ${phone}</p>` : ""}
              <p style="margin-bottom:4px"><strong>Message:</strong></p>
              <p style="background:#f5f5f5;border-radius:8px;padding:12px;margin-bottom:20px">${message.replace(/\n/g, "<br>")}</p>
              <p style="font-size:12px;color:#666">This is an automated admin copy.</p>
            </div>
          `,
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
