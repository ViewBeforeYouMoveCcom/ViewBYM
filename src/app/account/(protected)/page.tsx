"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

interface DashboardData {
  email: string;
  fullName: string | null;
  savedPropertiesCount: number;
  savedSearchesCount: number;
}

const quickLinks = [
  {
    href: "/account/saved-properties",
    label: "Saved properties",
    description: "Properties you have shortlisted",
  },
  {
    href: "/account/saved-searches",
    label: "Saved searches",
    description: "Filters you have stored for quick access",
  },
  {
    href: "/account/alerts",
    label: "Alert preferences",
    description: "Choose which updates to receive",
  },
  {
    href: "/account/settings",
    label: "Account settings",
    description: "Email, password, and profile details",
  },
];

export default function AccountDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) return;

      const [{ count: savedCount }, { count: searchCount }, { data: profile }] =
        await Promise.all([
          supabaseClient
            .from("saved_properties")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabaseClient
            .from("saved_searches")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabaseClient
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle(),
        ]);

      setData({
        email: user.email ?? "",
        fullName: profile?.full_name ?? null,
        savedPropertiesCount: savedCount ?? 0,
        savedSearchesCount: searchCount ?? 0,
      });
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </div>
    );
  }

  const displayName = data?.fullName || data?.email || "your account";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
          Welcome back
          {data?.fullName ? `, ${data.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">{displayName}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="rounded-xl border border-gray-200">
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[.08em] text-gray-400">
              Saved properties
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {data?.savedPropertiesCount ?? 0}
            </p>
            <Link
              href="/account/saved-properties"
              className="mt-2 block text-[13px] text-blue-700 hover:underline"
            >
              View all →
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-gray-200">
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[.08em] text-gray-400">
              Saved searches
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {data?.savedSearchesCount ?? 0}
            </p>
            <Link
              href="/account/saved-searches"
              className="mt-2 block text-[13px] text-blue-700 hover:underline"
            >
              View all →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <p className="mb-3 text-[13px] font-semibold text-gray-900">
          Your account
        </p>
        <div className="space-y-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <div>
                <p className="text-[14px] font-semibold text-gray-900">
                  {item.label}
                </p>
                <p className="text-[13px] text-gray-500">{item.description}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-gray-400"
                aria-hidden="true"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse CTA */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-[14px] font-semibold text-blue-900">
          Looking for your next home?
        </p>
        <p className="mt-1 text-[13px] text-blue-700/80">
          Browse immersive VR-enabled listings and save properties to your
          shortlist.
        </p>
        <Link
          href="/browse"
          className="mt-3 inline-flex h-9 items-center rounded-[10px] bg-blue-700 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}
