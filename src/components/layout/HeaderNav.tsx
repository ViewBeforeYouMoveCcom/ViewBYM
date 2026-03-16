"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabaseClient } from "@/lib/supabaseClient";

const navItems = [
  { href: "/browse", label: "Browse properties" },
  { href: "/for-agents", label: "For agents" },
  { href: "/how-vr-works", label: "How Immersive VR works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function loadProfile(userId: string) {
    const { data } = await supabaseClient
      .from("profiles")
      .select("full_name, role")
      .eq("id", userId)
      .single();
    setDisplayName(data?.full_name ?? null);
    setIsAdmin(data?.role === "admin");
  }

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setDisplayName(null);
        setIsAdmin(false);
      }
    });

    function handleProfileUpdate(e: Event) {
      const fullName = (e as CustomEvent<{ full_name: string | null }>).detail.full_name;
      setDisplayName(fullName || null);
    }
    window.addEventListener("vbym:profile-updated", handleProfileUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("vbym:profile-updated", handleProfileUpdate);
    };
  }, []);

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const label = displayName
    ? displayName.split(" ")[0]
    : user?.email?.split("@")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-3.5">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/vbym-logo.png"
            alt="View Before You Move"
            width={800}
            height={55}
            className="h-4 w-auto object-contain md:h-[18px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {!authLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 text-[13.5px] font-semibold text-gray-700 transition-colors hover:border-gray-400">
                  {label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin console</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/agent/dashboard">Agent portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/saved-properties">My account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !authLoading ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 rounded-lg px-4 text-[13.5px] font-semibold text-gray-600 transition-colors hover:text-gray-900">
                    Sign in
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account/login">Buyer / tenant sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agents/login">Agent / Admin sign in</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/account/signup"
                className="flex h-9 items-center rounded-lg bg-blue-700 px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Sign up free
              </Link>
            </div>
          ) : null}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 lg:hidden"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav — hamburger dropdown */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-5 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
