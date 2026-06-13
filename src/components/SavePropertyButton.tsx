"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { supabaseClient } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import LoginPromptModal from "@/components/LoginPromptModal";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  type: string;
}

interface Props {
  property: SavedProperty;
  className?: string;
  wrapperClassName?: string;
  size?: number;
}

function Toast({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        zIndex: 9999,
        transform: `translateX(-50%) translateY(${visible ? "0px" : "20px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "transform 0.45s cubic-bezier(0.34,1.4,0.64,1), opacity 0.35s ease",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        whiteSpace: "nowrap",
        background: "#1A3A6C",
        borderRadius: "16px",
        padding: "12px 20px",
        boxShadow: "0 8px 32px rgba(26,58,108,0.28), 0 2px 8px rgba(0,0,0,0.18)",
      }}
    >
      <svg
        width="15" height="15" viewBox="0 0 24 24"
        fill="#ef4444" stroke="#ef4444" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        style={{ display: "block", flexShrink: 0 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
        Saved to your properties
      </span>
    </div>,
    document.body
  );
}

export default function SavePropertyButton({ property, className, wrapperClassName, size = 18 }: Props) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDbProperty = UUID_RE.test(property.id);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUserId(user?.id ?? null);

      if (user && isDbProperty) {
        const { data } = await supabaseClient
          .from("saved_properties")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", property.id)
          .maybeSingle();
        setSaved(!!data);
      }
    }
    init();

    // Listen for auth changes (e.g. after logging in via modal)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, [property.id, isDbProperty]);

  async function saveToDb(uid: string) {
    if (!isDbProperty) return;
    const { error: saveError } = await supabaseClient
      .from("saved_properties")
      .upsert(
        {
          user_id: uid,
          property_id: property.id,
        },
        { onConflict: "user_id,property_id" }
      );

    if (saveError) {
      throw new Error(saveError.message);
    }

    setSaved(true);
    setError(null);
    showToast();
  }

  function showToast() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(true);
    timerRef.current = setTimeout(() => setToast(false), 2500);
  }

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    // Guest — show login modal instead
    if (!userId) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    try {
      if (isDbProperty) {
        if (saved) {
          await supabaseClient
            .from("saved_properties")
            .delete()
            .eq("user_id", userId)
            .eq("property_id", property.id);
          setSaved(false);
        } else {
          await saveToDb(userId);
        }
      } else {
        throw new Error("This property cannot be saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save property.");
      setSaved(false);
    } finally {
      setLoading(false);
    }
  }

  // Called after successful login via modal
  async function handleLoginSuccess() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    await saveToDb(user.id);
  }

  return (
    <>
      <Toast visible={toast} />

      <LoginPromptModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />

      <div className={cn("relative", wrapperClassName)}>
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          aria-label={saved ? "Remove from saved" : "Save property"}
          style={{ lineHeight: 0 }}
          className={cn(
            "flex items-center justify-center rounded-full transition-colors disabled:opacity-60",
            className
          )}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={saved ? "#ef4444" : "none"}
            stroke={saved ? "#ef4444" : "#374151"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {error ? (
          <span className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-red-200 bg-white p-2 text-xs leading-snug text-red-700 shadow-sm">
            {error}
          </span>
        ) : null}
      </div>
    </>
  );
}
