"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

interface Stats {
  pendingApplications: number;
  totalAgencies: number;
  approvedAgencies: number;
  publishedProperties: number;
  enquiries30d: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [
        { count: pendingApplications },
        { count: totalAgencies },
        { count: approvedAgencies },
        { count: publishedProperties },
        { count: enquiries30d },
      ] = await Promise.all([
        supabaseClient
          .from("agent_applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
        supabaseClient
          .from("agencies")
          .select("*", { count: "exact", head: true }),
        supabaseClient
          .from("agencies")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
        supabaseClient
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
        supabaseClient
          .from("enquiries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        pendingApplications: pendingApplications ?? 0,
        totalAgencies: totalAgencies ?? 0,
        approvedAgencies: approvedAgencies ?? 0,
        publishedProperties: publishedProperties ?? 0,
        enquiries30d: enquiries30d ?? 0,
      });
    }
    load();
  }, []);

  const tiles = stats
    ? [
        { label: "Pending applications", value: stats.pendingApplications, highlight: stats.pendingApplications > 0 },
        { label: "Approved agencies", value: `${stats.approvedAgencies} / ${stats.totalAgencies}` },
        { label: "Published properties", value: stats.publishedProperties },
        { label: "Enquiries (30 days)", value: stats.enquiries30d },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
        Dashboard
      </h1>

      {!stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Card
              key={tile.label}
              className={`rounded-xl border ${tile.highlight ? "border-amber-200 bg-amber-50" : "border-[#E5E7EB] bg-white"}`}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                  {tile.label}
                </p>
                <p className={`mt-2 text-3xl font-semibold ${tile.highlight ? "text-amber-700" : "text-[#0F172A]"}`}>
                  {tile.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <p className="text-sm font-semibold text-[#0F172A]">Quick links</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a href="/admin/applications" className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-[#0F172A] hover:bg-[#F9FAFB]">
            Review applications →
          </a>
          <a href="/admin/agencies" className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-[#0F172A] hover:bg-[#F9FAFB]">
            Manage agencies →
          </a>
        </div>
      </div>
    </div>
  );
}
