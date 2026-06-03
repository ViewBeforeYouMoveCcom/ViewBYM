import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const client = createTokenClient(token);
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser(token);

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: isAdmin, error: adminError } = await client.rpc("is_admin");
  if (adminError || !isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { client };
}

export async function GET(req: NextRequest) {
  const checked = await requireAdmin(req);
  if ("error" in checked) return checked.error;

  const { data, error } = await checked.client
    .from("agent_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const checked = await requireAdmin(req);
  if ("error" in checked) return checked.error;

  const body = await req.json().catch(() => null) as {
    id?: string;
    status?: "new" | "in_review" | "approved" | "rejected";
    notes?: string | null;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ error: "Missing application id" }, { status: 400 });
  }

  const update: { status?: string; notes?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (body.status) update.status = body.status;
  if ("notes" in body) update.notes = body.notes ?? null;

  const { data, error } = await checked.client
    .from("agent_applications")
    .update(update)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
