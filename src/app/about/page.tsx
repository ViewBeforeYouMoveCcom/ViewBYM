import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-600">
            About VBYM
          </p>
          <h1 className="mb-3.5 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Building a better way to find your home.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-gray-500">
            View Before You Move is a VR-first UK property portal that helps buyers and tenants
            explore homes with confidence — before booking a single viewing.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Browse properties
            </Link>
            <Link
              href="/for-agents"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
            >
              For agents
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { num: "2,400+", label: "Properties with VR" },
              { num: "180+", label: "Agency partners" },
              { num: "68%", label: "Fewer wasted viewings" },
              { num: "2026", label: "Founded" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[32px] font-extrabold leading-none tracking-tight text-gray-900">
                  {s.num}
                </div>
                <div className="mt-1.5 text-[13px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION CARDS ────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-600">
            What we stand for
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            Built on clear principles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                emoji: "🎯",
                title: "Mission",
                text: "Reduce friction in property discovery by putting calm, clear VR tours first — every listing, every time.",
              },
              {
                emoji: "◉",
                title: "Why VR-first",
                text: "Buyers evaluate space, flow, and light before they book. Fewer surprises means better-matched viewings.",
              },
              {
                emoji: "🔒",
                title: "Privacy",
                text: "Your data stays yours. We never sell personal information and provide simple, transparent privacy controls.",
              },
              {
                emoji: "⭐",
                title: "Trusted",
                text: "Consistent, agent-grade presentation across every listing builds trust for buyers and agencies alike.",
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

      {/* ── HOW WE FIT IN ────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-600">
            Our role
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            How we fit in
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-[18px] font-bold text-gray-900">
                  VBYM is not an estate agency.
                </h3>
                <p className="mb-4 text-[15px] leading-relaxed text-gray-500">
                  Agents remain responsible for their listings, pricing, legal obligations, and
                  arranging viewings. View Before You Move provides the VR-first portal layer —
                  the hosting, presentation, and discovery experience that connects buyers with
                  the right agents.
                </p>
                <p className="text-[15px] leading-relaxed text-gray-500">
                  Think of us as the display window, not the shop. Every inquiry and transaction
                  remains between you and the agent or agency.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { step: "1", label: "Agents list properties with VR tours on VBYM" },
                  { step: "2", label: "Buyers explore in 360° from any device" },
                  { step: "3", label: "Qualified buyers contact the agent directly" },
                  { step: "4", label: "In-person viewings happen with real intent" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-[14px] font-bold text-blue-700">
                      {s.step}
                    </div>
                    <p className="text-[14px] text-gray-500">{s.label}</p>
                  </div>
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
            Ready to find your next home?
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/75">
            Browse VR-enabled properties and shortlist with real confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/browse"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1A3A6C] transition-colors hover:bg-gray-100"
            >
              Browse properties
            </Link>
            <Link
              href="/for-agents"
              className="rounded-lg border border-white/30 bg-transparent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              List with us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
