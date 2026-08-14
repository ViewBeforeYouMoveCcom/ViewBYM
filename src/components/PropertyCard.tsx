import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SavePropertyButton from "@/components/SavePropertyButton";
import type { Property } from "@/data/properties";
import { IMAGE_BLUR_PLACEHOLDER } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "error" | "default"> = {
  New: "success",
  "Under offer": "warning",
  "Sold STC": "error",
  "Let agreed": "warning",
};

const listingTypeLabel: Record<string, string> = {
  sale: "For Sale",
  rent: "To Let",
  commercial: "Commercial",
};

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const thumbs = property.images?.length ? property.images : [property.image];
  const chipTags = property.tags?.length ? property.tags : [];

  /* ── Compact / vertical card (used on homepage grid) ── */
  if (compact) {
    return (
      <Card className="group rounded-xl border border-[#E5E7EB] bg-white transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative">
          <div className="relative h-52 w-full overflow-hidden rounded-t-xl bg-[#F9FAFB]">
            <Image
              src={property.image}
              alt={property.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_PLACEHOLDER}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {thumbs.length}/{Math.max(thumbs.length, 1)}
            </div>
          </div>
          {/* Save — outside overflow-hidden so it's never clipped */}
          <SavePropertyButton
            property={{ id: property.id, title: property.title, location: property.location, price: property.price, beds: property.beds, type: property.type }}
            size={16}
            wrapperClassName="absolute right-3 top-3 z-10"
            className="border border-white/20 bg-white/90 p-2 backdrop-blur-sm hover:bg-white"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Badges */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {property.vrEnabled ? <Badge variant="blue">VR</Badge> : null}
            <Badge variant={statusVariant[property.status] ?? "default"}>
              {property.status}
            </Badge>
            {property.listingType ? (
              <Badge variant="outline">{listingTypeLabel[property.listingType]}</Badge>
            ) : null}
            {property.featured ? <Badge variant="amber">Featured</Badge> : null}
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900">{property.price}</p>
          {property.priceQualifier ? (
            <p className="text-xs text-[#6B7280]">{property.priceQualifier}</p>
          ) : null}

          {/* Title + address */}
          <p className="mt-1.5 text-sm font-semibold text-gray-900 line-clamp-1">{property.title}</p>
          <p className="text-xs text-[#6B7280] line-clamp-1">
            {property.address}, {property.location}
          </p>

          {/* Facts */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B7280]">
            {property.beds > 0 && <span>{property.beds} beds</span>}
            {property.baths > 0 && <span>{property.baths} baths</span>}
            {property.areaSqFt > 0 && <span>{property.areaSqFt} sq ft</span>}
            <span>{property.type}</span>
          </div>

          {/* Agent + CTA */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-xs text-[#6B7280] truncate">
              <span className="font-medium text-gray-900">{property.agent.name}</span>
            </p>
            <Button
              asChild
              className="h-8 rounded-lg bg-[#08519A] px-3 text-xs font-semibold !text-white hover:bg-[#063d75]"
            >
              <Link href={`/property/${property.id}`}>View details</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  /* ── Full / horizontal card (used on browse / listing pages) ── */
  return (
    <Card className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="grid md:grid-cols-[340px_1fr]">
        {/* Media */}
        <div className="border-b border-[#E5E7EB] md:border-b-0 md:border-r">
          <div className="relative h-56 w-full bg-[#F9FAFB] md:h-full md:min-h-[240px]">
            <Image
              src={property.image}
              alt={property.title}
              fill
              sizes="(min-width: 768px) 340px, 100vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_PLACEHOLDER}
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {thumbs.length}/{Math.max(thumbs.length, 1)}
            </div>
          </div>

          {thumbs.length > 1 ? (
            <div className="grid grid-cols-4 gap-1 bg-white p-2">
              {thumbs.slice(0, 4).map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-12 w-full overflow-hidden rounded-md bg-[#F9FAFB]"
                >
                  <Image
                    src={src}
                    alt={`${property.title} ${idx + 1}`}
                    fill
                    sizes="25vw"
                    loading="lazy"
                          className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="relative p-4 md:p-5">
          {/* Save */}
          <SavePropertyButton
            property={{ id: property.id, title: property.title, location: property.location, price: property.price, beds: property.beds, type: property.type }}
            size={18}
            wrapperClassName="absolute right-4 top-4"
            className="border border-gray-200 bg-white p-2 hover:bg-gray-50"
          />

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pr-10">
            {property.vrEnabled ? <Badge variant="blue">Immersive VR Enabled</Badge> : null}
            <Badge variant={statusVariant[property.status] ?? "default"}>
              {property.status}
            </Badge>
            {property.listingType ? (
              <Badge variant="outline">{listingTypeLabel[property.listingType]}</Badge>
            ) : null}
            {property.featured ? <Badge variant="amber">Featured</Badge> : null}
          </div>

          {/* Price + qualifier */}
          <div className="mt-3 space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-xl font-semibold text-gray-900 md:text-2xl">
                {property.price}
              </p>
              {property.priceQualifier ? (
                <p className="text-sm text-[#6B7280]">{property.priceQualifier}</p>
              ) : null}
            </div>

            <p className="text-sm font-medium text-gray-900">{property.title}</p>
            <p className="text-sm text-[#6B7280]">
              {property.address}, {property.location}
            </p>

            <p className="mt-2 line-clamp-2 text-sm text-[#6B7280]">
              {property.snippet ?? property.description}
            </p>
          </div>

          {/* Facts */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#6B7280]">
            {property.beds > 0 && <span>{property.beds} beds</span>}
            {property.baths > 0 && <span>{property.baths} baths</span>}
            {property.areaSqFt > 0 && <span>{property.areaSqFt} sq ft</span>}
            <span>{property.type}</span>
            {property.tenure ? <span>{property.tenure}</span> : null}
          </div>

          {/* Portal-style chips */}
          {chipTags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chipTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-gray-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Agent + Actions */}
<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Agent info */}
  <div className="text-sm text-[#6B7280]">
    <span className="font-medium text-gray-900">{property.agent.name}</span>
    <span className="text-[#6B7280]"> · {property.agent.branch}</span>
  </div>

  {/* Buttons */}
  <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-3 sm:w-auto">
    <a
      href={`tel:${property.agent.phone}`}
      className="flex items-center justify-center h-10 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50 rounded-lg sm:flex-1"
    >
      Call
    </a>

    <a
      href={`mailto:${property.agent.email}`}
      className="flex items-center justify-center h-10 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50 rounded-lg sm:flex-1"
    >
      Email
    </a>

    <Button
      asChild
      className="flex items-center justify-center h-10 rounded-[10px] bg-[#08519A] px-4 text-sm font-semibold !text-white hover:bg-[#063d75] sm:flex-1"
    >
      <Link href={`/property/${property.id}`}>View details</Link>
    </Button>
    
    
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}