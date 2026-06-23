import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type PropertyLocationRow = {
  city: string | null;
  postcode: string | null;
  address_line1: string | null;
};

type Suggestion = {
  label: string;
  type: "Town" | "Postcode" | "Area" | "County" | "District" | "Region";
};

type PostcodesIoResponse<T> = {
  status: number;
  result: T[] | null;
};

type PostcodeResult = {
  postcode?: string | null;
  outcode?: string | null;
  admin_district?: string | null;
  admin_county?: string | null;
  region?: string | null;
  country?: string | null;
  parish?: string | null;
};

type PlaceResult = {
  name_1?: string | null;
  name_2?: string | null;
  local_type?: string | null;
  county_unitary?: string | null;
  county?: string | null;
  region?: string | null;
  country?: string | null;
};

type NominatimResult = {
  display_name?: string;
  type?: string;
  class?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
  };
};

function normalise(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function addSuggestion(
  suggestions: Suggestion[],
  seen: Set<string>,
  label: string | null | undefined,
  type: Suggestion["type"],
  query: string,
  requireMatch = true
) {
  if (!label) return;
  const cleaned = normalise(label);
  if (!cleaned) return;
  if (requireMatch && query && !cleaned.toLowerCase().includes(query)) return;

  const key = `${type}:${cleaned.toLowerCase()}`;
  if (seen.has(key)) return;

  seen.add(key);
  suggestions.push({ label: cleaned, type });
}

function sortSuggestions(suggestions: Suggestion[], query: string) {
  return suggestions.sort((a, b) => {
    const aLabel = a.label.toLowerCase();
    const bLabel = b.label.toLowerCase();
    const aStarts = aLabel.startsWith(query) ? 0 : 1;
    const bStarts = bLabel.startsWith(query) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.label.localeCompare(b.label);
  });
}

async function fetchPostcodesIo<T>(path: string): Promise<T[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`https://api.postcodes.io${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) return [];
    const json = (await response.json()) as PostcodesIoResponse<T>;
    return json.result ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchNominatim(query: string): Promise<NominatimResult[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const params = new URLSearchParams({
      q: `${query}, United Kingdom`,
      format: "jsonv2",
      addressdetails: "1",
      countrycodes: "gb",
      limit: "10",
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "ViewBYM property search suggestions",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) return [];
    return (await response.json()) as NominatimResult[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function addUkWideSuggestions(
  suggestions: Suggestion[],
  seen: Set<string>,
  query: string
) {
  if (query.length < 1) return;

  const encodedQuery = encodeURIComponent(query);
  const [postcodes, places] = await Promise.all([
    fetchPostcodesIo<PostcodeResult>(`/postcodes?q=${encodedQuery}&limit=12`),
    fetchPostcodesIo<PlaceResult>(`/places?q=${encodedQuery}&limit=12`),
  ]);

  for (const row of postcodes) {
    addSuggestion(suggestions, seen, row.outcode, "Postcode", query, false);
    addSuggestion(suggestions, seen, row.postcode, "Postcode", query, false);
    addSuggestion(suggestions, seen, row.admin_district, "District", query, false);
    addSuggestion(suggestions, seen, row.admin_county, "County", query, false);
    addSuggestion(suggestions, seen, row.region, "Region", query, false);
    addSuggestion(suggestions, seen, row.parish, "Area", query, false);
  }

  for (const row of places) {
    addSuggestion(suggestions, seen, row.name_1, "Town", query, false);
    addSuggestion(suggestions, seen, row.name_2, "Town", query, false);
    addSuggestion(suggestions, seen, row.county_unitary, "County", query, false);
    addSuggestion(suggestions, seen, row.county, "County", query, false);
    addSuggestion(suggestions, seen, row.region, "Region", query, false);
  }

  const nominatimResults = await fetchNominatim(query);
  for (const row of nominatimResults) {
    const address = row.address ?? {};

    addSuggestion(suggestions, seen, address.postcode, "Postcode", query, false);
    addSuggestion(suggestions, seen, address.city, "Town", query, false);
    addSuggestion(suggestions, seen, address.town, "Town", query, false);
    addSuggestion(suggestions, seen, address.village, "Town", query, false);
    addSuggestion(suggestions, seen, address.hamlet, "Area", query, false);
    addSuggestion(suggestions, seen, address.suburb, "Area", query, false);
    addSuggestion(suggestions, seen, address.county, "County", query, false);
    addSuggestion(suggestions, seen, address.state_district, "District", query, false);
    addSuggestion(suggestions, seen, address.state, "Region", query, false);

    if (row.type === "county" || row.type === "administrative") {
      const primaryName = row.display_name?.split(",")[0];
      addSuggestion(suggestions, seen, primaryName, "County", query, false);
    }
  }
}

export async function GET(request: Request) {
  const query = normalise(new URL(request.url).searchParams.get("q") ?? "")
    .toLowerCase()
    .slice(0, 80);

  try {
    const suggestions: Suggestion[] = [];
    const seen = new Set<string>();

    await addUkWideSuggestions(suggestions, seen, query);

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select("city, postcode, address_line1")
      .eq("status", "published")
      .limit(500);

    if (!error) {
      for (const row of (data ?? []) as PropertyLocationRow[]) {
        addSuggestion(suggestions, seen, row.city, "Town", query);

        const outwardCode = row.postcode?.trim().split(/\s+/)[0];
        addSuggestion(suggestions, seen, outwardCode, "Postcode", query);

        addSuggestion(suggestions, seen, row.postcode, "Postcode", query);
        addSuggestion(suggestions, seen, row.address_line1, "Area", query);
      }
    }

    return NextResponse.json({
      suggestions: sortSuggestions(suggestions, query).slice(0, 10),
    });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
