"use client";

import { useEffect, useRef, useState } from "react";
import VR360Player from "@/components/VR360Player";
import VRPlayerOverlay, { type VRPlayerOverlayHandle } from "@/components/VRPlayerOverlay";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  propertyId: string;
  vrEnabled: boolean;
  /** Walkthrough MP4, used as a fallback if the 360° player fails to load. */
  videoUrl?: string | null;
  /** Whether the property has a photo gallery to fall back to. */
  hasGallery?: boolean;
}

export default function VRTourPanel({ propertyId, vrEnabled, videoUrl, hasGallery }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [vrOverlayOpen, setVrOverlayOpen] = useState(false);
  const [vrFailed, setVrFailed] = useState(false);
  const overlayControlRef = useRef<VRPlayerOverlayHandle>(null);

  useEffect(() => {
    if (!vrEnabled) return;
    setLoading(true);
    fetch(`/api/vr/${propertyId}`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setSignedUrl(d.signedUrl ?? null))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [propertyId, vrEnabled]);

  // The 360° player runs in an isolated iframe (see VR360Player) and posts a
  // "vr-error" message up when it hits a real playback failure (unsupported
  // device, bad media, stuck load) — switch to the MP4/gallery fallback then.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "vr-error") setVrFailed(true);
      if (e.data?.type === "vr-fullscreen-request") overlayControlRef.current?.open();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!vrEnabled) {
    return (
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-5">
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center">
            <p className="text-sm font-medium text-gray-900">VR tour not yet available</p>
            <p className="mt-1 text-sm text-gray-600">
              The agent has not yet added an immersive VR tour to this listing.
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
                <p className="mt-1 text-sm text-gray-600">
                  The agent is setting up the immersive VR tour. Check back shortly.
                </p>
              </div>
            </div>
          ) : vrFailed ? (
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 bg-[#F9FAFB] p-6 text-center md:h-[540px]">
              <p className="text-sm font-medium text-gray-900">360° tour couldn&apos;t load</p>
              <p className="max-w-sm text-sm text-gray-600">
                {videoUrl
                  ? "We couldn't play the immersive tour on this device — here's the walkthrough video instead."
                  : "We couldn't play the immersive tour on this device — take a look at the photo gallery instead."}
              </p>
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  preload="metadata"
                  className="mt-1 aspect-video w-full max-w-md rounded-xl bg-black"
                />
              ) : hasGallery ? (
                <a
                  href="#property-gallery"
                  className="mt-1 rounded-[10px] bg-[#08519A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#063d75]"
                >
                  View photo gallery
                </a>
              ) : null}
            </div>
          ) : vrOverlayOpen ? (
            <div className="flex h-[420px] items-center justify-center bg-gray-950 md:h-[540px]" />
          ) : (
            <div className="relative">
              <VR360Player videoUrl={signedUrl} className="h-[420px] w-full md:h-[540px]" showFullscreenButton />

              {/* Clear 360° interaction indicator */}
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12a9 4 0 0 0 18 0" />
                </svg>
                <span className="text-[11px] font-semibold">360°</span>
              </div>
            </div>
          )}

          {/* No visible trigger here — opened via the "vr-fullscreen-request"
              message from the player's own transport-bar button above. */}
          <VRPlayerOverlay
            ref={overlayControlRef}
            propertyId={propertyId}
            onOpenChange={setVrOverlayOpen}
            triggerClassName="hidden"
          />
        </div>

        {signedUrl && !vrFailed && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-sm font-medium text-gray-900">How to look around</p>
            <p className="mt-1 text-sm text-gray-600">
              Look around as the tour plays. Drag with your mouse or swipe on your screen to
              look left, right, up and down as the tour moves through the property. No headset is
              required.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
