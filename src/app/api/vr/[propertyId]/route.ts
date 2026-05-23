import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

const SIGNED_URL_TTL = 60 * 60 * 2; // 2 hours in seconds

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

  // Only serve to requests originating from this platform
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const isLocalDev = !appUrl || appUrl.includes("localhost");

  if (!isLocalDev && appUrl) {
    const fromPlatform =
      (origin && origin.startsWith(appUrl)) ||
      (referer && referer.startsWith(appUrl));
    if (!fromPlatform) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(propertyId)) {
    return NextResponse.json({ error: "Invalid property" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  // Look up the VR record — platform-hosted video only, no embed/iframe
  const { data: vr, error } = await supabase
    .from("property_vr")
    .select("video_url, is_enabled")
    .eq("property_id", propertyId)
    .eq("is_enabled", true)
    .maybeSingle();

  if (error || !vr || !vr.video_url) {
    return NextResponse.json({ error: "VR not available" }, { status: 404 });
  }

  // video_url may be a full URL (legacy) or a bucket-relative storage path.
  let storagePath: string | null = null;
  const v = vr.video_url as string;
  const match = v.match(/property-vr\/(.+)$/);
  storagePath = match?.[1] ?? (v.startsWith("http") ? null : v);

  if (!storagePath) {
    return NextResponse.json({ error: "VR file not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("property-vr")
    .createSignedUrl(storagePath, SIGNED_URL_TTL);

  if (signError || !signed?.signedUrl) {
    console.error("[vr-api] Signed URL generation failed:", signError?.message);
    return NextResponse.json({ error: "Could not generate VR access token" }, { status: 500 });
  }

  return NextResponse.json(
    { signedUrl: signed.signedUrl, expiresIn: SIGNED_URL_TTL },
    {
      headers: {
        // Do not cache — each request gets a fresh signed URL
        "Cache-Control": "no-store",
        // Block embedding this response in external frames
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
