"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="w-full rounded-xl border border-[#E5E7EB]">
      <CardContent className="space-y-6 p-6 md:p-7">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
            Agent sign in
          </h1>
          <p className="text-sm text-[#6B7280]">
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
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-[10px] bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
          >
            {loading ? "Signing in..." : "Sign in to portal"}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 border-t border-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">or</span>
            <div className="flex-1 border-t border-[#E5E7EB]" />
          </div>

          <GoogleSignInButton
            redirectTo="/account/auth-callback?next=/agents/auth-redirect"
            label="Continue with Google"
          />

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/account/forgot-password"
              className="text-[#0F172A] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="border-t border-[#E5E7EB] pt-4 text-sm text-[#6B7280]">
            New to VBYM?{" "}
            <Link
              href="/agents/request-access"
              className="font-medium text-[#0F172A] hover:underline"
            >
              Request agent access →
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AgentLoginPage() {
  return (
    <div className="bg-white">
      {/* Header band */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge variant="amber">Agent portal</Badge>
              <p className="text-sm text-[#6B7280]">
                Sign in to manage listings, VR tours, and enquiries.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link className="text-[#0F172A] hover:underline" href="/">
                Home
              </Link>
              <Link className="text-[#0F172A] hover:underline" href="/for-agents">
                For agents
              </Link>
              <Link className="text-[#0F172A] hover:underline" href="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
            }
          >
            <AgentLoginForm />
          </Suspense>

          {/* Right rail */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6">
              <p className="text-sm font-semibold text-[#0F172A]">
                Your agent portal
              </p>

              <ul className="mt-4 grid gap-3 text-sm text-[#6B7280]">
                <li>• Publish and manage property listings</li>
                <li>• Attach and preview immersive VR tours</li>
                <li>• Receive and respond to enquiries</li>
                <li>• Control distribution — share links, not files</li>
              </ul>

              <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-4">
                <p className="text-sm font-semibold text-[#0F172A]">
                  Need access?
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Agent accounts are approved by the VBYM team.{" "}
                  <Link
                    href="/agents/request-access"
                    className="text-[#0F172A] underline"
                  >
                    Request access here.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer micro */}
      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-[#6B7280] md:px-6 lg:px-8">
          <span>
            By using VBYM you agree to our{" "}
            <Link className="underline" href="/legal/terms">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/legal/privacy">
              Privacy Policy
            </Link>
            .
          </span>
        </div>
      </footer>
    </div>
  );
}
