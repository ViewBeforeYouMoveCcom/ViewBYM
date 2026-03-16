"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import type { Property } from "@/data/properties";
import { supabaseClient } from "@/lib/supabaseClient";

const BED_OPTIONS = [
  { label: "Any beds", min: 0 },
  { label: "Studio+", min: 0 },
  { label: "1+", min: 1 },
  { label: "2+", min: 2 },
  { label: "3+", min: 3 },
  { label: "4+", min: 4 },
];

const TYPE_OPTIONS = [
  "Any type",
  "Apartment",
  "House",
  "Townhouse",
  "New build",
  "Studio",
  "Detached",
  "Semi-detached",
  "Loft",
  "Penthouse",
  "Cottage",
];

type SortKey = "recommended" | "price_asc" | "price_desc";

interface InitialFilters {
  location: string;
  beds: string;
  type: string;
  vrOnly: boolean;
  sort: SortKey;
}

interface Props {
  initialProperties: Property[];
  initialHasSearched?: boolean;
  initialFilters?: InitialFilters;
}

function parsePricePence(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, "").replace(/,/g, ""));
  if (isNaN(n)) return 0;
  if (price.includes("m") || price.toLowerCase().includes("m")) return n * 1_000_000;
  if (price.includes("k") || price.toLowerCase().includes("k")) return n * 1_000;
  return n;
}

