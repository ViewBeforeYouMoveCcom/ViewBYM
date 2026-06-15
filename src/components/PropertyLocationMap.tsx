"use client";
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";

interface Props {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PropertyLocationMap({ latitude, longitude, address }: Props) {
  const mapsLoaded = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapsLoaded || !containerRef.current) return;
    if (mapRef.current) return;

    const position = { lat: latitude, lng: longitude };

    mapRef.current = new window.google.maps.Map(containerRef.current, {
      center: position,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    new window.google.maps.Marker({
      position,
      map: mapRef.current,
      title: address,
    });
  }, [mapsLoaded, latitude, longitude, address]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500">Map unavailable — API key not configured</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="mb-4 text-[15px] font-bold text-gray-900">Location</h2>
      <div ref={containerRef} className="h-[300px] w-full rounded-xl" />
      <p className="mt-3 text-[12px] text-gray-500">{address}</p>
    </div>
  );
}
