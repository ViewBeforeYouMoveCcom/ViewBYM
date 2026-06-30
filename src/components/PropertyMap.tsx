"use client";

import { useEffect, useRef } from "react";
import type { Property } from "@/data/properties";

interface Props {
  properties: Property[];
  onPinClick?: (id: string) => void;
}

export default function PropertyMap({ properties, onPinClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);

  // Initialise map once
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    if (mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default marker icon path broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [54.5, -2.5],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      const map = mapRef.current!;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const propertiesWithCoords = properties.filter(
        (p) => p.latitude != null && p.longitude != null
      );

      if (propertiesWithCoords.length === 0) return;

      const bounds: [number, number][] = [];

      propertiesWithCoords.forEach((p) => {
        const lat = p.latitude!;
        const lng = p.longitude!;

        const colour = p.vrEnabled ? "#2563EB" : "#08519A";
        const priceLabel = p.price.slice(0, 8);

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${colour};
            color:#fff;
            border:2px solid #fff;
            border-radius:20px;
            padding:4px 8px;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 1px 4px rgba(0,0,0,.35);
            font-family:system-ui,sans-serif;
          ">${priceLabel}</div>`,
          iconAnchor: [0, 0],
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(map)
          .on("click", () => onPinClick?.(p.id));

        markersRef.current.push(marker);
        bounds.push([lat, lng]);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });
  }, [properties, onPinClick]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={containerRef} className="h-full w-full rounded-xl" />
    </>
  );
}
