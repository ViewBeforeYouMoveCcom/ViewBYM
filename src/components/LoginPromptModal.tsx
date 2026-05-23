"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { supabaseClient } from "@/lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // called after successful login
  heading?: string;
  subheading?: string;
}

export default function LoginPromptModal({ open, onClose, onSuccess, heading, subheading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Focus email field when opened
  useEffect(() => {
    if (open) {
      setError(null);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
    onSuccess();
  }

  async function handleGoogle() {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account/auth-callback?next=${window.location.pathname}` },
    });
  }

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          transition: "opacity 0.2s ease",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to save property"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 10001,
          transform: `translate(-50%, ${open ? "-50%" : "-46%"})`,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 0.28s cubic-bezier(0.34,1.3,0.64,1), opacity 0.2s ease",
          width: "100%",
          maxWidth: "420px",
          padding: "0 20px",
        }}
      >
        <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="px-7 pb-7 pt-7">
            {/* Heart icon + heading */}
            <div className="mb-5 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">
                {heading ?? "Save this property"}
              </h2>
              <p className="mt-1 text-[13.5px] text-gray-500">
                {subheading ?? "Sign in to save properties and access them anywhere."}
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="mb-4 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-[13.5px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-4 flex items-center gap-3">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-[11.5px] font-medium text-gray-400">or sign in with email</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white"
              />

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#08519A] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#063d75] disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign in & save property"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-gray-400">
              <Link href="/account/forgot-password" className="hover:text-gray-700 hover:underline" onClick={onClose}>
                Forgot password?
              </Link>
              <span>
                No account?{" "}
                <Link href="/account/signup" className="font-semibold text-[#08519A] hover:underline" onClick={onClose}>
                  Sign up free
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
