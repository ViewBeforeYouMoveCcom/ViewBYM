import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPropertyById } from "@/data/properties";
import EnquiryForm from "@/components/EnquiryForm";
import SavePropertyButton from "@/components/SavePropertyButton";
import VRTourPanel from "@/components/VRTourPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VRPlayerOverlay from "@/components/VRPlayerOverlay";

const statusVariant: Record<string, "success" | "warning" | "error" | "default"> = {
  New: "success",
  "Under offer": "warning",
  "Sold STC": "error",
  "Let agreed": "warning",
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

  // Show enquiry form for DB-backed properties (UUID id) only
  const isDbProperty = property.isDbProperty === true;

  return (
    <div className="bg-white pb-24 lg:pb-0">
      {/* Top header bar */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          {/* Breadcrumbs */}
          <div className="mb-3 text-sm text-[#6B7280]">
            <Link href="/browse" className="hover:underline">
              Properties
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.location}</span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {property.vrEnabled ? (
                <Badge variant="blue">Immersive VR Enabled</Badge>
              ) : (
                <Badge variant="outline">Immersive VR coming soon</Badge>
              )}
              <Badge variant={statusVariant[property.status] ?? "default"}>
                {property.status}
              </Badge>
              {property.listingType === "rent" && (
                <Badge variant="default">To Let</Badge>
              )}
            </div>

            <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">
              {property.title}
            </h1>

            <p className="text-sm text-gray-500">
              {property.address}, {property.location}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#6B7280]">
              <span className="text-xl font-semibold text-gray-900">
                {property.price}
                {property.listingType === "rent" && (
                  <span className="ml-1 text-sm font-normal text-[#6B7280]">pcm</span>
                )}
              </span>
              {property.priceQualifier && (
                <span className="text-sm text-[#6B7280]">{property.priceQualifier}</span>
              )}
              {property.beds > 0 && <span>{property.beds} beds</span>}
              {property.baths > 0 && <span>{property.baths} baths</span>}
              {property.areaSqFt > 0 && <span>{property.areaSqFt} sq ft</span>}
              <span>{property.type}</span>
              {property.tenure ? <span>{property.tenure}</span> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-column layout */}
      <section className="mx-auto w-full max-w-[1200px] px-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT: content */}
          <div className="space-y-6">
            {/* Image gallery */}
            <Card className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              <div className="relative h-[320px] w-full bg-[#F9FAFB] md:h-[420px]">
                <Image
                  src={gallery[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  {gallery.length}/{Math.max(gallery.length, 1)}
                </div>
                <div className="absolute right-3 top-3">
                  <SavePropertyButton
                    property={{
                      id: property.id,
                      title: property.title,
                      location: property.location,
                      price: property.price,
                      beds: property.beds,
                      type: property.type,
                    }}
                    className="rounded-full border border-[#E5E7EB] bg-white px-2 py-2 text-gray-900 hover:bg-[#F9FAFB] h-auto"
                  />
                </div>
              </div>

              {gallery.length > 1 ? (
                <div className="grid grid-cols-6 gap-1 border-t border-[#E5E7EB] bg-white p-2">
                  {gallery.slice(0, 6).map((src, idx) => (
                    <div
                      key={idx}
                      className="relative h-14 overflow-hidden rounded-md bg-[#F9FAFB]"
                    >
                      <Image
                        src={src}
                        alt={`${property.title} thumb ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            {/* Contact bar */}
            <Card className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {property.agent.name}
                    </p>
                    <p className="text-xs text-[#6B7280]">{property.agent.branch}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {property.agent.phone && (
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex h-10 items-center gap-2 rounded-[10px] border border-gray-900 px-5 text-sm font-semibold text-gray-900 hover:bg-[#F9FAFB]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Call
                      </a>
                    )}

                    {property.agent.email && (
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex h-10 items-center gap-2 rounded-[10px] border border-gray-900 px-5 text-sm font-semibold text-gray-900 hover:bg-[#F9FAFB]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Email
                      </a>
                    )}

                    {property.vrEnabled && (
                      <VRPlayerOverlay
                        embedUrl={property.vrTourUrl ?? undefined}
                        iframeHtml={property.vrIframeHtml ?? undefined}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: VR / Photos / Floorplan */}
            <Tabs defaultValue={property.vrEnabled ? "vr" : "photos"} className="rounded-xl">
              <div className="flex items-center justify-between">
                <TabsList className="bg-white">
                  <TabsTrigger value="vr">Immersive VR Tour</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="floorplan">Floorplan</TabsTrigger>
                </TabsList>

                <div className="hidden items-center gap-2 md:flex">
                  <Button variant="secondary" className="h-9 rounded-[10px]">
                    Share
                  </Button>
                  <Button variant="secondary" className="h-9 rounded-[10px]">
                    Print
                  </Button>
                </div>
              </div>

              <TabsContent value="vr" className="mt-4">
                {/* VRTourPanel is a structured component — future VR pipeline hooks in here */}
                <VRTourPanel
                  vrEnabled={property.vrEnabled}
                  embedUrl={property.vrTourUrl ?? undefined}
                  iframeHtml={property.vrIframeHtml ?? undefined}
                />
              </TabsContent>

              <TabsContent value="photos" className="mt-4">
                <Card className="rounded-xl border border-[#E5E7EB]">
                  <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                    {gallery.slice(0, 8).map((src, index) => (
                      <div
                        key={index}
                        className="relative h-48 overflow-hidden rounded-xl bg-[#F9FAFB]"
                      >
                        <Image
                          src={src}
                          alt={`${property.title} photo ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="floorplan" className="mt-4">
                <Card className="rounded-xl border border-[#E5E7EB]">
                  <CardContent className="p-5">
                    <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center">
                      <p className="text-sm text-[#6B7280]">
                        No floorplan uploaded yet. Agents can upload a floorplan PDF from their
                        listing management page.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Description + features */}
            <Card className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="space-y-6 p-5">
                {property.description && (
                  <div>
                    <h2 className=" text-lg font-semibold text-gray-900">
                      Description
                    </h2>
                    <p className="mt-2 text-sm text-[#6B7280]">{property.description}</p>
                  </div>
                )}

                {property.features.length > 0 && (
                  <div>
                    <h3 className=" text-base font-semibold text-gray-900">
                      Key features
                    </h3>
                    <ul className="mt-3 grid gap-2 text-sm text-gray-500 md:grid-cols-2">
                      {property.features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enquiry form — shown for all DB-backed properties */}
            {isDbProperty && (
              <Card className="rounded-xl border border-[#E5E7EB]">
                <CardContent className="p-5">
                  <h2 className="mb-1 font-heading text-lg font-semibold text-gray-900">
                    Send a message
                  </h2>
                  <p className="mb-4 text-sm text-[#6B7280]">
                    Your message goes directly to {property.agent.name}.
                  </p>
                  <EnquiryForm
                    propertyId={id}
                    agencyId={property.agencyId ?? ""}
                    agentEmail={property.agent.email}
                  />
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs text-[#6B7280]">
              Listings are for guidance only. Please verify all details with the agent before
              arranging a viewing.
            </div>
          </div>

          {/* RIGHT: sticky rail (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="rounded-xl border border-[#E5E7EB]">
                <CardContent className="space-y-3 p-5">
                  {property.vrEnabled && (
                    <VRPlayerOverlay
                      embedUrl={property.vrTourUrl ?? undefined}
                      iframeHtml={property.vrIframeHtml ?? undefined}
                    />
                  )}

                  <SavePropertyButton
                    property={{
                      id: property.id,
                      title: property.title,
                      location: property.location,
                      price: property.price,
                      beds: property.beds,
                      type: property.type,
                    }}
                    className="h-11 w-full rounded-[10px]"
                  />
                </CardContent>
              </Card>

              {/* Agent contact card */}
              <Card className="rounded-xl border border-[#E5E7EB]">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{property.agent.name}</p>
                    <p className="text-xs text-[#6B7280]">{property.agent.branch}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    {property.agent.phone && (
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-gray-900 font-semibold text-gray-900 hover:bg-[#F9FAFB]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Call agent
                      </a>
                    )}
                    {property.agent.email && (
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-gray-900 font-semibold text-gray-900 hover:bg-[#F9FAFB]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Email agent
                      </a>
                    )}
                  </div>

                  {isDbProperty ? (
                    <p className="text-xs text-[#6B7280]">
                      Or use the message form below to enquire through VBYM.
                    </p>
                  ) : (
                    <p className="text-xs text-[#6B7280]">
                      You&apos;ll contact the agent directly. View Before You Move is not an estate
                      agency.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <p className="text-sm font-semibold text-gray-900">Tip</p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Use the Immersive VR tour to confirm layout and flow before booking an in-person
                  viewing.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Sticky bottom bar (mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2">
          {property.agent.phone && (
            <a
              href={`tel:${property.agent.phone}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-gray-900 py-3 text-sm font-semibold text-gray-900 hover:bg-[#F9FAFB]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Call
            </a>
          )}

          {property.agent.email && (
            <a
              href={`mailto:${property.agent.email}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-gray-900 py-3 text-sm font-semibold text-gray-900 hover:bg-[#F9FAFB]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Email
            </a>
          )}

          {property.vrEnabled && (
            <div className="flex-1">
              <VRPlayerOverlay
                embedUrl={property.vrTourUrl ?? undefined}
                iframeHtml={property.vrIframeHtml ?? undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
