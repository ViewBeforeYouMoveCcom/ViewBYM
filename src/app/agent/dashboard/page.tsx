"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

type AgencyStatus = "pending" | "approved" | "suspended" | "rejected";

interface Agency {
  id: string;
  name: string;
  status: AgencyStatus;
}

interface Stats {
  published: number;
  draft: number;
  enquiries: number;
  newEnquiries: number;
  handledEnquiries: number;
}

function getAuthDisplayName(user: User) {
  const metadata = user.user_metadata as Record<string, unknown>;
  const candidates = [
    metadata.full_name,
    metadata.name,
    metadata.display_name,
    metadata.user_name,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return user.email?.split("@")[0] ?? "Agent";
}

const statusVariant: Record<AgencyStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  pending: "amber",
  approved: "success",
  suspended: "warning",
  rejected: "error",
};

const statusMessage: Record<AgencyStatus, string> = {
  pending: "Your agency is pending review. You can add listings once approved.",
  approved: "Your agency is approved. You can publish listings.",
  suspended: "Your agency has been suspended. Contact VBYM support.",
  rejected: "Your agency application was not approved. Contact VBYM for details.",
};

export default function AgentDashboardPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setAgentName(profile?.full_name?.trim() || getAuthDisplayName(user));

      const { data: memberships } = await supabaseClient
        .from("agency_members")
        .select("agency_id, agencies(id, name, status)")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!memberships) { setLoading(false); return; }

      const agencyData = (memberships as unknown as { agencies: Agency }).agencies ?? null;
      setAgency(agencyData);

      if (!agencyData) { setLoading(false); return; }

      // Load stats
      const [
        { count: published },
        { count: draft },
        { count: enquiries },
        { count: newEnquiries },
        { count: handledEnquiries },
      ] = await Promise.all([
        supabaseClient
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("agency_id", agencyData.id)
          .eq("status", "published"),
        supabaseClient
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("agency_id", agencyData.id)
          .eq("status", "draft"),
        supabaseClient
          .from("enquiries")
          .select("properties!inner(agency_id)", { count: "exact", head: true })
          .eq("properties.agency_id", agencyData.id),
        supabaseClient
          .from("enquiries")
          .select("properties!inner(agency_id)", { count: "exact", head: true })
          .eq("properties.agency_id", agencyData.id)
          .is("handled_at", null),
        supabaseClient
          .from("enquiries")
          .select("properties!inner(agency_id)", { count: "exact", head: true })
          .eq("properties.agency_id", agencyData.id)
          .not("handled_at", "is", null),
      ]);

      setStats({
        published: published ?? 0,
        draft: draft ?? 0,
        enquiries: enquiries ?? 0,
        newEnquiries: newEnquiries ?? 0,
        handledEnquiries: handledEnquiries ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-24 animate-pulse rounded-xl bg-white border border-[#E5E7EB]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            {agentName ?? "Dashboard"}
          </h1>
          {agency?.name && (
            <p className="mt-1 text-sm text-[#6B7280]">{agency.name}</p>
          )}
        </div>
        {agency && (
          <Badge variant={statusVariant[agency.status]}>{agency.status}</Badge>
        )}
      </div>

      {/* Status banner */}
      {agency && (
        <div className={`rounded-xl border p-4 text-sm ${
          agency.status === "approved"
            ? "border-blue-200 bg-blue-50 text-gray-900"
            : agency.status === "pending"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {statusMessage[agency.status]}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Published listings", value: stats.published },
            { label: "Draft listings", value: stats.draft },
            { label: "Total enquiries", value: stats.enquiries },
            { label: "New enquiries", value: stats.newEnquiries },
            { label: "Handled / replied", value: stats.handledEnquiries },
          ].map((tile) => (
            <Card key={tile.label} className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                  {tile.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {tile.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold text-gray-900">Quick actions</p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="h-10 rounded-[10px] bg-[#08519A] text-sm font-semibold !text-white hover:bg-[#063d75]"
              disabled={agency?.status !== "approved"}
            >
              <Link href="/agent/listings/new">Add listing</Link>
            </Button>
            <Button asChild variant="secondary" className="h-10 rounded-[10px] text-sm">
              <Link href="/agent/listings">View all listings</Link>
            </Button>
            <Button asChild variant="secondary" className="h-10 rounded-[10px] text-sm">
              <Link href="/agent/enquiries">View enquiries</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
