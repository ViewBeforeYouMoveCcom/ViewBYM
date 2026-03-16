import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Property } from "@/data/properties";

const statusVariant: Record<string, "success" | "warning" | "error" | "default"> = {
  New: "success",
  "Under offer": "warning",
  "Sold STC": "error",
  "Let agreed": "warning",
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
      <Card className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-[#F9FAFB]">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
            {thumbs.length}/{Math.max(thumbs.length, 1)}
          </div>
          {/* Save */}
          <button
            type="button"
            aria-label="Save property"
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/90 p-2 text-gray-700 backdrop-blur-sm hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 21s-7-4.35-9.33-8.22C.7 9.46 2.25 6.5 5.6 6.5c1.78 0 3.02.92 3.8 1.88.78-.96 2.02-1.88 3.8-1.88 3.35 0 4.9 2.96 2.93 6.28C19 16.65 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Badges */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {property.vrEnabled ? <Badge variant="blue">VR</Badge> : null}
            <Badge variant={statusVariant[property.status] ?? "default"}>
              {property.status}
            </Badge>
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
            <span>{property.beds} beds</span>
            <span>{property.baths} baths</span>
            <span>{property.areaSqFt} sq ft</span>
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
              className="object-cover"
              unoptimized
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
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="relative p-4 md:p-5">
          {/* Save */}
          <button
            type="button"
            aria-label="Save property"
            className="absolute right-4 top-4 rounded-full border border-[#E5E7EB] bg-white p-2 text-gray-900 hover:bg-[#F9FAFB]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-4.35-9.33-8.22C.7 9.46 2.25 6.5 5.6 6.5c1.78 0 3.02.92 3.8 1.88.78-.96 2.02-1.88 3.8-1.88 3.35 0 4.9 2.96 2.93 6.28C19 16.65 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pr-10">
            {property.vrEnabled ? <Badge variant="blue">Immersive VR Enabled</Badge> : null}
            <Badge variant={statusVariant[property.status] ?? "default"}>
              {property.status}
            </Badge>
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
            <span>{property.beds} beds</span>
            <span>{property.baths} baths</span>
            <span>{property.areaSqFt} sq ft</span>
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