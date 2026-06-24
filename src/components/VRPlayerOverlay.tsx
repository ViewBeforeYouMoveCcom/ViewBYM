"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VR360Player from "@/components/VR360Player";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  propertyId: string;
}

export default function VRPlayerOverlay({ propertyId }: Props) {
  const [open, setOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  function onOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      trackEvent("vr_tour_open", { property_id: propertyId });
    }
    if (isOpen && !signedUrl && !loading) {
      setLoading(true);
      setFetchError(false);
      fetch(`/api/vr/${propertyId}`, { credentials: "same-origin" })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => setSignedUrl(d.signedUrl ?? null))
        .catch(() => setFetchError(true))
        .finally(() => setLoading(false));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-[10px] bg-[#08519A] px-4 text-sm font-semibold !text-white hover:bg-[#063d75]">
          Launch immersive VR tour
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-24px)] max-w-6xl rounded-xl border border-[#E5E7EB] bg-white p-0 shadow-lg sm:w-[calc(100vw-48px)]">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-heading text-lg font-semibold text-gray-900">
              Immersive VR tour
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6B7280]">
              Click and drag to look around in full 360°. Works in VR headsets too.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-gray-900">
              Immersive VR-enabled listing
            </span>
            <span className="text-xs text-[#6B7280]">360° video · VR headset ready</span>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
            {loading ? (
              <div className="flex h-[420px] items-center justify-center bg-gray-950 md:h-[560px]">
                <div className="flex flex-col items-center gap-3">
                  <svg className="h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-gray-400">Loading VR tour…</p>
                </div>
              </div>
            ) : fetchError || !signedUrl ? (
              <div className="flex h-[420px] items-center justify-center bg-[#F9FAFB] md:h-[560px]">
                <div className="text-center px-6">
                  <p className="text-sm font-medium text-gray-900">VR tour not available</p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    The agent is preparing the 360° tour. Check back shortly.
                  </p>
                </div>
              </div>
            ) : (
              <VR360Player videoUrl={signedUrl} className="h-[420px] w-full md:h-[560px]" autoHideControls />
            )}
          </div>

          <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-xs text-[#6B7280]">
              If anything looks incorrect, contact the agent before arranging a viewing.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] bg-white px-5 py-4">
          <DialogClose asChild>
            <Button variant="secondary" className="h-10 rounded-[10px] px-4 text-sm font-semibold">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
