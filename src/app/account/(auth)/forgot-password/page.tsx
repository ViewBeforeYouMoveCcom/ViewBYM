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
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Reset your password
        </h1>
        <p className="text-[14px] text-gray-500">
          Enter the email linked to your account. We&apos;ll send a reset link.
        </p>
      </div>

      {success ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] text-blue-700">
          <p className="font-bold">Check your email</p>
          <p className="mt-1">
            If that email exists, we&apos;ve sent a reset link. Check your spam
            folder if it doesn&apos;t arrive within a few minutes.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField id="email" label="Email">
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </FormField>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13.5px] text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between text-[13.5px]">
        <Link
          href="/account/login"
          className="text-gray-700 hover:text-gray-900 hover:underline"
        >
          ← Back to sign in
        </Link>
        <Link
          href="/account/signup"
          className="text-gray-700 hover:text-gray-900 hover:underline"
        >
          Create account
        </Link>
      </div>

      <p className="mt-4 text-[12px] text-gray-400">
        If you don&apos;t receive an email, check junk/spam or try again.
      </p>
    </div>
  );
}
