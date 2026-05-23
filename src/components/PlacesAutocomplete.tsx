"use client";

import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";

export interface PlacesResult {
  line1: string;
  city: string;
  postcode: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (raw: string) => void;
  onSelect: (result: PlacesResult) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

/**
 * A text input wired to Google Places Autocomplete (UK only).
 * Falls back to a plain <input> if the Maps API hasn't loaded yet.
 * When the user selects a suggestion, `onSelect` fires with the
 * parsed { line1, city, postcode } so the parent can auto-fill those fields.
 */
export default function PlacesAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address…",
  required = false,
  className,
}: Props) {
  const mapsLoaded = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const inputClass =
    className ??
    "h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500";

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current) return;
    if (autocompleteRef.current) return; // already initialised

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(regions)"],
      componentRestrictions: { country: "gb" },
      fields: ["address_components", "name", "types"],
    });

    autocompleteRef.current = ac;

    listenerRef.current = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.address_components) return;

      let streetNumber = "";
      let route = "";
      let city = "";
      let postcode = "";
      let town = "";

      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("postal_town")) town = component.long_name;
        if (types.includes("locality") || types.includes("administrative_area_level_2")) {
          if (!city) city = component.long_name;
        }
        if (types.includes("postal_code")) postcode = component.long_name;
      }

      // Prioritise town/city name over street address
      const resolvedCity = town || city;
      const line1 = [streetNumber, route].filter(Boolean).join(" ");

      // If this is a town/city result (no street), show the city name
      const displayValue = resolvedCity && !streetNumber ? resolvedCity : (line1 || resolvedCity);

      onChange(displayValue);
      onSelect({ line1: displayValue, city: resolvedCity, postcode });
    });

    return () => {
      if (listenerRef.current) {
        window.google.maps.event.removeListener(listenerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsLoaded]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      className={inputClass}
    />
  );
}
