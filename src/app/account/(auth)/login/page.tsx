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
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Sign in
        </h1>
        <p className="text-[14px] text-gray-500">
          Access saved properties, searches, and alerts.
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
          {loading ? "Signing in..." : "Continue"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-[12px] text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <GoogleSignInButton
          redirectTo={`/account/auth-callback?next=${encodeURIComponent(redirectTo)}`}
        />

        <div className="flex items-center justify-between text-[13.5px]">
          <Link
            href="/account/forgot-password"
            className="text-gray-700 hover:text-gray-900 hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            href="/account/signup"
            className="text-gray-700 hover:text-gray-900 hover:underline"
          >
            Create account
          </Link>
        </div>

        <p className="text-[12px] text-gray-400">
          By signing in, you agree to our{" "}
          <Link href="/legal/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full max-w-[440px] animate-pulse rounded-2xl border border-gray-200 bg-white" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
