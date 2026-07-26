"use client";

import { useState } from "react";

interface Props {
  src: string;
  poster?: string;
}

export default function WalkthroughVideo({ src, poster }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 text-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
        </svg>
        <p className="px-6 text-sm text-gray-500">This walkthrough video couldn&apos;t be loaded. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <svg className="h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      <video
        src={src}
        controls
        preload="metadata"
        poster={poster}
        onLoadedData={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
        className="h-full w-full"
      />
    </div>
  );
}
