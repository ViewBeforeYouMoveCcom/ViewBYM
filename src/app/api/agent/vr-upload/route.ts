import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase-server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext || "mp4";
}

type AgentCheck =
  | { service: SupabaseClient }
  | { error: NextResponse };

function createTokenClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getRequestAuth(req: NextRequest): Promise<{ client: SupabaseClient; user: User | null }> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (token) {
    const client = createTokenClient(token);
    const {
      data: { user },
    } = await client.auth.getUser(token);

    return { client, user };
  }

  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return { client: authClient, user };
}

async function requireAgentProperty(req: NextRequest, propertyId: string): Promise<AgentCheck> {
  if (!UUID_RE.test(propertyId)) {
    return { error: NextResponse.json({ error: "Invalid property." }, { status: 400 }) };
  }

  const { client, user } = await getRequestAuth(req);
  if (!user) {
    return { error: NextResponse.json({ error: "Session expired." }, { status: 401 }) };
  }

  const { data: property } = await client
    .from("properties")
    .select("id, agency_id")
    .eq("id", propertyId)
    .single();

  if (!property) {
    return { error: NextResponse.json({ error: "Property not found." }, { status: 404 }) };
  }

  const { data: membership } = await client
    .from("agency_members")
    .select("id")
    .eq("agency_id", property.agency_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return { error: NextResponse.json({ error: "Not allowed." }, { status: 403 }) };
  }

  return { service: client };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as { propertyId?: string; fileName?: string } | null;
    const propertyId = body?.propertyId ?? "";
    const fileName = body?.fileName ?? "tour.mp4";

    const checked = await requireAgentProperty(req, propertyId);
    if ("error" in checked) return checked.error;

    const path = `${propertyId}/tour-${Date.now()}.${safeExtension(fileName)}`;
    const { data, error } = await checked.service.storage
      .from("property-vr")
      .createSignedUploadUrl(path);

    if (error || !data?.token) {
      return NextResponse.json({ error: error?.message ?? "Could not create VR upload URL." }, { status: 500 });
    }

    return NextResponse.json({ path, token: data.token });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create VR upload URL." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as { propertyId?: string; path?: string } | null;
    const propertyId = body?.propertyId ?? "";
    const path = body?.path ?? "";

    const checked = await requireAgentProperty(req, propertyId);
    if ("error" in checked) return checked.error;

    if (!path.startsWith(`${propertyId}/`)) {
      return NextResponse.json({ error: "Invalid VR path." }, { status: 400 });
    }

    const { error } = await checked.service
      .from("property_vr")
      .upsert({
        property_id: propertyId,
        video_path: path,
        is_enabled: true,
        submission_status: "ready",
        submitted_at: new Date().toISOString(),
      }, { onConflict: "property_id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save VR tour." },
      { status: 500 }
    );
  }
}
