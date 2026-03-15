import { createSupabaseServerClient } from "@/lib/supabase-server";

export type PropertyStatus = "New" | "Under offer" | "Sold STC" | "Let agreed";

export type Property = {
  id: string;
  agencyId?: string;  // populated for DB-backed properties; used by EnquiryForm
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
  vrTourUrl?: string | null;
  vrIframeHtml?: string | null; // raw iframe HTML fallback
  featured?: boolean;

  image: string;
  images?: string[];
  snippet?: string;
  tags?: string[];

  tenure?: string;
  isReduced?: boolean;
  listingType?: "sale" | "rent";

  description: string;
  features: string[];

  // true when this property lives in the Supabase DB (UUID id)
  isDbProperty?: boolean;

  agent: {
    name: string;
    branch: string;
    phone: string;
    email: string;
    logoUrl?: string;
  };
};

// ── Fallback mock data ───────────────────────────────────────────────────
// Used when DB is unavailable or during development before data is seeded.
const mockProperties: Property[] = [
  {
    id: "vbym-101",
    title: "Sunlit Riverside Apartment",
    address: "21 Meridian Wharf",
    location: "Canary Wharf, London",
    price: "£625,000",
    priceQualifier: "Offers in region of",
    beds: 2,
    baths: 2,
    areaSqFt: 845,
    type: "Apartment",
    status: "New",
    vrEnabled: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=75&auto=format&fit=crop",
    ],
    snippet:
      "A calm, high-floor apartment with sweeping river views, private balcony, and integrated storage.",
    tags: ["Chain free", "Leasehold", "Featured"],
    tenure: "Leasehold",
    description:
      "A calm, high-floor apartment with sweeping river views, private balcony, and integrated storage.",
    features: [
      "Concierge and residents lounge",
      "South-facing balcony",
      "Energy efficient glazing",
      "Secure parking available",
    ],
    agent: {
      name: "Harper & Lane",
      branch: "Canary Wharf",
      phone: "+44 20 7946 0871",
      email: "canarywharf@harperlane.co.uk",
    },
  },
  {
    id: "vbym-102",
    title: "Restored Period Townhouse",
    address: "14 Grove Park Terrace",
    location: "Bath",
    price: "£1,150,000",
    priceQualifier: "Guide price",
    beds: 4,
    baths: 3,
    areaSqFt: 1980,
    type: "Townhouse",
    status: "Under offer",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=75&auto=format&fit=crop",
    ],
    snippet:
      "Elegant Georgian proportions, updated for modern living with a calm, premium finish throughout.",
    tags: ["Under offer", "Freehold"],
    tenure: "Freehold",
    description:
      "Elegant Georgian proportions, updated for modern living with a calm, premium finish throughout.",
    features: [
      "Original fireplaces",
      "Private rear garden",
      "Open-plan kitchen",
      "Walking distance to Royal Crescent",
    ],
    agent: {
      name: "Langford Estates",
      branch: "Bath Central",
      phone: "+44 1225 412 890",
      email: "bath@langfordestates.co.uk",
    },
  },
  {
    id: "vbym-103",
    title: "Modern Family Detached",
    address: "7 Cedar Rise",
    location: "Wilmslow, Cheshire",
    price: "£845,000",
    priceQualifier: "Offers over",
    beds: 5,
    baths: 3,
    areaSqFt: 2420,
    type: "Detached",
    status: "New",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=75&auto=format&fit=crop",
    ],
    snippet: "A spacious, calm family home with flexible living spaces and a dedicated studio.",
    tags: ["New", "Immersive VR tour available"],
    description: "A spacious, calm family home with flexible living spaces and a dedicated studio.",
    features: ["Home office studio", "Quiet cul-de-sac", "EV-ready driveway", "South-west garden"],
    agent: {
      name: "Northbridge Realty",
      branch: "Wilmslow",
      phone: "+44 1625 554 112",
      email: "wilmslow@northbridge.co.uk",
    },
  },
  {
    id: "vbym-104",
    title: "Compact City Studio",
    address: "302 Albion Yard",
    location: "Manchester",
    price: "£220,000",
    beds: 1,
    baths: 1,
    areaSqFt: 420,
    type: "Studio",
    status: "Let agreed",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop",
    snippet: "Smart studio living with quiet interior outlook and concierge services.",
    tags: ["Let agreed"],
    description: "Smart studio living with quiet interior outlook and concierge services.",
    features: ["24/7 concierge", "Resident gym", "Integrated appliances", "Short walk to transport"],
    agent: {
      name: "Cityline Lettings",
      branch: "Manchester",
      phone: "+44 161 555 9023",
      email: "manchester@citylinelettings.co.uk",
    },
  },
  {
    id: "vbym-105",
    title: "Coastal View Cottage",
    address: "8 Seabank Close",
    location: "St Ives, Cornwall",
    price: "£540,000",
    beds: 3,
    baths: 2,
    areaSqFt: 1105,
    type: "Cottage",
    status: "Sold STC",
    vrEnabled: false,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80&auto=format&fit=crop",
    snippet: "A refined coastal retreat with calm interiors and easy access to the beach.",
    tags: ["Sold STC"],
    description: "A refined coastal retreat with calm interiors and easy access to the beach.",
    features: ["Sea glimpses", "Vaulted ceilings", "Wood-burning stove", "Private patio"],
    agent: {
      name: "Harbour & Co",
      branch: "St Ives",
      phone: "+44 1736 552 890",
      email: "stives@harbourco.co.uk",
    },
  },
  {
    id: "vbym-106",
    title: "Loft-Style Warehouse Conversion",
    address: "55 Millstone Quay",
    location: "Leeds",
    price: "£475,000",
    beds: 2,
    baths: 2,
    areaSqFt: 980,
    type: "Loft",
    status: "New",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop",
    snippet:
      "Industrial character with warm finishes, large windows, and a calm, open plan layout.",
    tags: ["New", "Immersive VR tour available"],
    description:
      "Industrial character with warm finishes, large windows, and a calm, open plan layout.",
    features: [
      "Exposed brick",
      "Private mezzanine",
      "Secure bike storage",
      "Floor-to-ceiling glazing",
    ],
    agent: {
      name: "Quayside Partners",
      branch: "Leeds Dock",
      phone: "+44 113 555 2010",
      email: "leeds@quayside.co.uk",
    },
  },
  {
    id: "vbym-107",
    title: "Garden Apartment",
    address: "2 Rosemount Villas",
    location: "Edinburgh",
    price: "£390,000",
    beds: 2,
    baths: 1,
    areaSqFt: 760,
    type: "Apartment",
    status: "Under offer",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
    snippet: "Quiet garden-level apartment with a light, neutral interior and private terrace.",
    tags: ["Under offer", "Leasehold"],
    tenure: "Leasehold",
    description:
      "Quiet garden-level apartment with a light, neutral interior and private terrace.",
    features: [
      "Private terrace",
      "Gas central heating",
      "Storage cellar",
      "Resident parking zone",
    ],
    agent: {
      name: "Union Street Homes",
      branch: "Edinburgh West",
      phone: "+44 131 555 9988",
      email: "edinburgh@unionstreethomes.co.uk",
    },
  },
  {
    id: "vbym-108",
    title: "Contemporary New Build",
    address: "9 Maple Court",
    location: "Cambridge",
    price: "£720,000",
    beds: 4,
    baths: 3,
    areaSqFt: 1765,
    type: "Semi-detached",
    status: "New",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop",
    snippet: "Modern family living with calm, premium finishes and easy access to green space.",
    tags: ["New home"],
    description:
      "Modern family living with calm, premium finishes and easy access to green space.",
    features: [
      "Air source heat pump",
      "Integrated appliances",
      "Dedicated study",
      "Garden room potential",
    ],
    agent: {
      name: "Fenland Residential",
      branch: "Cambridge North",
      phone: "+44 1223 445 230",
      email: "cambridge@fenlandresidential.co.uk",
    },
  },
  {
    id: "vbym-109",
    title: "Riverside Penthouse",
    address: "Penthouse 12, Lockside Quays",
    location: "Bristol",
    price: "£1,250,000",
    beds: 3,
    baths: 3,
    areaSqFt: 1680,
    type: "Penthouse",
    status: "New",
    vrEnabled: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop",
    snippet:
      "Premium penthouse living with a calm palette, panoramic river views, and private terrace.",
    tags: ["New", "Concierge"],
    description:
      "Premium penthouse living with a calm palette, panoramic river views, and private terrace.",
    features: [
      "Private roof terrace",
      "Concierge service",
      "Dedicated lift access",
      "Cinema-ready lounge",
    ],
    agent: {
      name: "Clifton & Grey",
      branch: "Bristol Harbourside",
      phone: "+44 117 555 7721",
      email: "bristol@cliftongrey.co.uk",
    },
  },
];

