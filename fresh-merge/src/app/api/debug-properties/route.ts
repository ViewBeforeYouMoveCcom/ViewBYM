import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  // Step 1: bare query
  const step1 = await supabase
    .from("properties")
    .select("id, title, status, featured")
    .eq("status", "published")
    .limit(3);

  // Step 2: add agencies join
  const step2 = await supabase
    .from("properties")
    .select("id, title, agencies(name)")
    .eq("status", "published")
    .limit(3);

  // Step 3: add property_media join
  const step3 = await supabase
    .from("properties")
    .select("id, title, property_media(public_url, sort_order)")
    .eq("status", "published")
    .limit(3);

  // Step 4: add property_vr join
  const step4 = await supabase
    .from("properties")
    .select("id, title, property_vr(embed_url, iframe_html, is_enabled)")
    .eq("status", "published")
    .limit(3);

  // Step 5: all columns no joins
  const step5 = await supabase
    .from("properties")
    .select("id, agency_id, title, address_line1, address_line2, city, postcode, price, price_qualifier, bedrooms, bathrooms, area_sqft, property_type, tenure, listing_type, features, featured, description, market_status, status")
    .eq("status", "published")
    .limit(3);

  return NextResponse.json({
    step1: { ok: !step1.error, error: step1.error?.message, count: step1.data?.length },
    step2: { ok: !step2.error, error: step2.error?.message, count: step2.data?.length },
    step3: { ok: !step3.error, error: step3.error?.message, count: step3.data?.length },
    step4: { ok: !step4.error, error: step4.error?.message, count: step4.data?.length },
    step5: { ok: !step5.error, error: step5.error?.message, count: step5.data?.length },
  });
}
