"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import VR360Player from "@/components/VR360Player";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  propertyId: string;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  triggerLabel?: ReactNode;
}

export default function VRPlayerOverlay({ propertyId, onOpenChange, triggerClassName, triggerLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showClose, setShowClose] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const resetHideTimer = useCallback(() => {
    setShowClose(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowClose(false), 2000);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
    setShowClose(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [onOpenChange]);

  function handleOpen() {
    setOpen(true);
    onOpenChange?.(true);
    trackEvent("vr_tour_open", { property_id: propertyId });
    if (!signedUrl && !loading) {
      setLoading(true);
      setFetchError(false);
      fetch(`/api/vr/${propertyId}`, { credentials: "same-origin" })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => setSignedUrl(d.signedUrl ?? null))
        .catch(() => setFetchError(true))
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    if (!open) return;

    // Request native fullscreen on the overlay element
    const el = overlayRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    // Show close button initially, then auto-hide
    resetHideTimer();

    // Listen for activity messages from the VR360Player iframe
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "vr-activity") resetHideTimer();
    }
    window.addEventListener("message", onMessage);

    // Close on Escape key
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);

    // If browser exits native fullscreen (e.g. user presses Escape in fullscreen mode),
    // close the overlay too
    function onFsChange() {
      if (!document.fullscreenElement) {
        setOpen(false);
        onOpenChange?.(false);
      }
    }
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [open, resetHideTimer, handleClose, onOpenChange]);

  const trigger = (
    <button
      onClick={handleOpen}
      className={triggerClassName ?? "h-11 rounded-[10px] bg-[#08519A] px-4 text-sm font-semibold text-white hover:bg-[#063d75]"}
    >
      {triggerLabel ?? "Launch immersive VR tour"}
    </button>
  );

  if (!mounted) return trigger;

  const overlay = open ? (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] bg-black">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-400">Loading VR tour…</p>
          </div>
        </div>
      ) : fetchError || !signedUrl ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-gray-400">VR tour not available</p>
        </div>
      ) : (
        <VR360Player videoUrl={signedUrl} className="h-full w-full" autoHideControls />
      )}

      {/* Close button — visible on open, auto-hides after 2 s of inactivity */}
      <button
        onClick={handleClose}
        onMouseEnter={resetHideTimer}
        aria-label="Close VR tour"
        className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-opacity duration-500 hover:bg-black/80 ${
          showClose ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  ) : null;

  return (
    <>
      {trigger}
      {createPortal(overlay, document.body)}
    </>
  );
}
