"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SavePropertyButton from "@/components/SavePropertyButton";

interface SaveProp {
  id: string; title: string; location: string; price: string; beds: number; type: string;
}

interface Props {
  gallery: string[];
  title: string;
  address: string;
  city?: string | null;
  status: string;
  statusStyle: string;
  vrEnabled: boolean;
  listingType?: string | null;
  property: SaveProp;
}

export default function PropertyHero({
  gallery, title, address, city, status, statusStyle, vrEnabled, listingType, property,
}: Props) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative bg-gray-900">
      {/* Main image */}
      <div className="relative h-[52vw] max-h-[560px] min-h-[280px] w-full">
        <Image
          src={gallery[current]}
          alt={title}
          fill
          className="object-cover opacity-90 transition-opacity duration-300"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top bar: back + save */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm hover:bg-white/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Properties
          </Link>

          <SavePropertyButton
            property={property}
            wrapperClassName="flex"
            className="h-10 w-10 border border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            size={18}
          />
        </div>

        {/* Bottom overlay: badges + title */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {vrEnabled && (
              <span className="rounded-full border border-blue-300/40 bg-blue-600/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                VR Tour
              </span>
            )}
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle}`}>
              {status}
            </span>
            {listingType === "rent" && (
              <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                To Let
              </span>
            )}
          </div>
          <h1 className="text-[clamp(18px,3vw,30px)] font-extrabold leading-tight tracking-tight text-white drop-shadow">
            {title}
          </h1>
          <p className="mt-1 text-[13px] text-white/80">{address}{city ? `, ${city}` : ""}</p>
        </div>

        {/* Photo count badge */}
        {gallery.length > 1 && (
          <div className="absolute bottom-5 right-4 sm:right-6 flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            {current + 1} / {gallery.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {gallery.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto bg-gray-900 px-4 pb-3 pt-1.5 sm:px-6">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === current
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
