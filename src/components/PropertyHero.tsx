"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SavePropertyButton from "@/components/SavePropertyButton";
import VRPlayerOverlay from "@/components/VRPlayerOverlay";
import { IMAGE_BLUR_PLACEHOLDER, onPropertyImageError } from "@/lib/utils";

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
  videoUrl?: string;
  floorplanUrl?: string;
  listingType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  property: SaveProp;
}

export default function PropertyHero({
  gallery, title, address, city, status, statusStyle, vrEnabled, videoUrl, floorplanUrl, listingType, latitude, longitude, property,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [backHref] = useState(() => {
    if (typeof window === "undefined") return "/browse";
    try {
      return sessionStorage.getItem("vbym_last_search") ?? "/browse";
    } catch {
      return "/browse";
    }
  });
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllPhotosExpanded, setShowAllPhotosExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFloorplan, setShowFloorplan] = useState(false);
  const isFloorplanPdf = /\.pdf(?:$|\?)/i.test(floorplanUrl ?? "");

  return (
    <div className="relative bg-gray-900">
      {/* All Photos overlay */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="text-white font-semibold text-[15px]">{gallery.length} photos · {title}</span>
            <button
              onClick={() => { setShowAllPhotos(false); setShowAllPhotosExpanded(false); }}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 max-w-[1200px] mx-auto w-full">
            {(showAllPhotosExpanded ? gallery : gallery.slice(0, 10)).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                  onError={onPropertyImageError}
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white">
                  {i + 1} / {gallery.length}
                </div>
              </div>
            ))}
            {gallery.length > 10 && !showAllPhotosExpanded && (
              <button
                onClick={() => setShowAllPhotosExpanded(true)}
                className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/5 py-8 text-[14px] font-semibold text-white hover:border-white/30 hover:bg-white/10 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Show all {gallery.length} photos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Tour modal */}
      {showVideoModal && videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowVideoModal(false)}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-white font-semibold text-[15px]">Video Tour · {title}</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                Close
              </button>
            </div>
            <video
              src={videoUrl}
              controls
              autoPlay
              preload="metadata"
              poster={gallery[0]}
              className="w-full rounded-xl bg-black aspect-video"
            />
          </div>
        </div>
      )}

      {/* Floorplan modal */}
      {showFloorplan && floorplanUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowFloorplan(false)}>
          <div className="relative w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-white font-semibold text-[15px]">Floor Plan · {title}</span>
              <button
                onClick={() => setShowFloorplan(false)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                Close
              </button>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl bg-white">
              {isFloorplanPdf ? (
                <iframe src={floorplanUrl} title={`${title} floor plan`} className="h-[80vh] w-full" />
              ) : (
                <Image src={floorplanUrl} alt={`${title} floor plan`} width={900} height={600} className="w-full h-auto object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main image */}
      <div className="relative h-[52vw] max-h-[600px] min-h-[280px] w-full">
        <Image
          src={gallery[current]}
          alt={title}
          fill
          sizes="100vw"
          onError={onPropertyImageError}
          className="object-cover opacity-90 transition-opacity duration-300"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top bar: back + save */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm hover:bg-white/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to results
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
              <button
                onClick={() => {
                  const vrSection = document.getElementById("vr-tour-section");
                  if (vrSection) vrSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-blue-300/40 bg-blue-600/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm hover:bg-blue-600 transition-colors cursor-pointer"
              >
                360° Tour
              </button>
            )}
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle}`}>
              {status}
            </span>
            {listingType === "rent" && (
              <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                To Let
              </span>
            )}
            {listingType === "sale" && (
              <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                For Sale
              </span>
            )}
            {listingType === "commercial" && (
              <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Commercial
              </span>
            )}
          </div>
          <h1 className="text-[clamp(18px,3vw,30px)] font-extrabold leading-tight tracking-tight text-white drop-shadow">
            {title}
          </h1>
          <p className="mt-1 text-[13px] text-white/80">{address}{city ? `, ${city}` : ""}</p>
        </div>
      </div>

      {/* ── Media controls ───────────────────────────────────── */}
      <div className="bg-gray-900 px-4 pt-3 pb-1 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {/* Photos */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-white/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            {gallery.length > 1 ? `Photos (${gallery.length})` : "Photos"}
          </button>

          {/* Floor Plan */}
          {floorplanUrl && (
            <button
              onClick={() => setShowFloorplan(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Floor Plan
            </button>
          )}

          {/* Video Tour (normal MP4) */}
          {videoUrl && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Video Tour
            </button>
          )}

          {/* 360° Tour (drag/swipe on a normal device) */}
          {vrEnabled && (
            <button
              onClick={() => {
                const vrSection = document.getElementById("vr-tour-section");
                if (vrSection) vrSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 rounded-lg border border-blue-400/40 bg-blue-600/70 px-3 py-2 text-[12.5px] font-bold text-white hover:bg-blue-600/90 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              360° Tour
            </button>
          )}

          {/* View in VR (compatible headset) */}
          {vrEnabled && (
            <VRPlayerOverlay
              propertyId={property.id}
              triggerClassName="flex items-center gap-1.5 rounded-lg border border-blue-400/40 bg-blue-600/70 px-3 py-2 text-[12.5px] font-bold text-white hover:bg-blue-600/90 transition-colors cursor-pointer"
              triggerLabel={
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="10" rx="3"/><circle cx="8.5" cy="12" r="2.5" strokeWidth="1.5"/><circle cx="15.5" cy="12" r="2.5" strokeWidth="1.5"/></svg>
                  View in VR
                </span>
              }
            />
          )}

          {/* Map — always shown; falls back to an address text search when no coordinates are saved */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + (city ? ', ' + city : ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12.5px] font-semibold text-white no-underline transition-colors visited:text-white hover:bg-white/20 hover:text-white focus:text-white active:text-white cursor-pointer"
            style={{ color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Map
          </a>

          {/* Street View — always shown; falls back to an address text search when no coordinates are saved */}
          <a
            href={latitude && longitude
              ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + (city ? ', ' + city : ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12.5px] font-semibold text-white no-underline transition-colors visited:text-white hover:bg-white/20 hover:text-white focus:text-white active:text-white cursor-pointer"
            style={{ color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
            Street View
          </a>
        </div>
      </div>

      {/* Thumbnail strip */}
      {gallery.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto bg-gray-900 px-4 pb-3 pt-2 sm:px-6">
          {gallery.slice(0, 10).map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === current
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt={`Photo ${i + 1}`} fill sizes="96px" loading="lazy" onError={onPropertyImageError} className="object-cover" />
            </button>
          ))}
          {gallery.length > 10 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 text-[12px] font-semibold text-white hover:border-white/30 hover:bg-white/10 transition-colors"
            >
              +{gallery.length - 10} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
