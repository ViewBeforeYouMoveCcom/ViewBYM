"use client";

import { useEffect, useState } from "react";

const SCRIPT_ID = "google-maps-places-script";

/**
 * Lazy-loads the Google Maps JavaScript API (Places library) once per page.
 * Safe to call from multiple components — only one <script> tag is ever added.
 * Returns `true` once `window.google.maps.places` is available.
 */
export function useGoogleMaps(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    // Already loaded
    if (
      typeof window.google !== "undefined" &&
      window.google.maps &&
      window.google.maps.places
    ) {
      setLoaded(true);
      return;
    }

    // Script tag already in DOM (another component beat us to it)
    if (document.getElementById(SCRIPT_ID)) {
      // Poll until the library is ready
      const interval = setInterval(() => {
        if (
          typeof window.google !== "undefined" &&
          window.google.maps &&
          window.google.maps.places
        ) {
          setLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("useGoogleMaps: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.");
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  return loaded;
}
