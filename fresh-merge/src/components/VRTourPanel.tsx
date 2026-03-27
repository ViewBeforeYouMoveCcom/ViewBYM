"use client";

import { useEffect, useState } from "react";
import VR360Player from "@/components/VR360Player";
import VRPlayerOverlay from "@/components/VRPlayerOverlay";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  propertyId: string;
  vrEnabled: boolean;
}

export default function VRTourPanel({ propertyId, vrEnabled }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!vrEnabled) return;
    setLoading(true);
    fetch(`/api/vr/${propertyId}`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setSignedUrl(d.signedUrl ?? null))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [propertyId, vrEnabled]);

  if (!vrEnabled) {
    return (
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-5">
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center">
            <p className="text-sm font-medium text-gray-900">VR tour not yet available</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              The agent has not added an immersive VR tour to this listing yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border border-[#E5E7EB]">
      <CardContent className="space-y-4 p-5">
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
          {loading ? (
            <div className="flex h-[420px] items-center justify-center bg-gray-950 md:h-[540px]">
              <div className="flex flex-col items-center gap-3">
                <svg className="h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-400">Loading VR tour…</p>
              </div>
            </div>
          ) : fetchError || !signedUrl ? (
            <div className="flex h-[420px] items-center justify-center bg-[#F9FAFB] md:h-[540px]">
              <div className="text-center px-6">
                <p className="text-sm font-medium text-gray-900">VR tour being prepared</p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  The agent is setting up the immersive VR tour. Check back shortly.
                </p>
              </div>
            </div>
          ) : (
            <VR360Player videoUrl={signedUrl} className="h-[420px] w-full md:h-[540px]" />
          )}
        </div>

        {signedUrl && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Tip</p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Click and drag to look around in full 360°. Works on desktop, mobile, and VR headsets.
              </p>
            </div>
            <VRPlayerOverlay propertyId={propertyId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
