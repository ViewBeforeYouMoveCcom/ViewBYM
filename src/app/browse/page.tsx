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
        <div className="mx-auto w-full max-w-[1200px] px-5 py-12">
          <div className="space-y-3">
            <Badge variant="blue">Browse Immersive VR-enabled properties</Badge>
             <h1 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-[#08519A]">
                Browse properties
              </h1>
            <p className="mt-1 text-[14px] text-gray-500">
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