// ── DB row → Property mapper ─────────────────────────────────────────────
// Reflects the real deployed schema (VBYM.sql).
// Columns that do NOT exist in the real schema (price_display, price_qualifier,
// area_sqft, listing_type, features, address) are intentionally absent here.
type DbProperty = {
  id: string;
  agency_id: string;
  title: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  property_type: string | null;
  tenure: string | null;
  description: string | null;
  market_status: string | null;
  status: string;
  agencies: {
    name: string;
    website: string | null;
  } | null;
  property_media: Array<{ public_url: string; sort_order: number }> | null;
  // real schema uses is_enabled, not is_active
  property_vr: Array<{ embed_url: string | null; iframe_html: string | null; is_enabled: boolean }> | null;
};

function mapDbProperty(row: DbProperty): Property {
  const photos = (row.property_media ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => m.public_url);

  const vrRecord = (row.property_vr ?? []).find((v) => v.is_enabled);
  const vrEnabled = !!(vrRecord?.embed_url || vrRecord?.iframe_html);

  // Capitalise property_type for display
  const typeDisplay = (row.property_type ?? "")
    .replace(/_/g, "-")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Compose display address from address_line1 + address_line2
  const address = [row.address_line1, row.address_line2].filter(Boolean).join(", ") || "";
  const location = row.city ?? address;
  const title = row.title ?? address;

  // Format numeric price for display (DB stores price as numeric(12,2) in GBP)
  const priceDisplay = row.price
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(row.price)
    : "Price on request";

  // Normalise market_status: DB column default is 'available', UI label is 'New'
  const rawStatus = row.market_status ?? "New";
  const marketStatus: PropertyStatus =
    rawStatus === "available" ? "New" : (rawStatus as PropertyStatus);

  const tags: string[] = [];
  if (marketStatus !== "New") tags.push(marketStatus);
  if (vrEnabled) tags.push("Immersive VR tour available");
  if (row.tenure) tags.push(row.tenure);

  return {
    id: row.id,
    agencyId: row.agency_id,
    title,
    address,
    location,
    price: priceDisplay,
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    areaSqFt: 0,   // not in real schema; kept at 0 so Property type stays compatible
    type: typeDisplay,
    status: marketStatus,
    vrEnabled,
    vrTourUrl: vrRecord?.embed_url ?? null,
    vrIframeHtml: vrRecord?.iframe_html ?? null,
    image: photos[0] ?? "/images/property-placeholder.svg",
    images: photos.length > 0 ? photos : ["/images/property-placeholder.svg"],
    snippet: row.description ? row.description.slice(0, 160) : undefined,
    tags,
    tenure: row.tenure ?? undefined,
    description: row.description ?? "",
    features: [],  // not in real schema; empty for DB-backed properties
    isDbProperty: true,
    agent: {
      name: row.agencies?.name ?? "Agent",
      branch: row.agencies?.name ?? "Agent",
      phone: "",  // agencies table has no phone/email in real schema
      email: "",
    },
  };
}

