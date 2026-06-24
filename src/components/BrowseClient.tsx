"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import EmptyState from "@/components/EmptyState";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
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


const RADIUS_OPTIONS = [
  { label: "This area only", value: "" },
  { label: "Within 1 mile", value: "1" },
  { label: "Within 5 miles", value: "5" },
  { label: "Within 10 miles", value: "10" },
  { label: "Within 20 miles", value: "20" },
  { label: "Within 50 miles", value: "50" },
];

const MIN_PRICE_OPTIONS = [
  { label: "No min", value: "" },
  { label: "£50,000", value: "50000" },
  { label: "£100,000", value: "100000" },
  { label: "£150,000", value: "150000" },
  { label: "£200,000", value: "200000" },
  { label: "£300,000", value: "300000" },
  { label: "£400,000", value: "400000" },
  { label: "£500,000", value: "500000" },
  { label: "£750,000", value: "750000" },
  { label: "£1,000,000", value: "1000000" },
];

const MAX_PRICE_OPTIONS = [
  { label: "No max", value: "" },
  { label: "£100,000", value: "100000" },
  { label: "£150,000", value: "150000" },
  { label: "£200,000", value: "200000" },
  { label: "£300,000", value: "300000" },
  { label: "£400,000", value: "400000" },
  { label: "£500,000", value: "500000" },
  { label: "£750,000", value: "750000" },
  { label: "£1,000,000", value: "1000000" },
  { label: "£1,500,000", value: "1500000" },
  { label: "£2,000,000", value: "2000000" },
];

type SortKey = "recommended" | "price_asc" | "price_desc";
type ViewMode = "list" | "map";
type SearchTab = "buy" | "rent" | "new" | "commercial";

const SEARCH_TABS: { id: SearchTab; label: string }[] = [
  { id: "buy",        label: "Buy" },
  { id: "rent",       label: "Rent" },
  { id: "new",        label: "New Homes" },
  { id: "commercial", label: "Commercial" },
];

function listingTypeToTab(lt: string): SearchTab {
  if (lt === "rent") return "rent";
  if (lt === "new") return "new";
  if (lt === "commercial") return "commercial";
  return "buy";
}

function tabToListingType(tab: SearchTab): string {
  if (tab === "rent") return "rent";
  if (tab === "new") return "new";
  if (tab === "commercial") return "commercial";
  return "sale";
}

interface InitialFilters {
  location: string;
  beds: string;
  type: string;
  listingType?: string;
  vrOnly: boolean;
  sort: SortKey;
  radius: string;
  priceMin?: string;
  priceMax?: string;
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
  const [lastSearchUrl, setLastSearchUrl] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(initialHasSearched);
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<SearchTab>(
    listingTypeToTab(initialFilters?.listingType ?? "")
  );

