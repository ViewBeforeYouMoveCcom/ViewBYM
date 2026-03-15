"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = useMemo(() => {
    if (!password || !confirm) return true;
    return password === confirm;
  }, [password, confirm]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    if (!consent) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabaseClient.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account/auth-callback?next=/account/saved-properties`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8">
        <div className="mb-5 space-y-1">
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
            Account created
          </h1>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] text-blue-700">
          <p className="font-bold">Check your email</p>
          <p className="mt-1">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then sign in below.
          </p>
          <p className="mt-1 text-[13px]">
            If email confirmation is disabled on this project, you can sign in
            immediately.
          </p>
        </div>

        <Link
          href="/account/login"
          className="mt-5 block w-full rounded-lg bg-blue-700 py-2.5 text-center text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Create account
        </h1>
        <p className="text-[14px] text-gray-500">
          Start saving properties, searches, and alerts.
        </p>
      </div>

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

        <FormField id="password" label="Password">
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </FormField>

        <FormField id="confirm" label="Confirm password">
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </FormField>

        {!passwordsMatch ? (
          <p className="text-[13.5px] text-red-600">Passwords do not match.</p>
        ) : null}

        <div className="flex items-start gap-3 text-[13.5px] text-gray-500">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(Boolean(v))}
          />
          <label htmlFor="consent" className="leading-relaxed">
            I agree to the{" "}
            <Link href="/legal/terms" className="underline">
              Terms
            </Link>{" "}
            and understand the{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

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
          {loading ? "Creating..." : "Create account"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-[12px] text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <GoogleSignInButton
          redirectTo="/account/auth-callback?next=/account/saved-properties"
          label="Sign up with Google"
        />

        <p className="text-center text-[12px] text-gray-400">
          Google sign-up skips email verification.
        </p>

        <p className="text-[13.5px] text-gray-500">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
