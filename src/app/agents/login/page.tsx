"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

function AgentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Check if admin — redirect to admin console if so
    const { data: isAdmin } = await supabaseClient.rpc("is_admin");

    if (isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push(redirectTo ?? "/agent/dashboard");
    }

    router.refresh();
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
      <div className="mb-7 space-y-2 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[.14em] text-black">
          Agent portal
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#08519A]">
          Sign in to your portal
        </h1>
        <p className="text-[14px] text-gray-500">
          Access your listings, enquiries, and VR tour management.
        </p>
      </div>

      {/* Google first */}
      <GoogleSignInButton
        redirectTo="/account/auth-callback?next=/agents/auth-redirect"
        label="Continue with Google"
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
            placeholder="you@agency.co.uk"
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
          ) : "Sign in to portal"}
        </button>

        <p className="text-center text-[13.5px] text-gray-500">
          New to VBYM?{" "}
          <Link
            href="/agents/request-access"
            className="font-semibold text-[#08519A] transition-colors hover:text-[#063d75]"
          >
            Request agent access →
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

export default function AgentLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px]">
          {/* Decorative top accent */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#08519A] shadow-lg shadow-blue-900/20">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a4 4 0 00-8 0v2" />
                <circle cx="12" cy="14" r="1.5" />
                <path d="M12 15.5V17" />
              </svg>
            </div>
          </div>

          {/* Form card */}
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse rounded-2xl border border-gray-200 bg-white" />
            }
          >
            <AgentLoginForm />
          </Suspense>

          {/* Bottom trust indicators */}
          <div className="mt-8 space-y-4">
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-[12px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure &amp; encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                GDPR compliant
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Agent portal
              </span>
            </div>

            {/* Helpful links */}
            <p className="text-center text-[12px] text-gray-400">
              Need help?{" "}
              <Link href="/contact" className="text-gray-500 underline transition-colors hover:text-[#08519A]">
                Contact support
              </Link>
              {" · "}
              <Link href="/faq" className="text-gray-500 underline transition-colors hover:text-[#08519A]">
                FAQ
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
