"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account/saved-properties";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
      <div className="mb-7 space-y-2 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[.14em] text-black">
          Welcome back
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#08519A]">
          Sign in to your account
        </h1>
        <p className="text-[14px] text-gray-500">
          Access your saved properties, searches, and alerts.
        </p>
      </div>

      {/* Google first */}
      <GoogleSignInButton
        redirectTo={`/account/auth-callback?next=${encodeURIComponent(redirectTo)}`}
      />

      {/* Divider */}
      <div className="relative my-6 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-[12px] font-medium text-gray-400">or sign in with email</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

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

        <FormField id="password" label="Password">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            href="/account/forgot-password"
            className="text-[13px] font-medium text-gray-400 transition-colors hover:text-[#08519A]"
          >
            Forgot password?
          </Link>
        </div>

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
              Signing in...
            </span>
          ) : "Sign in"}
        </button>

        <p className="text-center text-[13.5px] text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/signup"
            className="font-semibold text-[#08519A] transition-colors hover:text-[#063d75]"
          >
            Create one free →
          </Link>
        </p>

        <p className="text-center text-[11.5px] text-gray-400">
          By signing in you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-gray-600">
            Terms
          </Link>
          {" & "}
          <Link href="/legal/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full animate-pulse rounded-2xl border border-gray-200 bg-white" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
