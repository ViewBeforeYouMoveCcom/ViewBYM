"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/button";
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
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 space-y-1.5">
        <p className="text-[12px] font-bold uppercase tracking-[.12em] text-blue-700">
          Agent portal
        </p>
        <h1 className="text-[24px] font-bold tracking-tight text-gray-900">
          Sign in to your portal
        </h1>
        <p className="text-[14px] text-gray-500">
          Access your listings, enquiries, and VR tour management.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <FormField id="email" label="Email">
          <Input
            id="email"
            type="email"
            placeholder="you@agency.co.uk"
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
          className="w-full rounded-lg bg-blue-700 py-2.5 text-[14px] font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in to portal"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-[12px] text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <GoogleSignInButton
          redirectTo="/account/auth-callback?next=/agents/auth-redirect"
          label="Continue with Google"
        />

        <div className="flex items-center justify-between text-[13.5px]">
          <Link
            href="/account/forgot-password"
            className="text-gray-500 transition-colors hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-4 text-[13.5px] text-gray-500">
          New to VBYM?{" "}
          <Link
            href="/agents/request-access"
            className="font-medium text-blue-700 transition-colors hover:text-blue-800"
          >
            Request agent access →
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AgentLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Body — vertically centered */}
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[840px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <Suspense
              fallback={
                <div className="h-72 w-full max-w-[440px] animate-pulse rounded-2xl border border-gray-200 bg-white" />
              }
            >
              <AgentLoginForm />
            </Suspense>

            {/* Right rail */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[17px] font-bold text-gray-900">
                  Your agent portal
                </h2>

                <ul className="space-y-4">
                  {[
                    {
                      text: "Publish and manage listings",
                      accent: "from-blue-500 to-blue-700",
                      shadow: "shadow-blue-200",
                    },
                    {
                      text: "Attach immersive VR tours",
                      accent: "from-violet-500 to-indigo-700",
                      shadow: "shadow-violet-200",
                    },
                    {
                      text: "Receive and respond to enquiries",
                      accent: "from-emerald-500 to-teal-700",
                      shadow: "shadow-emerald-200",
                    },
                    {
                      text: "Control distribution — share links, not files",
                      accent: "from-amber-500 to-orange-600",
                      shadow: "shadow-amber-200",
                    },
                  ].map((benefit) => (
                    <li key={benefit.text} className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.accent} text-[11px] font-bold text-white shadow-sm ${benefit.shadow}`}>
                        ✓
                      </span>
                      <span className="text-[14px] text-gray-600">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Need access? */}
              <div className="mt-4 rounded-2xl bg-[#1A3A6C] p-5">
                <p className="text-[13px] font-bold text-white">
                  Need access?
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                  Agent accounts are approved by the VBYM team.
                </p>
                <Link
                  href="/agents/request-access"
                  className="mt-3 inline-flex text-[13px] font-semibold text-blue-300 transition-colors hover:text-white"
                >
                  Request access here →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>



    </div>
  );
}
