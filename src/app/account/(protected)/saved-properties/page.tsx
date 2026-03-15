"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import EmptyState from "@/components/EmptyState";
import { supabaseClient } from "@/lib/supabaseClient";

interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  type: string;
}

const STORAGE_KEY = "vbym_saved_properties";

export default function SavedPropertiesPage() {
  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        // Load from DB: join saved_properties → properties
        const { data } = await supabaseClient
          .from("saved_properties")
          .select(`
            property_id,
            properties(
              id, title, address, city, price_display,
              bedrooms, property_type
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        // Supabase returns properties as array in join; cast to handle type mismatch
        const properties: SavedProperty[] = (
          (data ?? []) as Array<{
            property_id: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties: any;
          }>
        ).flatMap((row) => {
          const p = row.properties;
          if (!p) return [];
          return [{
            id: p.id as string,
            title: (p.title ?? p.address) as string,
            location: (p.city ?? p.address) as string,
            price: (p.price_display ?? "Price on request") as string,
            beds: (p.bedrooms ?? 0) as number,
            type: p.property_type as string,
          }];
        });

        setSaved(properties);
      } else {
        // Guest: load from localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setSaved(raw ? (JSON.parse(raw) as SavedProperty[]) : []);
        } catch {
          setSaved([]);
        }
      }

      setLoaded(true);
    }

    load();
  }, []);

  async function remove(id: string) {
    if (isLoggedIn) {
      await supabaseClient
        .from("saved_properties")
        .delete()
        .eq("property_id", id);
    } else {
      const updated = saved.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setSaved((prev) => prev.filter((p) => p.id !== id));
  }

  if (!loaded) {
    return (
      <div className="space-y-4">
        <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
          Saved properties
        </h1>
        <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
        Saved properties
      </h1>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved properties yet"
          description="Tap the heart icon on any listing to save it here."
          actionLabel="Browse properties"
          actionHref="/browse"
        />
      ) : (
        <div className="space-y-3">
          {saved.map((property) => (
            <div
              key={property.id}
              className="rounded-2xl border border-gray-200 bg-white"
            >
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">
                    {property.title}
                  </p>
                  <p className="text-[13.5px] text-gray-500">
                    {property.location} · {property.price}
                    {property.beds > 0
                      ? ` · ${property.beds} bed${property.beds !== 1 ? "s" : ""}`
                      : ""}
                    {" "}· {property.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/property/${property.id}`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(property.id)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-[13.5px] text-gray-500 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