  // Search form values (shown before commit)
  const [locationInput, setLocationInput] = useState(initialFilters?.location ?? "");
  const [bedsInput, setBedsInput] = useState(initialFilters?.beds ?? "Any beds");
  const [typeInput, setTypeInput] = useState(initialFilters?.type ?? "Any type");
  const [vrOnly, setVrOnly] = useState(initialFilters?.vrOnly ?? true);
  const [sort, setSort] = useState<SortKey>(initialFilters?.sort ?? "recommended");
  const [radiusInput, setRadiusInput] = useState(initialFilters?.radius ?? "");
  const [radius, setRadius] = useState(initialFilters?.radius ?? "");
  const [minPriceInput, setMinPriceInput] = useState(initialFilters?.priceMin ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(initialFilters?.priceMax ?? "");
  const [minPrice, setMinPrice] = useState(initialFilters?.priceMin ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.priceMax ?? "");

  // Committed filters used for client-side filtering
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [beds, setBeds] = useState(initialFilters?.beds ?? "Any beds");
  const [type, setType] = useState(initialFilters?.type ?? "Any type");

  // Load last search URL from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("vbym_last_search");
      if (saved) setLastSearchUrl(saved);
    } catch {}
  }, []);

  // Build URL with current search params and navigate (triggers server re-fetch)
  const buildSearchUrl = useCallback(
    (loc: string, b: string, t: string, vr: boolean, s: SortKey, r: string, pMin: string, pMax: string, tab: SearchTab) => {
      const p = new URLSearchParams();
      if (loc) p.set("location", loc);
      const bedOption = BED_OPTIONS.find((o) => o.label === b);
      if (bedOption && bedOption.min > 0) p.set("beds", String(bedOption.min));
      if (t !== "Any type") p.set("type", t.toLowerCase().replace(" ", "_"));
      if (vr) p.set("vr", "1");
      if (s !== "recommended") p.set("sort", s);
      if (r) p.set("radius", r);
      if (pMin) p.set("price_min", pMin);
      if (pMax) p.set("price_max", pMax);
      const lt = tabToListingType(tab);
      if (lt) p.set("listing_type", lt);
      const url = `/browse?${p.toString()}`;
      try { sessionStorage.setItem("vbym_last_search", url); } catch {}
      return url;
    },
    []
  );

  function handleSearch(overrideTab?: SearchTab) {
    const tab = overrideTab ?? activeTab;
    const loc = locationInput.trim();
    setLocation(loc);
    setBeds(bedsInput);
    setType(typeInput);
    setRadius(radiusInput);
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setHasSearched(true);
    setSearchSaved(false);
    router.push(buildSearchUrl(loc, bedsInput, typeInput, vrOnly, sort, radiusInput, minPriceInput, maxPriceInput, tab));
  }

  function handleTabChange(tab: SearchTab) {
    setActiveTab(tab);
    handleSearch(tab);
  }

  function handleReset() {
    setLocationInput("");
    setBedsInput("Any beds");
    setTypeInput("Any type");
    setRadiusInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setVrOnly(true);
    setSort("recommended");
    setLocation("");
    setBeds("Any beds");
    setType("Any type");
    setRadius("");
    setMinPrice("");
    setMaxPrice("");
    setHasSearched(false);
    setSearchSaved(false);
    try { sessionStorage.removeItem("vbym_last_search"); } catch {}
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

    if (minPrice) {
      const min = parseInt(minPrice, 10);
      list = list.filter((p) => parsePricePence(p.price) >= min);
    }

    if (maxPrice) {
      const max = parseInt(maxPrice, 10);
      list = list.filter((p) => parsePricePence(p.price) <= max);
    }

    if (sort === "price_asc") {
      list.sort((a, b) => parsePricePence(a.price) - parsePricePence(b.price));
    } else if (sort === "price_desc") {
      list.sort((a, b) => parsePricePence(b.price) - parsePricePence(a.price));
    }

    return list;
  }, [initialProperties, location, beds, type, vrOnly, sort, minPrice, maxPrice]);

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
          name: label,
          filters,
        });
        setSearchSaved(true);
        setTimeout(() => setSearchSaved(false), 3000);
      } else {
        // Guest: redirect to login with a return URL
        router.push("/account/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
        return;
      }
    } catch {
      // silently ignore
    } finally {
      setSavingSearch(false);
    }
  }

  /* ── Tab strip (shared) ── */
  const tabStrip = (
    <div className="flex gap-0 border-b border-[#E5E7EB] mb-5">
      {SEARCH_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => handleTabChange(tab.id)}
          className={`relative px-5 py-3 text-[13.5px] font-semibold tracking-wide transition-colors ${
            activeTab === tab.id
              ? "text-[#08519A]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full bg-[#08519A]" />
          )}
        </button>
      ))}
    </div>
  );

  /* ── Search landing ── */
  if (!hasSearched) {
    return (
      <div className="mt-8">
        <div className="mx-auto max-w-4xl">
          {tabStrip}
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 md:p-8">
            <p className="text-sm font-semibold text-gray-900">Where are you looking?</p>
            <p className="mt-1 text-[14px] text-gray-500">
              Enter a postcode, town, or area to find VR-enabled properties nearby.
            </p>

            <div className="mt-5 space-y-3">
              <LocationAutocomplete
                placeholder="e.g. E14, Canary Wharf, Manchester"
                value={locationInput}
                onChange={setLocationInput}
                onSelect={setLocationInput}
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

                <select
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
                >
                  {MIN_PRICE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <select
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
                >
                  {MAX_PRICE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <select
                value={radiusInput}
                onChange={(e) => setRadiusInput(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${vrOnly ? "bg-[#08519A]" : "bg-[#E5E7EB]"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${vrOnly ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleSearch()}
                  className="h-12 flex-1 rounded-[10px] bg-[#08519A] text-sm font-semibold text-white transition-colors hover:bg-[#063d75]"
                >
                  Search properties
                </Button>
                {lastSearchUrl && (
                  <Button
                    onClick={() => router.push(lastSearchUrl)}
                    variant="secondary"
                    className="h-12 rounded-[10px] px-4 text-sm font-semibold"
                  >
                    ← Back to last search
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#6B7280]">
              Leave location blank to{" "}
              <button
                type="button"
                className="underline hover:text-gray-900"
                onClick={() => handleSearch()}
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
      {tabStrip}
      {/* Active search bar (compact) */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 md:flex-row md:items-center">
        <LocationAutocomplete
          placeholder="Location or postcode…"
          value={locationInput}
          onChange={setLocationInput}
          onSelect={setLocationInput}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-10 flex-1 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2">
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

          <select
            value={radiusInput}
            onChange={(e) => setRadiusInput(e.target.value)}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-sm text-gray-900 focus:outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-sm text-gray-900 focus:outline-none"
          >
            {MIN_PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-10 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-sm text-gray-900 focus:outline-none"
          >
            {MAX_PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <Button
            onClick={() => handleSearch()}
            className="h-10 rounded-[8px] bg-[#08519A] px-4 text-sm font-semibold text-white hover:bg-[#063d75]"
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
      <div className="mt-5">
        {/* Count + Sort + VR toggle + Save search + View toggle */}
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
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${vrOnly ? "bg-[#08519A]" : "bg-[#E5E7EB]"}`}
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

            {/* List / Map toggle */}
            <div className="flex h-9 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-[#08519A] text-white"
                    : "text-[#6B7280] hover:text-gray-900"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 border-l border-[#E5E7EB] px-3 text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-[#08519A] text-white"
                    : "text-[#6B7280] hover:text-gray-900"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Map view */}
        {viewMode === "map" ? (
          <div className="mt-4 flex gap-4">
            {/* Left: scrollable list */}
            <div className="hidden w-[380px] shrink-0 space-y-3 overflow-y-auto lg:block" style={{ maxHeight: "calc(100vh - 220px)" }}>
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
                filtered.map((property) => (
                  <div key={property.id} className="w-full">
                    <PropertyCard property={property} />
                  </div>
                ))
              )}
            </div>

            {/* Right: map */}
            <div className="flex-1" style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}>
              <PropertyMap
                properties={filtered}
                onPinClick={(id) => router.push("/property/" + id)}
              />
            </div>

            {/* Mobile: full-width map */}
            <div className="w-full lg:hidden" style={{ height: "60vh", minHeight: "350px" }}>
              <PropertyMap
                properties={filtered}
                onPinClick={(id) => router.push("/property/" + id)}
              />
            </div>
          </div>
        ) : (
          /* List view */
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
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
        )}
      </div>
    </div>
  );
}
