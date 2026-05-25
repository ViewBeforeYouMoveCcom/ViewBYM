import { notFound } from "next/navigation";

import { getPropertyById } from "@/data/properties";
import EnquiryForm from "@/components/EnquiryForm";
import SavePropertyButton from "@/components/SavePropertyButton";
import VRTourPanel from "@/components/VRTourPanel";
import VRPlayerOverlay from "@/components/VRPlayerOverlay";
import PhotoGallery from "@/components/PhotoGallery";
import PropertyHero from "@/components/PropertyHero";
import TrackListingView from "@/components/TrackListingView";

const STATUS_STYLES: Record<string, string> = {
  "New":          "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Under offer":  "bg-amber-50  text-amber-700  border-amber-200",
  "Sold STC":     "bg-red-50    text-red-700    border-red-200",
  "Let agreed":   "bg-amber-50  text-amber-700  border-amber-200",
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const gallery = property.images?.length ? property.images : [property.image];
  const isDbProperty = property.isDbProperty === true;
  const statusStyle = STATUS_STYLES[property.status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const mapQuery = encodeURIComponent([property.address, property.city].filter(Boolean).join(", "));

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TrackListingView id={property.id} />

      {/* ── Hero gallery ─────────────────────────────────────────── */}
      <PropertyHero
        gallery={gallery}
        title={property.title}
        address={property.address}
        city={property.city}
        status={property.status}
        statusStyle={statusStyle}
        vrEnabled={property.vrEnabled}
        videoUrl={property.videoUrl}
        floorplanUrl={property.floorplanUrl}
        listingType={property.listingType}
        property={{ id: property.id, title: property.title, location: property.location, price: property.price, beds: property.beds, type: property.type }}
      />

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT column ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Price + stats card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[28px] font-extrabold tracking-tight text-gray-900 leading-none">
                    {property.price}
                    {property.listingType === "rent" && (
                      <span className="ml-1.5 text-[16px] font-normal text-gray-400">pcm</span>
                    )}
                  </div>
                  {property.priceQualifier && (
                    <p className="mt-1 text-[13px] text-gray-600">{property.priceQualifier}</p>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-3">
                  {property.beds > 0 && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round"><path d="M2 9V19M22 9V19M2 14h20M2 9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5"/></svg>
                      <span className="text-[13px] font-semibold text-gray-700">{property.beds} <span className="font-normal text-gray-600">beds</span></span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round"><path d="M9 6 C9 4.3 10.3 3 12 3s3 1.3 3 3v3H2v2a10 10 0 0 0 20 0V9H18V6"/></svg>
                      <span className="text-[13px] font-semibold text-gray-700">{property.baths} <span className="font-normal text-gray-600">baths</span></span>
                    </div>
                  )}
                  {property.areaSqFt > 0 && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                      <span className="text-[13px] font-semibold text-gray-700">{property.areaSqFt.toLocaleString()} <span className="font-normal text-gray-600">sq ft</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <span className="text-[13px] text-gray-700">{property.type}</span>
                  </div>
                  {property.tenure && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                      <span className="text-[13px] text-gray-700">{property.tenure}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VR tour */}
            {property.vrEnabled && (
              <div id="vr-tour-section">
                <VRTourPanel propertyId={property.id} vrEnabled={property.vrEnabled} />
              </div>
            )}

            {/* Walkthrough video */}
            {property.videoUrl && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="mb-4 text-[15px] font-bold text-gray-900">Walkthrough video</h2>
                <video
                  src={property.videoUrl}
                  controls
                  preload="metadata"
                  className="aspect-video w-full rounded-xl bg-black"
                />
              </div>
            )}

            {/* Photos gallery */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="mb-4 text-[15px] font-bold text-gray-900">Gallery</h2>

              {/* Gallery view buttons */}
              <div className="mb-4 flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 rounded-lg bg-[#08519A] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#063d75]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                  All images ({gallery.length})
                </button>

                {property.floorplanUrl && (
                  <a
                    href={property.floorplanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-[#F9FAFB]"
                  >
                    Floor plan
                  </a>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-[#F9FAFB]"
                >
                  Map
                </a>

                <a
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-[#F9FAFB]"
                >
                  Street View
                </a>

                {property.vrEnabled && (
                  <a
                    href="#vr-tour-section"
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-[13px] font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Immersive VR Tour
                  </a>
                )}
              </div>

              <PhotoGallery images={gallery} labels={property.imageLabels} title={property.title} />
            </div>

            {/* Description */}
            {property.description && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="mb-3 text-[15px] font-bold text-gray-900">About this property</h2>
                <p className="text-[14px] leading-relaxed text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Key features */}
            {property.features.length > 0 && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="mb-4 text-[15px] font-bold text-gray-900">Key features</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-[13.5px] text-gray-700">
                      <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enquiry form */}
            {isDbProperty && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="mb-1 text-[15px] font-bold text-gray-900">Send a message</h2>
                <p className="mb-4 text-[13px] text-gray-600">Your message goes directly to {property.agent.name}.</p>
                <EnquiryForm
                  propertyId={id}
                  agencyId={property.agencyId ?? ""}
                  agentEmail={property.agent.email}
                  propertyTitle={property.title}
                />
              </div>
            )}

            <p className="text-[12px] text-gray-500 pb-2">
              Listings are for guidance only. Verify all details with the agent before arranging a viewing.
            </p>
          </div>

          {/* ── RIGHT rail (desktop sticky) ───────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">

              {/* CTA card */}
              {property.vrEnabled && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <VRPlayerOverlay propertyId={property.id} />
                </div>
              )}

              {/* Agent card */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[15px] font-bold text-[#08519A]">
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-900">{property.agent.name}</p>
                    <p className="text-[12px] text-gray-600">{property.agent.branch}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {property.agent.phone && (
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#08519A] text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d76]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Call agent
                    </a>
                  )}
                  {property.agent.email && (
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-semibold text-gray-700 transition-colors hover:bg-[#F9FAFB]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Email agent
                    </a>
                  )}
                </div>

                {isDbProperty && (
                  <p className="text-[12px] text-gray-600 text-center">Or use the enquiry form below</p>
                )}
              </div>

              {/* VR tip */}
              {property.vrEnabled && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[13px] font-semibold text-blue-800">VR tip</p>
                  <p className="mt-1 text-[12.5px] text-blue-700">
                    Take the VR tour to confirm layout and feel before booking a viewing.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-[#E5E7EB] bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          {property.agent.phone && (
            <a href={`tel:${property.agent.phone}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#08519A] py-3 text-[13px] font-semibold text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call
            </a>
          )}
          {property.agent.email && (
            <a href={`mailto:${property.agent.email}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#E5E7EB] py-3 text-[13px] font-semibold text-gray-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </a>
          )}
          {property.vrEnabled && (
            <div className="flex-1">
              <VRPlayerOverlay propertyId={property.id} />
            </div>
          )}
          <SavePropertyButton
            property={{ id: property.id, title: property.title, location: property.location, price: property.price, beds: property.beds, type: property.type }}
            className="h-11 w-11 rounded-[10px] border border-[#E5E7EB] bg-white"
            size={18}
          />
        </div>
      </div>

    </div>
  );
}
