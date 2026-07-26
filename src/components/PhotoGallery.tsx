"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IMAGE_BLUR_PLACEHOLDER, onPropertyImageError } from "@/lib/utils";

interface Props {
  images: string[];
  /** Room title per image (same index as `images`), e.g. "Kitchen". Groups the grid into sections. */
  labels?: string[];
  /** Optional freeform caption per image (same index as `images`), shown in the lightbox. */
  captions?: string[];
  title: string;
}

const LIMIT = 10;

export default function PhotoGallery({ images, labels, captions, title }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const hasMore = images.length > LIMIT;

  useEffect(() => { setMounted(true); }, []);

  const displayImages = showAll || !hasMore ? images : images.slice(0, LIMIT);

  // Cluster the visible photos into room sections. All photos sharing a
  // room title are grouped under one heading regardless of where they fall
  // in the photo order — the section itself appears where that room's
  // first photo does. An empty/missing title groups together the same way.
  const groups: { room: string; indices: number[] }[] = [];
  const groupIndexByRoom = new Map<string, number>();
  displayImages.forEach((_, i) => {
    const room = labels?.[i]?.trim() ?? "";
    const existingIndex = groupIndexByRoom.get(room);
    if (existingIndex !== undefined) {
      groups[existingIndex].indices.push(i);
    } else {
      groupIndexByRoom.set(room, groups.length);
      groups.push({ room, indices: [i] });
    }
  });

  function openAt(i: number) { setCurrent(i); setOpen(true); }
  function prev() { setCurrent((c) => (c - 1 + images.length) % images.length); }
  function next() { setCurrent((c) => (c + 1) % images.length); }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const lightbox = open && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95" onClick={() => setOpen(false)}>
      {/* Close */}
      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      {/* Counter + room label */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white">
          {current + 1} / {images.length}
        </div>
        {labels?.[current] && (
          <div className="rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm">
            {labels[current]}
          </div>
        )}
        {captions?.[current] && (
          <div className="max-w-[80vw] rounded-full bg-black/60 px-3 py-1 text-center text-[12px] text-white/90 backdrop-blur-sm">
            {captions[current]}
          </div>
        )}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}

      {/* Image */}
      <div className="relative mx-16 h-[80vh] w-[calc(100vw-128px)] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[current]}
          alt={`${title} photo ${current + 1}`}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_PLACEHOLDER}
          onError={onPropertyImageError}
          className="object-contain"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto px-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === current ? "border-white" : "border-transparent opacity-50 hover:opacity-80"}`}
            >
              <Image src={src} alt={`Thumb ${i + 1}`} fill sizes="80px" loading="lazy" onError={onPropertyImageError} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {lightbox}
      <div className="space-y-5">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.room && (
              <h3 className="mb-2 text-[13px] font-bold text-gray-900">{group.room}</h3>
            )}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.indices.map((i) => (
                <button
                  key={i}
                  onClick={() => openAt(i)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={displayImages[i]}
                    alt={labels?.[i] || `${title} photo ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                    onError={onPropertyImageError}
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  {i === 0 && (
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-[#08519A] px-2 py-0.5 text-[10px] font-bold text-white">
                      Cover
                    </div>
                  )}
                  {!group.room && labels?.[i] && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 pb-2 pt-5">
                      <span className="text-[11px] font-semibold text-white">{labels[i]}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-[14px] font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            View all {images.length} photos
          </button>
        )}
      </div>
    </>
  );
}
