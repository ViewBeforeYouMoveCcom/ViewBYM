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
  approved: "Approved Founding Member. You can publish listings.",
  suspended: "Your agency has been suspended. Contact VBYM support.",
  rejected: "Your agency application was not approved. Contact VBYM for details.",
};

export default function AgentDashboardPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);

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

      // Show one-time popup when agency is first approved
      if (agencyData?.status === "approved") {
        const key = `vbym_approved_seen_${agencyData.id}`;
        if (!localStorage.getItem(key)) {
          setShowApprovedPopup(true);
          localStorage.setItem(key, "1");
        }
      }

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
      {/* One-time approval popup */}
      {showApprovedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#08519A] px-8 py-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="text-[22px] font-extrabold text-white">You&apos;re Approved!</h2>
              <p className="mt-1 text-[13px] text-blue-200">Approved Founding Member</p>
            </div>
            <div className="px-8 py-6 text-center">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Congratulations! Your agency <strong>{agency?.name}</strong> has been approved on ViewBeforeYouMove.
              </p>
              <p className="mt-2 text-[14px] text-gray-500">
                You can now start adding property listings and reach thousands of buyers.
              </p>
              <Link
                href="/agent/listings/new"
                onClick={() => setShowApprovedPopup(false)}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#08519A] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#063d75]"
              >
                Start listing a property →
              </Link>
              <button
                type="button"
                onClick={() => setShowApprovedPopup(false)}
                className="mt-3 text-[13px] text-gray-400 hover:text-gray-600"
              >
                I&apos;ll do this later
              </button>
            </div>
          </div>
        </div>
      )}
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
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
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
