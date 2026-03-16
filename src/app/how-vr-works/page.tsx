import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowVrWorksPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A3A6C] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.12em] text-blue-300">
            VR Technology
          </p>
          <h1 className="mb-3.5 max-w-[640px] text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Tour homes before you leave the sofa.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-white/70">
            Full 360° immersive tours on any device. No headset required — just your browser.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse?vr=1"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Browse VR listings
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white/85 transition-colors hover:border-white/45 hover:bg-white/10"
            >
              FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3-FEATURE STRIP ──────────────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-5 md:grid-cols-3">

            {/* No headset required */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:border-blue-200 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                    <path d="M8 21h8M12 17v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">No headset required</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Works on desktop, tablet, and mobile. Headsets enhance the experience but aren't needed to explore.</p>
              </CardContent>
            </Card>

            {/* True 360° exploration */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:border-violet-200 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 shadow-md shadow-violet-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="white" strokeWidth="1.5"/>
                    <path d="M3 12h18" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">True 360° exploration</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Pause and look in every direction. Inspect details at your own pace with no time pressure.</p>
              </CardContent>
            </Card>

            {/* Floor plans in-tour */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:border-emerald-200 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3v18h18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 21h8V11h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 11V7h10v14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="16" r="1.2" fill="white"/>
                    <circle cx="16" cy="14" r="1.2" fill="white"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">Floor plans in-tour</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Dimensions overlay as you walk each room — so you know whether your furniture will actually fit.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ── CONTROLS GUIDE ───────────────────────────────────── */}
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Controls
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            Simple to navigate on any device
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">

            {/* Desktop */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v6l3-3M12 8l-3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="10" width="18" height="12" rx="2" stroke="white" strokeWidth="1.8"/>
                  <path d="M8 16h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[15px] font-bold text-gray-900">Desktop</h3>
              <ul className="flex flex-col gap-2.5 text-[14px] text-gray-500">
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Click and drag to look around in full 360°
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Use pause / play to freeze and inspect any area
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Hit reset view if you lose your bearings
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Switch between VR tour, photos, and floorplan tabs
                </li>
              </ul>
            </div>

            {/* Mobile */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-violet-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 shadow-md shadow-violet-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
                  <path d="M10 18h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[15px] font-bold text-gray-900">Mobile &amp; tablet</h3>
              <ul className="flex flex-col gap-2.5 text-[14px] text-gray-500">
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-violet-600">•</span>
                  Swipe to look around in every direction
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-violet-600">•</span>
                  Tap pause to examine a room closely
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-violet-600">•</span>
                  Rotate your device for a wider perspective
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-violet-600">•</span>
                  Save listings and revisit on any device later
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHAT VR-FIRST MEANS ──────────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            VR-first
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            What &quot;VR-first&quot; actually means
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Explanation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="mb-4 text-[15px] leading-relaxed text-gray-500">
                On VBYM, the VR tour is the primary way to understand a property's layout,
                flow, and feel. Photos and floorplans are still available — but the immersive
                tour is what helps buyers decide whether a physical viewing is actually worth
                their time.
              </p>
              <p className="mb-4 text-[15px] leading-relaxed text-gray-500">
                The result is fewer mismatched viewings, more considered enquiries, and a
                better experience for everyone involved.
              </p>
              <p className="text-[15px] leading-relaxed text-gray-500">
                Every tour is hosted on VBYM with a consistent, professional presentation —
                so buyers always know what to expect, regardless of which agency listed the property.
              </p>
            </div>

            {/* Feature chips */}
            <div className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="mb-5 text-[15px] font-bold text-gray-900">
                What this delivers for buyers and agents
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Share links, not files",
                  "Calm display",
                  "Better buyer intent",
                  "Higher conversion",
                  "Consistent quality",
                  "No headset needed",
                  "Any device",
                  "Fewer wasted viewings",
                ].map((chip) => (
                 <span
                    key={chip}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-[#1A3A6C] py-10 sm:py-14">
        <div className="mx-auto max-w-[1200px] px-5 text-center">
          <h2 className="mb-3 text-[clamp(22px,3vw,36px)] font-extrabold leading-[1.15] tracking-tight text-white">
            Ready to explore in VR?
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/75">
            Browse VR-enabled homes and shortlist with confidence from your sofa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/browse?vr=1"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Browse VR listings
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-white/25 bg-transparent px-5 py-2.5 text-[14px] font-semibold !text-white/85 transition-colors hover:bg-white/10"
            >
              Visit FAQs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
