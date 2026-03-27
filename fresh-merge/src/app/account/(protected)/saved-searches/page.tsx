"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import EmptyState from "@/components/EmptyState";
import { supabaseClient } from "@/lib/supabaseClient";

interface SavedSearch {
  id: string;
  label: string | null;
  filters: Record<string, unknown>;
  created_at: string;
}

const STORAGE_KEY = "vbym_saved_searches";

function filtersToUrl(filters: Record<string, unknown>): string {
  const p = new URLSearchParams();
  if (filters.location) p.set("location", String(filters.location));
  if (filters.beds && filters.beds !== "Any beds") {
    const match = String(filters.beds).match(/(\d+)/);
    if (match) p.set("beds", match[1]);
  }
  if (filters.type && filters.type !== "Any type") {
    p.set("type", String(filters.type).toLowerCase().replace(" ", "_"));
  }
  if (filters.vrOnly) p.set("vr", "1");
  if (filters.sort && filters.sort !== "recommended") p.set("sort", String(filters.sort));
  return `/browse?${p.toString()}`;
}

function filtersToSummary(filters: Record<string, unknown>): string {
  const parts: string[] = [];
  if (filters.location) parts.push(String(filters.location));
  if (filters.beds && filters.beds !== "Any beds") parts.push(String(filters.beds));
  if (filters.type && filters.type !== "Any type") parts.push(String(filters.type));
  if (filters.vrOnly) parts.push("VR only");
  return parts.length > 0 ? parts.join(", ") : "All properties";
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        const { data } = await supabaseClient
          .from("saved_searches")
          .select("id, label, filters, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setSearches((data ?? []) as SavedSearch[]);
      } else {
        // Guest: load from localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const stored = raw ? (JSON.parse(raw) as Array<{ id: string; label?: string; filters: Record<string, unknown> }>) : [];
          setSearches(stored.map((s) => ({
            id: s.id,
            label: s.label ?? null,
            filters: s.filters,
            created_at: new Date().toISOString(),
          })));
        } catch {
          setSearches([]);
        }
      }

      setLoaded(true);
    }

    load();
  }, []);

  async function remove(id: string) {
    if (isLoggedIn) {
      await supabaseClient.from("saved_searches").delete().eq("id", id);
    } else {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) as Array<{ id: string }> : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((s) => s.id !== id)));
    }
    setSearches((prev) => prev.filter((s) => s.id !== id));
  }

  if (!loaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            Saved searches
          </h1>
          <div className="h-9 w-44 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-3.5 w-64 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
          Saved searches
        </h1>
        <Link
          href="/browse"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors"
        >
          Browse to save a search
        </Link>
      </div>

      {searches.length === 0 ? (
        <EmptyState
          title="No saved searches yet"
          description="Use the Browse page to filter properties, then click 'Save search' to store it here."
          actionLabel="Browse properties"
          actionHref="/browse"
        />
      ) : (
        <div className="space-y-3">
          {searches.map((search) => {
            const summary = search.label ?? filtersToSummary(search.filters);
            const browseUrl = filtersToUrl(search.filters);
            return (
              <div
                key={search.id}
                className="rounded-2xl border border-gray-200 bg-white"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">{summary}</p>
                    <p className="text-[13.5px] text-gray-500">
                      {filtersToSummary(search.filters)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={browseUrl}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      Browse
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(search.id)}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-[13.5px] text-gray-500 hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
