import { createSupabaseServerClient } from "@/lib/supabase-server";

export type PropertyStatus = "New" | "Under offer" | "Sold STC" | "Let agreed";

export type Property = {
  id: string;
  agencyId?: string;
  title: string;
  address: string;
  location: string;
  price: string;
  priceQualifier?: string;
  beds: number;
  baths: number;
  areaSqFt: number;
  type: string;
  status: PropertyStatus;

  vrEnabled: boolean;
  featured?: boolean;

  image: string;
  images?: string[];
  imageLabels?: string[];
  videoUrl?: string;
  floorplanUrl?: string;
  snippet?: string;
  tags?: string[];

  tenure?: string;
  isReduced?: boolean;
  listingType?: "sale" | "rent";

  description: string;
  features: string[];

  city?: string | null;
  latitude?: number;
  longitude?: number;

  isDbProperty?: boolean;

  agent: {
    name: string;
    branch: string;
    phone: string;
    email: string;
    logoUrl?: string;
  };
};

// ── DB row → Property mapper ─────────────────────────────────────────────
type DbProperty = {
  id: string;
  agency_id: string;
  title: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  price: number | null;
  price_qualifier: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  property_type: string | null;
  tenure: string | null;
  listing_type: string | null;
  features: string[] | null;
  featured: boolean | null;
  description: string | null;
  market_status: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  agencies: {
    name: string;
    website: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  property_media: Array<{ public_url: string; sort_order: number; type: string }> | null;
  property_vr: Array<{ is_enabled: boolean }> | null;
};

function mapDbProperty(row: DbProperty): Property {
  const allMedia = (row.property_media ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const photos = allMedia.filter((m) => m.type === "photo" || m.type == null).map((m) => m.public_url).filter(Boolean);
  const floorplanUrl = allMedia.find((m) => m.type === "floorplan")?.public_url ?? undefined;

  const vrEnabled = !!(row.property_vr ?? []).find((v) => v.is_enabled);

  const typeDisplay = (row.property_type ?? "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const address = [row.address_line1, row.address_line2].filter(Boolean).join(", ") || "";
  const location = row.city ?? address;
  const title = row.title ?? address;

  const priceDisplay = row.price
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(row.price)
    : "Price on request";

  const rawStatus = row.market_status ?? "New";
  const marketStatus: PropertyStatus =
    rawStatus === "available" ? "New" : (rawStatus as PropertyStatus);

  const tags: string[] = [];
  if (marketStatus !== "New") tags.push(marketStatus);
  if (vrEnabled) tags.push("Immersive VR tour available");
  if (row.tenure) tags.push(row.tenure);

  const listingType = row.listing_type === "rent" ? "rent" : "sale";

  return {
    id: row.id,
    agencyId: row.agency_id,
    title,
    address,
    location,
    price: priceDisplay,
    priceQualifier: row.price_qualifier ?? undefined,
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    areaSqFt: row.area_sqft ?? 0,
    type: typeDisplay,
    status: marketStatus,
    vrEnabled,
    featured: row.featured ?? false,
    image: photos[0] ?? "/images/property-placeholder.svg",
    images: photos.length > 0 ? photos : ["/images/property-placeholder.svg"],
    floorplanUrl,
    snippet: row.description ? row.description.slice(0, 160) : undefined,
    tags,
    tenure: row.tenure ?? undefined,
    listingType,
    description: row.description ?? "",
    features: row.features ?? [],
    city: row.city ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    isDbProperty: true,
    agent: {
      name: row.agencies?.name ?? "Agent",
      branch: row.agencies?.name ?? "Agent",
      phone: row.agencies?.phone ?? "",
      email: row.agencies?.email ?? "",
    },
  };
}

const DB_SELECT = `
  id, agency_id, title, address_line1, address_line2, city, postcode,
  price, price_qualifier, bedrooms, bathrooms, area_sqft,
  property_type, tenure, listing_type, features, featured,
  description, market_status, status, latitude, longitude,
  agencies(name, website, phone, email),
  property_media(public_url, sort_order, type),
  property_vr(is_enabled)
`;

// ── Distance calculation (Haversine formula) ─────────────────────────────────
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert miles to km
function milesToKm(miles: number): number {
  return miles * 1.60934;
}

// ── Public API ───────────────────────────────────────────────────────────

/** Fetch all published properties from the database. */
export const getProperties = async (): Promise<Property[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(DB_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[properties] DB fetch failed:", error.message);
      return [];
    }

    return (data as unknown as DbProperty[]).map(mapDbProperty);
  } catch (err) {
    console.error("[properties] Unexpected error:", err);
    return [];
  }
};

/** Fetch a single published property by UUID. */
export const getPropertyById = async (id: string): Promise<Property | null> => {
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(DB_SELECT)
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapDbProperty(data as unknown as DbProperty);
  } catch {
    return null;
  }
};

/** Fetch published properties with optional filters (used by browse page). */
export const getPropertiesFiltered = async (params: {
  location?: string;
  beds?: number;
  propertyType?: string;
  listingType?: string;
  priceMin?: number;
  priceMax?: number;
  vrOnly?: boolean;
  sort?: "price_asc" | "price_desc" | "recommended";
  radius?: string;
}): Promise<Property[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("properties")
      .select(DB_SELECT)
      .eq("status", "published");

    if (params.location) {
      const loc = params.location.trim();
      query = query.or(
        `city.ilike.%${loc}%,address_line1.ilike.%${loc}%,postcode.ilike.%${loc}%,title.ilike.%${loc}%`
      );
    }

    if (params.beds && params.beds > 0) {
      query = query.gte("bedrooms", params.beds);
    }

    if (params.propertyType && params.propertyType !== "any") {
      query = query.eq("property_type", params.propertyType);
    }

    if (params.listingType && params.listingType !== "all") {
      query = query.eq("listing_type", params.listingType);
    }

    if (params.priceMin) {
      query = query.gte("price", params.priceMin);
    }

    if (params.priceMax) {
      query = query.lte("price", params.priceMax);
    }

    if (params.sort === "price_asc") {
      query = query.order("price", { ascending: true, nullsFirst: false });
    } else if (params.sort === "price_desc") {
      query = query.order("price", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("[properties] Filtered fetch failed:", error.message);
      return [];
    }

    let results = (data as unknown as DbProperty[]).map(mapDbProperty);

    if (params.vrOnly) {
      results = results.filter((p) => p.vrEnabled);
    }

    // Client-side radius filtering using Haversine distance
    if (params.radius && params.location) {
      const radiusKm = milesToKm(parseInt(params.radius, 10));
      results = results.filter((p) => {
        if (!p.latitude || !p.longitude) return true; // Include if no coords
        // Find a property with known coords in the location to calculate from
        const refProp = results.find((x) => x.latitude && x.longitude && x.location.toLowerCase() === params.location?.toLowerCase());
        if (!refProp || !refProp.latitude || !refProp.longitude) return true;
        const dist = getDistanceKm(refProp.latitude, refProp.longitude, p.latitude, p.longitude);
        return dist <= radiusKm;
      });
    }

    return results;
  } catch (err) {
    console.error("[properties] Filtered fetch error:", err);
    return [];
  }
};
