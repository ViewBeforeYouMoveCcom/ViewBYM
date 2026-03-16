"use client";

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

interface Props {
  embedUrl?: string | null;
  iframeHtml?: string | null;
}

export default function VRPlayerOverlay({ embedUrl, iframeHtml }: Props) {
  const hasVr = !!(embedUrl || iframeHtml);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-[10px] bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
          Launch Immersive VR tour
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-24px)] max-w-6xl rounded-xl border border-[#E5E7EB] bg-white p-0 shadow-lg sm:w-[calc(100vw-48px)]">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-heading text-lg font-semibold text-gray-900">
              Immersive VR tour
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6B7280]">
              Tip: You can pause at any point and look around in full 360°.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Utility row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-gray-900">
              Immersive VR-enabled listing
            </span>
            <span className="text-xs text-[#6B7280]">
              Best experience on desktop or tablet
            </span>
          </div>

          {!iframeHtml && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-9 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB]"
              >
                Reset view
              </button>
              <button
                type="button"
                className="h-9 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB]"
              >
                Help
              </button>
            </div>
          )}
        </div>

        {/* Player area */}
        <div className="px-5 py-5">
          {hasVr ? (
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              {iframeHtml ? (
                <div
                  className="min-h-[420px] w-full md:min-h-[520px]"
                  dangerouslySetInnerHTML={{ __html: iframeHtml }}
                />
              ) : (
                <iframe
                  src={embedUrl!}
                  className="h-[420px] w-full md:h-[520px]"
                  allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                  allowFullScreen
                  title="Immersive VR tour"
                />
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
              {/* Fake player chrome */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="h-9 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB]"
                  >
                    Play / Pause
                  </button>
                  <span className="text-xs text-[#6B7280]">
                    Drag to look · Scroll to zoom
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-9 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB]"
                  >
                    Floor selector
                  </button>
                  <button
                    type="button"
                    className="h-9 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB]"
                  >
                    Fullscreen
                  </button>
                </div>
              </div>

              {/* Placeholder canvas */}
              <div className="flex min-h-[420px] items-center justify-center px-6 py-10 text-center md:min-h-[520px]">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-gray-900">
                    Immersive VR player placeholder
                  </p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    This area will render the interactive Immersive VR tour (360° viewing,
                    hotspots, guided navigation, and headset prompts).
                  </p>

                  <div className="mt-6 grid gap-2 text-left text-sm text-[#6B7280] sm:grid-cols-2">
                    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                      <p className="font-medium text-gray-900">Controls</p>
                      <p className="mt-1">Drag to look around · Tap to pause</p>
                    </div>
                    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                      <p className="font-medium text-gray-900">Privacy</p>
                      <p className="mt-1">Tours stay on VBYM—share links, not files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Small disclaimer */}
          <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-xs text-[#6B7280]">
              If anything looks incorrect, contact the agent before arranging a viewing.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-3 border-t border-[#E5E7EB] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            Report an issue with this tour
          </button>

          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="h-10 rounded-[10px] px-4 text-sm font-semibold"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
