import { getPropertiesFiltered } from "@/data/properties";
import BrowseClient from "@/components/BrowseClient";
import { Badge } from "@/components/ui/badge";

interface SearchParams {
  location?: string;
  beds?: string;
  type?: string;
  listing_type?: string;
  vr?: string;
  sort?: string;
  price_min?: string;
  price_max?: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const location = params.location?.trim() ?? "";
  const beds = params.beds ? parseInt(params.beds, 10) : 0;
  const propertyType = params.type ?? "";
  const listingType = params.listing_type ?? "";
  const vrOnly = params.vr === "1";
  const sort = (params.sort as "price_asc" | "price_desc" | "recommended") ?? "recommended";
  const priceMin = params.price_min ? parseInt(params.price_min, 10) : undefined;
  const priceMax = params.price_max ? parseInt(params.price_max, 10) : undefined;

  const properties = await getPropertiesFiltered({
    location: location || undefined,
    beds: beds > 0 ? beds : undefined,
    propertyType: propertyType || undefined,
    listingType: listingType || undefined,
    vrOnly: vrOnly || undefined,
    sort,
    priceMin,
    priceMax,
  });

  // Has the user performed a search (any param set)?
  const hasSearchParams = !!(
    params.location ||
    params.beds ||
    params.type ||
    params.listing_type ||
    params.vr ||
    params.price_min ||
    params.price_max
  );

  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="space-y-3">
            <Badge variant="teal">Browse Immersive VR-enabled properties</Badge>
            <h1 className="font-heading text-2xl font-semibold text-[#0F172A] md:text-3xl">
              Browse properties
            </h1>
            <p className="text-sm text-[#6B7280]">
              Refine your search, save your shortlist, and tour in Immersive VR when ready.
            </p>
          </div>

          <BrowseClient
            initialProperties={properties}
            initialHasSearched={hasSearchParams}
            initialFilters={{
              location,
              beds: beds > 0 ? String(beds) : "Any beds",
              type: propertyType || "Any type",
              vrOnly,
              sort,
            }}
          />
        </div>
      </section>
    </div>
  );
}
