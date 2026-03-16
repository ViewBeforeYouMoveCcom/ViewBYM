import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowVrWorksPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            VR Technology
          </p>
          <h1 className="mb-3.5 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Tour homes before you leave the sofa.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-gray-500">
            Full 360° immersive tours on any device. No headset required — just your browser.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse?vr=1"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Browse VR listings
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
            >
              FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3-FEATURE STRIP ──────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                emoji: "🖥️",
                title: "No headset required",
                text: "Works on desktop, tablet, and mobile. Headsets enhance the experience but aren't needed to explore.",
              },
              {
                emoji: "◉",
                title: "True 360° exploration",
                text: "Pause and look in every direction. Inspect details at your own pace with no time pressure.",
              },
              {
                emoji: "📐",
                title: "Floor plans in-tour",
                text: "Dimensions overlay as you walk each room — so you know whether your furniture will actually fit.",
              },
            ].map((item) => (
              <Card key={item.title} className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[22px]">
                    {item.emoji}
                  </div>
                  <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">{item.title}</h3>
                  <p className="text-[14px] leading-relaxed text-gray-500">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTROLS GUIDE ───────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Controls
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            Simple to navigate on any device
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">

            {/* Desktop */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[22px]">
                🖱️
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[22px]">
                📱
              </div>
              <h3 className="mb-3 text-[15px] font-bold text-gray-900">Mobile & tablet</h3>
              <ul className="flex flex-col gap-2.5 text-[14px] text-gray-500">
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Swipe to look around in every direction
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Tap pause to examine a room closely
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Rotate your device for a wider perspective
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-700">•</span>
                  Save listings and revisit on any device later
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHAT VR-FIRST MEANS ──────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            VR-first
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            What "VR-first" actually means
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
      <section className="bg-[#1A3A6C] py-14">
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
              className="rounded-lg border border-white/25 bg-transparent px-5 py-2.5 text-[14px] font-semibold text-white/85 transition-colors hover:bg-white/10"
            >
              Visit FAQs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
