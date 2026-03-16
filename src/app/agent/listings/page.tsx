"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import { supabaseClient } from "@/lib/supabaseClient";

type PropStatus = "draft" | "published" | "archived";

interface Property {
  id: string;
  title: string;
  address: string;
  price_display: string | null;
  bedrooms: number | null;
  status: PropStatus;
  created_at: string;
}

const statusVariant: Record<PropStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

const TAB_OPTIONS: { label: string; value: PropStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function AgentListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tab, setTab] = useState<PropStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabaseClient
        .from("agency_members")
        .select("agency_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!membership) { setLoading(false); return; }
      setAgencyId(membership.agency_id);

      const { data } = await supabaseClient
        .from("properties")
        .select("id, title, address, price_display, bedrooms, status, created_at")
        .eq("agency_id", membership.agency_id)
        .order("created_at", { ascending: false });

      setProperties((data as Property[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    tab === "all" ? properties : properties.filter((p) => p.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">
          My listings
        </h1>
        <Button
          asChild
          className="h-10 rounded-[10px] bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Link href="/agent/listings/new">+ Add listing</Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TAB_OPTIONS.map((t) => {
          const count =
            t.value === "all"
              ? properties.length
              : properties.filter((p) => p.status === t.value).length;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Add your first property listing to get started."
          actionLabel="Add listing"
          actionHref="/agent/listings/new"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((property) => (
            <Card key={property.id} className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {property.title || property.address || "Untitled listing"}
                    </p>
                    <Badge variant={statusVariant[property.status]}>
                      {property.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {[property.address, property.price_display, property.bedrooms ? `${property.bedrooms} bed` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  className="h-9 rounded-[10px] text-sm"
                >
                  <Link href={`/agent/listings/${property.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
