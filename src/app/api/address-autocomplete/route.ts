import { NextResponse } from "next/server";

type Prediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: [] });
  }

  const params = new URLSearchParams({
    input,
    key: apiKey,
    components: "country:gb",
    types: "address",
  });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
      { cache: "no-store" }
    );
    const data = await res.json() as { status: string; predictions?: Prediction[] };

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = (data.predictions ?? []).map((p) => ({
      place_id: p.place_id,
      description: p.description,
      main_text: p.structured_formatting?.main_text ?? p.description,
      secondary_text: p.structured_formatting?.secondary_text ?? "",
    }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
