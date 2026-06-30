import { NextResponse } from "next/server";

type AddressComponent = {
  long_name: string;
  types: string[];
};

export async function GET(request: Request) {
  const placeId = new URL(request.url).searchParams.get("place_id")?.trim();

  if (!placeId) {
    return NextResponse.json({ line1: "", city: "", postcode: "" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ line1: "", city: "", postcode: "" });
  }

  const params = new URLSearchParams({
    place_id: placeId,
    key: apiKey,
    fields: "address_components",
  });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
      { cache: "no-store" }
    );
    const data = await res.json() as {
      status: string;
      result?: { address_components?: AddressComponent[] };
    };

    if (data.status !== "OK" || !data.result?.address_components) {
      return NextResponse.json({ line1: "", city: "", postcode: "" });
    }

    let streetNumber = "";
    let route = "";
    let city = "";
    let postcode = "";
    let town = "";

    for (const comp of data.result.address_components) {
      const types = comp.types;
      if (types.includes("street_number")) streetNumber = comp.long_name;
      if (types.includes("route")) route = comp.long_name;
      if (types.includes("postal_town")) town = comp.long_name;
      if ((types.includes("locality") || types.includes("administrative_area_level_2")) && !city) {
        city = comp.long_name;
      }
      if (types.includes("postal_code")) postcode = comp.long_name;
    }

    const resolvedCity = town || city;
    const line1 = [streetNumber, route].filter(Boolean).join(" ");

    return NextResponse.json({ line1, city: resolvedCity, postcode });
  } catch {
    return NextResponse.json({ line1: "", city: "", postcode: "" });
  }
}
