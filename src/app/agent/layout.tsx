"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabaseClient } from "@/lib/supabaseClient";

const navItems = [
  { href: "/agent/dashboard", label: "Dashboard" },
  { href: "/agent/listings", label: "My listings" },
  { href: "/agent/enquiries", label: "Enquiries" },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "onboarding">("loading");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        router.replace("/account/login?redirect=/agent/dashboard");
        return;
      }

      // If on onboarding page, skip membership check
      if (pathname === "/agent/onboarding") {
        setStatus("ok");
        return;
      }

      const { data: memberships } = await supabaseClient
        .from("agency_members")
        .select("agency_id")
        .eq("user_id", user.id)
        .limit(1);

      if (!memberships || memberships.length === 0) {
        setStatus("onboarding");
        router.replace("/agent/onboarding");
        return;
      }

      setStatus("ok");
    }
    check();
  }, [router, pathname]);

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }

  if (status === "loading" || status === "onboarding") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </div>
    );
  }

  // Onboarding page gets no sidebar
  if (pathname === "/agent/onboarding") {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="mx-auto max-w-2xl px-4 py-12">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-col border-r border-[#E5E7EB] bg-white lg:flex">
        <div className="border-b border-[#E5E7EB] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
            Agent portal
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">VBYM</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#E5E7EB] px-3 py-4 space-y-1">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
          >
            Public site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-gray-900">Agent</p>
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                pathname.startsWith(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-[#374151]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pb-10 pt-20 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
