/**
 * VRTourPanel — structured VR tour display for property detail pages.
 *
 * This component renders the VR tour source in a clean, structured way.
 * It is designed so the future controlled VR pipeline can replace the embed
 * with a VBYM-hosted, signed, access-controlled player without changing
 * the surrounding layout.
 *
 * TODO (Future VR Pipeline):
 *   - Replace embedUrl/iframeHtml with a VBYM-hosted signed URL
 *   - Add processing status indicator (pending / processing / ready)
 *   - Add access control: only verified buyers can access full tour
 *   - Add anti-download controls (no right-click, no direct URL exposure)
 *   - Add tour analytics (time spent, rooms visited, etc.)
 */

import VRPlayerOverlay from "@/components/VRPlayerOverlay";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  vrEnabled: boolean;
  embedUrl?: string;
  iframeHtml?: string;
}

export default function VRTourPanel({ vrEnabled, embedUrl, iframeHtml }: Props) {
  const hasSource = !!(embedUrl || iframeHtml);

  if (!vrEnabled) {
    return (
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-5">
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center">
            <p className="text-sm font-medium text-[#0F172A]">VR tour not yet available</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              The agent has not added an Immersive VR tour to this listing yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border border-[#E5E7EB]">
      <CardContent className="space-y-4 p-5">
        {hasSource ? (
          <>
            {/* Inline VR embed — renders the tour directly in the tab */}
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              {iframeHtml ? (
                // Raw iframe HTML from agent (e.g. embed code from provider)
                // TODO: In future, replace with sanitised VBYM-controlled player
                <div
                  className="min-h-[420px] w-full md:min-h-[540px]"
                  dangerouslySetInnerHTML={{ __html: iframeHtml }}
                />
              ) : (
                // Embed URL (Matterport, Kuula, or custom)
                // TODO: In future, proxy through VBYM CDN with signed token
                <iframe
                  src={embedUrl}
                  className="h-[420px] w-full md:h-[540px]"
                  allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                  allowFullScreen
                  title="Immersive VR tour"
                />
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex-1">
                <p className="text-sm font-medium text-[#0F172A]">Tip</p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  You can pause at any point and look around in full 360°. Best experienced on
                  desktop or tablet.
                </p>
              </div>

              {/* Fallback: open in full-screen overlay */}
              <VRPlayerOverlay embedUrl={embedUrl} iframeHtml={iframeHtml} />
            </div>

            {embedUrl && !iframeHtml && (
              // Accessible fallback link if the embed doesn't load
              <p className="text-xs text-[#6B7280]">
                Tour not loading?{" "}
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:opacity-80"
                >
                  Open in new tab
                </a>
              </p>
            )}
          </>
        ) : (
          // VR is enabled on the listing but no source URL has been set yet
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center">
            <p className="text-sm font-medium text-[#0F172A]">VR tour being prepared</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              The agent is setting up the Immersive VR tour. Check back shortly.
            </p>
            {/* Launch modal anyway so buyer can see the placeholder UI */}
            <div className="mt-4 flex justify-center">
              <VRPlayerOverlay embedUrl={undefined} iframeHtml={undefined} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
