"use client";

import Link from "next/link";

import { clearCookieConsent } from "@/lib/cookieConsent";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pb-7 pt-12">
      <div className="mx-auto max-w-[1800px] px-5">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-2.5 text-[15px] font-bold tracking-tight text-gray-900">
              View Before You Move
            </div>
            <p className="max-w-[260px] text-[13px] leading-relaxed text-gray-500">
              The UK&apos;s VR-first property portal helping buyers explore and shortlist with real confidence.
            </p>
          </div>

          {/* Links */}
          {[
            {
              heading: "Properties",
              links: [
                { href: "/browse", label: "Browse all" },
                { href: "/browse?vr=1", label: "VR-enabled" },
                { href: "/browse?type=new", label: "New homes" },
                { href: "/browse?listing_type=commercial", label: "Commercial" },
              ],
            },
            {
              heading: "Agents",
              links: [
                { href: "/for-agents", label: "Overview" },
                { href: "/agents/request-access", label: "Join the Founder Pilot" },
                { href: "/vendors/immersive-vr", label: "Vendor partners" },
                { href: "/legal/agency-terms", label: "Agency Terms" },
              ],
            },
            {
              heading: "Company",
              links: [
                { href: "/about", label: "About" },
                { href: "/how-vr-works", label: "How VR works" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
                { href: "/legal/privacy", label: "Privacy" },
                { href: "/legal/terms", label: "Terms" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3.5 text-[12px] font-bold uppercase tracking-[.07em] text-gray-700">
                {col.heading}
              </h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[13.5px] text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <p className="text-[12.5px] text-gray-400">
            © 2026 View Before You Move Ltd.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy", href: "/legal/privacy" },
              { label: "Terms", href: "/legal/terms" },
              { label: "Cookies", href: "/legal/cookies" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12.5px] text-gray-400 transition-colors hover:text-gray-700"
              >
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={clearCookieConsent}
              className="text-[12.5px] text-gray-400 transition-colors hover:text-gray-700"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
