"use client";
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";
import type { Property } from "@/data/properties";

interface Props {
  properties: Property[];
  onPinClick?: (id: string) => void;
}

export default function PropertyMap({ properties, onPinClick }: Props) {
  const mapsLoaded = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    // Default centre: UK
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 54.5, lng: -2.5 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });
  }, [mapsLoaded]);

  useEffect(() => {
    if (!mapsLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const propertiesWithCoords = properties.filter(
      (p) => p.latitude != null && p.longitude != null
    );

    if (propertiesWithCoords.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    propertiesWithCoords.forEach((p) => {
      const position = { lat: p.latitude!, lng: p.longitude! };
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current!,
        title: p.title,
        label: {
          text: p.price.replace("£", "£").slice(0, 8),
          color: "#fff",
          fontSize: "11px",
          fontWeight: "700",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 26,
          fillColor: p.vrEnabled ? "#2563EB" : "#08519A",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        onPinClick?.(p.id);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    mapInstanceRef.current.fitBounds(bounds);
    if (propertiesWithCoords.length === 1) {
      mapInstanceRef.current.setZoom(14);
    }
  }, [mapsLoaded, properties, onPinClick]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500">Map unavailable — API key not configured</p>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="h-full w-full rounded-xl" />
  );
}
