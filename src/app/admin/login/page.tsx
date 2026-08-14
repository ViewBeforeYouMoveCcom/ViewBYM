"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { supabaseClient } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
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
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const { data: isAdmin } = await supabaseClient.rpc("is_admin");

    if (!isAdmin) {
      await supabaseClient.auth.signOut();
      setError("You do not have admin access.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F4F9] px-5">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/images/vbym-logo.png"
              alt="View Before You Move"
              width={800}
              height={55}
              className="h-5 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-7 space-y-1 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-gray-400">
              Restricted area
            </p>
            <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">
              Admin console
            </h1>
            <p className="text-[13.5px] text-gray-500">
              Sign in with your administrator credentials.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@viewbeforeyoumove.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13.5px] text-red-700">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1A3A6C] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#142d54] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-gray-400">
          Not an admin?{" "}
          <Link href="/" className="text-gray-500 underline hover:text-gray-700">
            Go to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
