import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowVrWorksPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A3A6C] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.12em] text-white">
            VR Technology
          </p>
          <h1 className="mb-3.5 max-w-[640px] text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Tour homes before you leave the sofa.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-white/70">
            Full 360° immersive tours on any device. No headset required just your browser.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse?vr=1"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#08519A] transition-colors hover:bg-blue-50"
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
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid gap-5 md:grid-cols-3">

            {/* No headset required */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                    <path d="M8 21h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 17v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.5"/>
                    <circle cx="12" cy="10" r="1" fill="white"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">No headset required</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Works on desktop, tablet, and mobile. Headsets enhance the experience but aren't needed to explore.</p>
              </CardContent>
            </Card>

            {/* True 360° exploration */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                    <path d="M2 12h20" stroke="white" strokeWidth="1.5"/>
                    <path d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" stroke="white" strokeWidth="1.5"/>
                    <path d="M3.5 7.5h17M3.5 16.5h17" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">True 360° exploration</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Pause and look in every direction. Inspect details at your own pace with no time pressure.</p>
              </CardContent>
            </Card>

            {/* Floor plans in-tour */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.8"/>
                    <path d="M3 12h18" stroke="white" strokeWidth="1.5"/>
                    <path d="M12 3v18" stroke="white" strokeWidth="1.5"/>
                    <path d="M7 7h2M15 15h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="7" cy="16" r="1" fill="white"/>
                    <circle cx="17" cy="7" r="1" fill="white"/>
                  </svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">Floor plans in-tour</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">Dimensions overlay as you walk each room so you know whether your furniture will actually fit.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ── CONTROLS GUIDE ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0f6ff] via-white to-[#e8f0fe] py-14 sm:py-20">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -right-16 top-8 h-[280px] w-[280px] rounded-full bg-[#08519A]/[.07] blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-8 h-[220px] w-[220px] rounded-full bg-[#08519A]/[.05] blur-3xl" />

        <div className="relative mx-auto max-w-[1800px] px-5">
          {/* Section header */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#08519A] shadow-lg shadow-[#08519A]/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18v-6M8 14l4 4 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/>
                <path d="M8 8h2M14 8h2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Controls
            </p>
            <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-gray-900">
              Simple to navigate on any device
            </h2>
            <p className="mx-auto max-w-[520px] text-[15px] leading-relaxed text-gray-500">
              Whether you&apos;re on a phone, tablet, laptop, or VR headset — touring a property is effortless.
            </p>
          </div>

          {/* Device cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Desktop */}
            <div className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-md shadow-gray-200/50 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#08519A]/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A] shadow-md shadow-[#08519A]/25 transition-transform duration-300 group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                  <path d="M8 21h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M12 17v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[16px] font-bold text-gray-900">Desktop</h3>
              <ul className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-gray-500">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">1</span>
                  Click &amp; drag to look around 360°
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">2</span>
                  Pause / play to freeze any area
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">3</span>
                  Reset view if you lose bearings
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">4</span>
                  Switch VR, photos &amp; floorplan tabs
                </li>
              </ul>
            </div>

            {/* Tablet */}
            <div className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-md shadow-gray-200/50 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#08519A]/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A] shadow-md shadow-[#08519A]/25 transition-transform duration-300 group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="2" width="16" height="20" rx="2.5" stroke="white" strokeWidth="1.8"/>
                  <path d="M10 19h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[16px] font-bold text-gray-900">Tablet</h3>
              <ul className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-gray-500">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">1</span>
                  Swipe to pan in every direction
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">2</span>
                  Pinch to zoom into details
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">3</span>
                  Rotate device for wider view
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">4</span>
                  Tap hotspots to move between rooms
                </li>
              </ul>
            </div>

            {/* Mobile */}
            <div className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-md shadow-gray-200/50 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#08519A]/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A] shadow-md shadow-[#08519A]/25 transition-transform duration-300 group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
                  <path d="M10 19h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[16px] font-bold text-gray-900">Mobile</h3>
              <ul className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-gray-500">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">1</span>
                  Swipe to explore every room
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">2</span>
                  Tap pause to examine closely
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">3</span>
                  Tilt phone for gyroscope mode
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">4</span>
                  Save listings to revisit later
                </li>
              </ul>
            </div>

            {/* VR Headset */}
            <div className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-md shadow-gray-200/50 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#08519A]/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A] shadow-md shadow-[#08519A]/25 transition-transform duration-300 group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="10" rx="3" stroke="white" strokeWidth="1.8"/>
                  <circle cx="8.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                  <circle cx="15.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                  <path d="M1 10v4M23 10v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-3 text-[16px] font-bold text-gray-900">VR headset</h3>
              <ul className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-gray-500">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">1</span>
                  Look around naturally with head tracking
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">2</span>
                  Point &amp; click to navigate rooms
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">3</span>
                  True-to-scale room proportions
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08519A]/10 text-[10px] font-bold text-[#08519A]">4</span>
                  Most immersive experience available
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHAT VR-FIRST MEANS ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-14 sm:py-20">
        {/* Subtle decorative circles */}
        <div className="pointer-events-none absolute -right-20 top-10 h-[300px] w-[300px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-[250px] w-[250px] rounded-full bg-indigo-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1800px] px-5">
          {/* Header with icon at start */}
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#08519A] shadow-lg shadow-[#08519A]/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="7" width="20" height="10" rx="3" stroke="white" strokeWidth="1.8"/>
                <circle cx="8.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="15.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                <path d="M1 10v4M23 10v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="mb-0.5 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A] !important">
                VR-first
              </p>
              <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-[#08519A] !important">
                What &quot;VR-first&quot; actually means
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Explanation card */}
            <div className="rounded-2xl border-l-4 border-l-[#08519A] bg-white p-8 shadow-md shadow-gray-200/60 transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08519A]/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#08519A" strokeWidth="1.8"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="17" r="1" fill="#08519A"/>
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">How it works</h3>
              </div>
              <p className="mb-4 text-[15px] leading-[1.8] text-gray-600">
                On VBYM, the VR tour is the primary way to understand a property&apos;s layout,
                flow, and feel. Photos and floorplans are still available but the immersive
                tour is what helps buyers decide whether a physical viewing is actually worth
                their time.
              </p>
              <p className="mb-4 text-[15px] leading-[1.8] text-gray-600">
                The result is fewer mismatched viewings, more considered enquiries, and a
                better experience for everyone involved.
              </p>
              <p className="text-[15px] leading-[1.8] text-gray-600">
                Every tour is hosted on VBYM with a consistent, professional presentation
                so buyers always know what to expect, regardless of which agency listed the property.
              </p>
            </div>

            {/* Feature chips card */}
            <div className="flex flex-col justify-center rounded-2xl border-l-4 border-l-[#08519A] bg-white p-8 shadow-md shadow-gray-200/60 transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08519A]/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="#08519A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">What this delivers</h3>
              </div>
              <p className="mb-5 text-[14px] text-gray-500">For buyers and agents alike</p>
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
                    className="rounded-full border border-[#08519A]/15 bg-[#08519A]/[.06] px-4 py-2 text-[13px] font-semibold text-[#08519A] transition-all hover:bg-[#08519A] hover:text-white"
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
        <div className="mx-auto max-w-[1800px] px-5 text-center">
          <h2 className="mb-3 text-[clamp(22px,3vw,36px)] font-extrabold leading-[1.15] tracking-tight text-white">
            Ready to explore in VR?
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/75">
            Browse VR-enabled homes and shortlist with confidence from your sofa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/browse?vr=1"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-[#08519A] transition-colors hover:bg-blue-50"
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