export default function BrowseClient({
  initialProperties,
  initialHasSearched = false,
  initialFilters,
}: Props) {
  const router = useRouter();
  const [hasSearched, setHasSearched] = useState(initialHasSearched);
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);

  // Search form values (shown before commit)
  const [locationInput, setLocationInput] = useState(initialFilters?.location ?? "");
  const [bedsInput, setBedsInput] = useState(initialFilters?.beds ?? "Any beds");
  const [typeInput, setTypeInput] = useState(initialFilters?.type ?? "Any type");
  const [vrOnly, setVrOnly] = useState(initialFilters?.vrOnly ?? true);
  const [sort, setSort] = useState<SortKey>(initialFilters?.sort ?? "recommended");

  // Committed filters used for client-side filtering
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [beds, setBeds] = useState(initialFilters?.beds ?? "Any beds");
  const [type, setType] = useState(initialFilters?.type ?? "Any type");

  // Build URL with current search params and navigate (triggers server re-fetch)
  const buildSearchUrl = useCallback(
    (loc: string, b: string, t: string, vr: boolean, s: SortKey) => {
      const p = new URLSearchParams();
      if (loc) p.set("location", loc);
      const bedOption = BED_OPTIONS.find((o) => o.label === b);
      if (bedOption && bedOption.min > 0) p.set("beds", String(bedOption.min));
      if (t !== "Any type") p.set("type", t.toLowerCase().replace(" ", "_"));
      if (vr) p.set("vr", "1");
      if (s !== "recommended") p.set("sort", s);
      return `/browse?${p.toString()}`;
    },
    []
  );

  function handleSearch() {
    const loc = locationInput.trim();
    setLocation(loc);
    setBeds(bedsInput);
    setType(typeInput);
    setHasSearched(true);
    setSearchSaved(false);
    router.push(buildSearchUrl(loc, bedsInput, typeInput, vrOnly, sort));
  }

  function handleReset() {
    setLocationInput("");
    setBedsInput("Any beds");
    setTypeInput("Any type");
    setVrOnly(true);
    setSort("recommended");
    setLocation("");
    setBeds("Any beds");
    setType("Any type");
    setHasSearched(false);
    setSearchSaved(false);
    router.push("/browse");
  }

  // Client-side filtering on top of server-fetched data (handles sort changes without re-fetch)
  const filtered = useMemo(() => {
    let list = [...initialProperties];

    if (vrOnly) list = list.filter((p) => p.vrEnabled);

    if (location) {
      const q = location.toLowerCase();
      list = list.filter(
        (p) =>
          p.location.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }

    const bedOption = BED_OPTIONS.find((b) => b.label === beds);
    if (bedOption && bedOption.min > 0) {
      list = list.filter((p) => p.beds >= bedOption.min);
    }

    if (type !== "Any type") {
      list = list.filter((p) => p.type.toLowerCase() === type.toLowerCase());
    }

    if (sort === "price_asc") {
      list.sort((a, b) => parsePricePence(a.price) - parsePricePence(b.price));
    } else if (sort === "price_desc") {
      list.sort((a, b) => parsePricePence(b.price) - parsePricePence(a.price));
    }

    return list;
  }, [initialProperties, location, beds, type, vrOnly, sort]);

  // Save current search to DB (for logged-in users) or localStorage (guests)
  async function saveSearch() {
    setSavingSearch(true);
    const filters = {
      location: location || undefined,
      beds: beds !== "Any beds" ? beds : undefined,
      type: type !== "Any type" ? type : undefined,
      vrOnly,
      sort,
    };
    const label = [
      location || "All areas",
      beds !== "Any beds" ? beds : null,
      type !== "Any type" ? type : null,
      vrOnly ? "VR only" : null,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (user) {
        // Logged-in: save to DB
        await supabaseClient.from("saved_searches").insert({
          user_id: user.id,
          label,
          filters,
        });
      } else {
        // Guest: save to localStorage
        const STORAGE_KEY = "vbym_saved_searches";
        const raw = localStorage.getItem(STORAGE_KEY);
        const existing = raw ? (JSON.parse(raw) as Array<{ id: string; label: string; filters: object }>) : [];
        const entry = { id: crypto.randomUUID(), label, filters };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
      }

      setSearchSaved(true);
      setTimeout(() => setSearchSaved(false), 3000);
    } catch {
      // silently ignore
    } finally {
      setSavingSearch(false);
    }
  }

  /* ── Search landing ── */
  if (!hasSearched) {
    return (
      <div className="mt-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 md:p-8">
            <p className="text-sm font-semibold text-gray-900">Where are you looking?</p>
            <p className="mt-1 text-[14px] text-gray-500">
              Enter a postcode, town, or area to find VR-enabled properties nearby.
            </p>

            <div className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="e.g. E14, Canary Wharf, Manchester"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-gray-900 placeholder-[#9CA3AF] focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={bedsInput}
                  onChange={(e) => setBedsInput(e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
                >
                  {BED_OPTIONS.map((o) => (
                    <option key={o.label}>{o.label}</option>
                  ))}
                </select>

                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3">
                <div>
                  <p className="text-sm text-gray-900">Immersive VR only</p>
                  <p className="text-xs text-[#6B7280]">
                    Only show properties with an Immersive VR tour.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={vrOnly}
                  onClick={() => setVrOnly((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${vrOnly ? "bg-blue-700" : "bg-[#E5E7EB]"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${vrOnly ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <Button
                onClick={handleSearch}
                className="h-12 w-full rounded-[10px] bg-blue-700 text-sm font-semibold font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Search properties
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-[#6B7280]">
              Leave location blank to{" "}
              <button
                type="button"
                className="underline hover:text-gray-900"
                onClick={handleSearch}
              >
                browse all available properties
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results view ── */
  return (
    <div className="mt-5">
      {/* Active search bar (compact) */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Location or postcode…"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-10 flex-1 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <select
            value={bedsInput}
            onChange={(e) => setBedsInput(e.target.value)}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-sm text-gray-900 focus:outline-none"
          >
            {BED_OPTIONS.map((o) => (
              <option key={o.label}>{o.label}</option>
            ))}
          </select>

          <select
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-sm text-gray-900 focus:outline-none"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <Button
            onClick={handleSearch}
            className="h-10 rounded-[8px] bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Search
          </Button>

          <button
            type="button"
            onClick={handleReset}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#6B7280] hover:text-gray-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {/* Count + Sort + VR toggle + Save search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[#6B7280]">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
              {location && (
                <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-medium text-gray-900">
                  {location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* VR toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={vrOnly}
                onClick={() => setVrOnly((v) => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${vrOnly ? "bg-blue-700" : "bg-[#E5E7EB]"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${vrOnly ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </button>
              <span className="text-xs text-[#6B7280]">VR only</span>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="ml-2 h-9 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>

              {/* Save search */}
              <button
                type="button"
                onClick={saveSearch}
                disabled={savingSearch || searchSaved}
                className="h-9 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#6B7280] hover:text-gray-900 disabled:opacity-60"
              >
                {searchSaved ? "Search saved ✓" : savingSearch ? "Saving…" : "Save search"}
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No results"
              description={
                location
                  ? `No properties found near "${location}". Try a broader area or different filters.`
                  : "No properties match your filters. Try adjusting beds or type."
              }
              actionLabel="Reset search"
              actionHref="/browse"
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((property) => (
                <div key={property.id} className="w-full">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="text-sm font-semibold text-gray-900">Tip</p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Open a listing and launch the Immersive VR tour to understand layout and flow before
                booking a viewing.
              </p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="text-sm font-semibold text-gray-900">Save this search</p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Click &quot;Save search&quot; to keep these filters for later.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
