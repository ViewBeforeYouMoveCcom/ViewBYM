import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SyntheticEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Shared property-image loading helpers ─────────────────────────────────
// Used across PropertyCard, PropertyHero and PhotoGallery so a broken/slow
// image on a flaky mobile connection degrades gracefully instead of showing
// a blank box or the browser's default broken-image icon.

export const IMAGE_FALLBACK = "/images/property-placeholder.svg";

// Tiny neutral-grey blur shown while a photo loads over a slow connection.
export const IMAGE_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyUyM2U1ZTdlYicvPjwvc3ZnPg==";

export function onPropertyImageError(e: SyntheticEvent<HTMLImageElement>) {
  if (e.currentTarget.src.endsWith(IMAGE_FALLBACK)) return;
  e.currentTarget.src = IMAGE_FALLBACK;
}
