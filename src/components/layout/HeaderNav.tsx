"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabaseClient } from "@/lib/supabaseClient";

const navItems = [
  { href: "/browse", label: "Properties" },
  { href: "/for-agents", label: "Agents" },
  { href: "/how-vr-works", label: "How VR Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function getAuthDisplayName(user: User | null) {
  if (!user) return null;

  const metadata = user.user_metadata as Record<string, unknown>;
  const candidates = [
    metadata.full_name,
    metadata.name,
    metadata.display_name,
    metadata.user_name,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  async function loadProfile(currentUser: User) {
    const { data } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", currentUser.id)
      .maybeSingle();
    setDisplayName(data?.full_name?.trim() || getAuthDisplayName(currentUser));
  }

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setDisplayName(null);
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

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 4); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleSearch(val: string) {
    const q = val.trim();
    const url = q ? `/browse?location=${encodeURIComponent(q)}` : "/browse";
    try { sessionStorage.setItem("vbym_last_search", url); } catch {}
    router.push(url);
    setSearchValue("");
    setMobileSearch("");
    setMobileOpen(false);
  }

  const label = displayName
    ? displayName.split(" ")[0]
    : user?.email?.split("@")[0] ?? "Account";

  // Truncate label for mobile screens if too long
  const truncateLabel = (text: string, maxLength: number = 10) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.06)]" : ""
      }`}
      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="mx-auto flex w-full max-w-[1800px] items-center gap-2 px-4 py-3 sm:gap-3 sm:px-5">

        {/* Logo */}
        <Link href="/" className="mr-1 min-w-0 shrink sm:mr-2 sm:shrink-0">
          <Image
            src="/images/vbym-logo.png"
            alt="View Before You Move"
            width={800}
            height={55}
            className="h-4 w-auto max-w-[210px] object-contain sm:max-w-[260px] md:h-[18px]"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-[7px] text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "bg-[#08519A] !text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Nav Search Bar ────────────────────────────────── */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(searchValue); }}
          className="hidden lg:flex flex-1 max-w-[300px] ml-2 items-center h-9 rounded-full border border-gray-200 bg-gray-50 px-3 gap-2 transition-all focus-within:border-[#08519A] focus-within:bg-white focus-within:shadow-sm"
        >
          <svg className="shrink-0 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by town or postcode…"
            className="flex-1 bg-transparent text-[12.5px] text-gray-800 placeholder-gray-400 outline-none"
          />
          {searchValue && (
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#08519A] px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-[#063d75]"
            >
              Go
            </button>
          )}
        </form>

        {/* Spacer */}
        <div className="flex-1 lg:hidden" />

        {/* Right side: auth */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!authLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 max-w-[104px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 text-[13.5px] font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:shadow-sm sm:max-w-none sm:gap-2 sm:px-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#08519A] text-[11px] font-bold text-white">
                    {label.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="inline truncate max-w-[80px] sm:hidden">{truncateLabel(label, 8)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-gray-400">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/agent/dashboard">Agent portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/saved-properties">My account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/enquiries">My enquiries</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !authLoading ? (
            <div className="hidden items-center gap-2 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 rounded-full px-4 text-[13.5px] font-semibold text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
                    Sign in
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account/login">Buyer sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agents/login">Agent sign in</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/account/signup"
                className="flex h-9 items-center rounded-full bg-[#08519A] px-5 text-[13.5px] font-semibold !text-white transition-all duration-200 hover:bg-[#063d75] hover:shadow-md"
              >
                Sign up free
              </Link>
            </div>
          ) : null}

          {/* Hamburger — mobile */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 lg:hidden"
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

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 px-5 py-3">

            {/* Mobile search */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(mobileSearch); }}
              className="mb-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#08519A] focus-within:bg-white"
            >
              <svg className="shrink-0 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search by town or postcode…"
                className="flex-1 bg-transparent text-[13.5px] text-gray-800 placeholder-gray-400 outline-none"
              />
              <button type="submit" className="rounded-full bg-[#08519A] px-3 py-1 text-[12px] font-bold text-white">
                Search
              </button>
            </form>

            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#08519A] !text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!user && (
              <>
                <div className="my-1 border-t border-gray-100" />
                <Link href="/account/login" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Buyer sign in
                </Link>
                <Link href="/agents/login" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Agent sign in
                </Link>
                <Link href="/account/signup" onClick={() => setMobileOpen(false)} className="mx-1 mt-1 rounded-xl bg-[#08519A] px-4 py-2.5 text-center text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]">
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
