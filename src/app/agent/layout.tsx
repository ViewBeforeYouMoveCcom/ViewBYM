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
  const [status, setStatus] = useState<"loading" | "ok" | "onboarding" | "pending">("loading");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        router.replace("/account/login?redirect=/agent/dashboard");
        return;
      }
      const { data: memberships } = await supabaseClient
        .from("agency_members")
        .select("agency_id, agencies(status)")
        .eq("user_id", user.id)
        .limit(1);

      // User already has an agency — let them through
      if (memberships && memberships.length > 0) {
        const agencyStatus = (memberships[0] as unknown as { agencies: { status: string } }).agencies?.status;
        if (pathname === "/agent/onboarding") {
          router.replace("/agent/dashboard");
          return;
        }
        if (agencyStatus !== "approved") {
          setStatus("pending");
          return;
        }
        setStatus("ok");
        return;
      }

      // No agency — check if they have an approved application
      const { data: applicationStatus } = await supabaseClient.rpc("agent_my_application_status");

      if (applicationStatus !== "approved") {
        router.replace("/agents/auth-redirect");
        return;
      }

      // Approved application but no agency yet — go to onboarding
      if (pathname === "/agent/onboarding") {
        setStatus("ok");
        return;
      }
      setStatus("onboarding");
      router.replace("/agent/onboarding");
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

  // Pending approval screen
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-semibold text-gray-900">
                Application under review
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                Your agency profile has been submitted. You&apos;ll be able to access the dashboard once approved.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                ⏳ Pending approval
              </p>
              <p className="mt-2 text-sm text-amber-800">
                Our team is reviewing your agency details. This typically takes 1–2 business days.
                You&apos;ll receive an email notification once your account is approved.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-[13.5px] font-semibold text-gray-900">What happens next</p>
              <div className="mt-4 space-y-3">
                {[
                  { step: "1", title: "Account under review", body: "Your agency profile is submitted and held in a pending state while our team verifies your details." },
                  { step: "2", title: "Approval within 1–2 business days", body: "A member of the View Before You Move team will review your agency and confirm your access by email." },
                  { step: "3", title: "Start listing with immersive VR", body: "Once approved, you can create property listings and submit 360° footage for your full VR tours." },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: "#08519A" }}>
                      {step}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-gray-900">{title}</p>
                      <p className="text-[13px] leading-relaxed text-gray-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
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
      <aside className="hidden w-56 flex-shrink-0 lg:block">
        <div className="fixed top-0 flex h-screen w-56 flex-col border-r border-[#E5E7EB] bg-white">
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
