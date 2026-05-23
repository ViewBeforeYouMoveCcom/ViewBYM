"use client";

import { useState } from "react";
import Link from "next/link";

import FormField from "@/components/FormField";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/account/auth-callback?next=/account/reset-password`
        : undefined;

    const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
      <div className="mb-7 space-y-2 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#08519A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
          </svg>
        </div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-[#08519A]">
          Reset your password
        </h1>
        <p className="text-[14px] text-gray-500">
          Enter the email linked to your account and we&apos;ll send you a secure reset link.
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-[14px] text-emerald-700">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <p className="font-bold">Reset link sent</p>
            </div>
            <p className="mt-1">
              If an account exists for <strong>{email}</strong>, you&apos;ll receive a reset link shortly. Check your spam folder if it doesn&apos;t arrive.
            </p>
          </div>
          <Link
            href="/account/login"
            className="block w-full rounded-xl bg-[#08519A] py-3 text-center text-[14px] font-bold text-white shadow-sm shadow-blue-900/15 transition-all duration-200 hover:bg-[#063d75] hover:shadow-md"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField id="email" label="Email address">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
            />
          </FormField>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13.5px] text-red-700 flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#08519A] py-3 text-[14px] font-bold text-white shadow-sm shadow-blue-900/15 transition-all duration-200 hover:bg-[#063d75] hover:shadow-md disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Sending...
              </span>
            ) : "Send reset link"}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between text-[13.5px]">
        <Link
          href="/account/login"
          className="flex items-center gap-1 font-medium text-gray-500 transition-colors hover:text-[#08519A]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Back to sign in
        </Link>
        <Link
          href="/account/signup"
          className="font-semibold text-[#08519A] transition-colors hover:text-[#063d75]"
        >
          Create account →
        </Link>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50/80 p-3 text-center text-[12px] text-gray-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-1 text-gray-300" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Reset links expire after 1 hour for security. You can request a new one at any time.
      </div>
    </div>
  );
}
