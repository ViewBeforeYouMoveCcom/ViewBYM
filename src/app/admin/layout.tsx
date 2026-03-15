"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabaseClient } from "@/lib/supabaseClient";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/agencies", label: "Agencies" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        router.replace("/account/login?redirect=/admin/dashboard");
        return;
      }
      const { data: isAdmin } = await supabaseClient.rpc("is_admin");
      if (!isAdmin) {
        setStatus("denied");
        return;
      }
      setStatus("ok");
    }
    check();
  }, [router]);

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-sm text-[#6B7280]">Checking access…</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="max-w-sm space-y-3 text-center">
          <p className="text-base font-semibold text-[#0F172A]">Access denied</p>
          <p className="text-sm text-[#6B7280]">
            This area is restricted to administrators.
          </p>
          <Link href="/" className="text-sm text-blue-700 hover:underline">
            Go home
          </Link>
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
            Admin
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0F172A]">
            VBYM Console
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#E5E7EB] px-3 py-4">
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
        <p className="text-sm font-semibold text-[#0F172A]">Admin</p>
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                pathname === item.href
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
