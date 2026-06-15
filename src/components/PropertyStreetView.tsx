"use client";
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";

interface Props {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PropertyStreetView({ latitude, longitude, address }: Props) {
  const mapsLoaded = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!mapsLoaded || !containerRef.current) return;
    if (panoramaRef.current) return;

    panoramaRef.current = new window.google.maps.StreetViewPanorama(
      containerRef.current,
      {
        position: { lat: latitude, lng: longitude },
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: true,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: false,
      }
    );
  }, [mapsLoaded, latitude, longitude]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500">Street View unavailable — API key not configured</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="mb-4 text-[15px] font-bold text-gray-900">Street View</h2>
      <div ref={containerRef} className="h-[400px] w-full rounded-xl" />
      <p className="mt-3 text-[12px] text-gray-500">{address}</p>
    </div>
  );
}