const DB_SELECT = `
  id, agency_id, title, address_line1, address_line2, city, postcode,
  price, bedrooms, bathrooms,
  property_type, tenure,
  description, market_status, status,
  agencies(name, website),
  property_media(public_url, sort_order),
  property_vr(embed_url, iframe_html, is_enabled)
`;

// ── Public API ───────────────────────────────────────────────────────────

/** Fetch all published properties. Falls back to mock data on error. */
export const getProperties = async (): Promise<Property[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(DB_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("[properties] DB fetch failed, using mock data:", error?.message);
      return mockProperties;
    }

    // If DB is empty, show mock data so the UI isn't blank during onboarding
    if (data.length === 0) return mockProperties;

    return (data as unknown as DbProperty[]).map(mapDbProperty);
  } catch (err) {
    console.warn("[properties] Unexpected error, using mock data:", err);
    return mockProperties;
  }
};

/** Fetch a single published property by UUID (DB) or string id (mock). */
export const getPropertyById = async (id: string): Promise<Property | null> => {
  // UUID pattern — try DB first
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (UUID_RE.test(id)) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("properties")
        .select(DB_SELECT)
        .eq("id", id)
        .single();

      if (!error && data) return mapDbProperty(data as unknown as DbProperty);
    } catch {
      // fall through to mock
    }
  }

  // Non-UUID: look up in mock data
  return mockProperties.find((p) => p.id === id) ?? null;
};

/** Fetch published properties with optional filter params (used by browse page). */
export const getPropertiesFiltered = async (params: {
  location?: string;
  beds?: number;
  propertyType?: string;
  listingType?: string;  // kept in signature for URL compat; not in real schema
  priceMin?: number;
  priceMax?: number;
  vrOnly?: boolean;
  sort?: "price_asc" | "price_desc" | "recommended";
}): Promise<Property[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("properties")
      .select(DB_SELECT)
      .eq("status", "published");

    if (params.location) {
      const loc = params.location.trim();
      // Real schema columns: city, address_line1, postcode, title
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

    // listing_type column does not exist in the real schema — filter silently ignored.

    if (params.priceMin) {
      // price column is numeric(12,2) in GBP (not pence)
      query = query.gte("price", params.priceMin);
    }

    if (params.priceMax) {
      query = query.lte("price", params.priceMax);
    }

    // Sort — use real price column
    if (params.sort === "price_asc") {
      query = query.order("price", { ascending: true, nullsFirst: false });
    } else if (params.sort === "price_desc") {
      query = query.order("price", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn("[properties] Filtered fetch failed, using mock:", error?.message);
      return mockProperties;
    }

    let results = (data as unknown as DbProperty[]).map(mapDbProperty);

    // vrOnly filter is applied post-query (join filtering is complex in Supabase)
    if (params.vrOnly) {
      results = results.filter((p) => p.vrEnabled);
    }

    return results.length > 0 ? results : mockProperties;
  } catch (err) {
    console.warn("[properties] Filtered fetch error:", err);
    return mockProperties;
  }
};
