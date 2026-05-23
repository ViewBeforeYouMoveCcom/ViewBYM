"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  id: string;
}

export default function TrackListingView({ id }: Props) {
  useEffect(() => {
    trackEvent("listing_view", { property_id: id });
  }, [id]);

  return null;
}
