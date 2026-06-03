import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import BenefitsCarousel from "@/components/BenefitsCarousel";
import HideWhenAuthed from "@/components/HideWhenAuthed";
import OAuthCodeHandler from "@/components/OAuthCodeHandler";

import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import SearchWidget from "@/components/SearchWidget";
import { faqs } from "@/data/faqs";
import { getProperties } from "@/data/properties";

export default async function HomePage() {
  const properties = await getProperties();
  const featured = properties.filter((p) => p.featured).slice(0, 3);
  // Temporary fix: fill 3 slots with featured first, then pad with other properties
  const remaining = properties.filter((p) => !p.featured);
  const displayProperties = [...featured, ...remaining].slice(0, 3);

  return (
    <div className="bg-white font-sans">
      <Suspense fallback={null}>
        <OAuthCodeHandler />
      </Suspense>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[420px] sm:min-h-[520px] flex-col justify-between overflow-hidden">
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85&auto=format&fit=crop"
            alt="Beautiful home"
            fill
            className="object-cover object-[center_60%] filter blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/52 via-black/22 to-black/5" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 pb-10 pt-16">
          <h1 className="mb-2.5 max-w-[560px] text-[clamp(28px,3.8vw,48px)] font-extrabold leading-[1.12] tracking-tight text-white">
            Find your next home.<br />Walk it in VR first.
          </h1>
          <p className="mb-7 max-w-[440px] text-[16px] leading-relaxed text-white/90">
            Browse thousands of properties and take an immersive VR tour before you book a single viewing.
          </p>

          {/* Search card */}
          <SearchWidget />
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-white/10 bg-black/35 backdrop-blur-md">
          <div className="mx-auto max-w-[1800px] px-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 sm:divide-x divide-white/10">
              {[
                { num: "2,400+", label: "Properties with VR" },
                { num: "180", label: "Partner agencies" },
                { num: "68%", label: "Fewer wasted viewings" },
                { num: "3.2×", label: "Faster to offer" },
              ].map((s) => (
                <div key={s.label} className="px-4 sm:px-5 py-3">
                  <div className="text-[16px] sm:text-[20px] font-extrabold leading-none tracking-tight text-white">
                    {s.num}
                  </div>
                  <div className="mt-0.5 text-[12px] text-white/75">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-[#08519A]">
                Featured Properties
              </h2>
              <p className="mt-1 text-[14px] text-gray-500">
                Handpicked homes with VR tours ready to explore right now.
              </p>
            </div>
            <Link
              href="/browse"
              className="rounded-lg  px-4 py-2.5 text-[14px] font-semibold border border-gray-300 bg-white text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50"
            >
              View all properties
            </Link>
          </div>

          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {displayProperties.map((property) => (
              <PropertyCard key={property.id} property={property} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY AREA ────────────────────────────────────── */}
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-[#08519A]">
                Browse by area
              </h2>
              <p className="mt-1 text-[14px] text-gray-500">
                Find VR-enabled listings in the UK's most popular locations.
              </p>
            </div>
            <Link
              href="/areas"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50"
            >
              All areas
            </Link>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4" style={{ gridAutoRows: "minmax(140px, 1fr)" }}>
            {/* Large tile — London */}
            <Link href="/browse?location=London" className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=900&q=80&auto=format&fit=crop"
                alt="London"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="text-[26px] font-bold text-white drop-shadow">London</div>
                <div className="mt-0.5 text-[12px] text-white/85">1,840 properties · 620 with VR</div>
              </div>
              <div className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur-sm">
                620 VR tours
              </div>
            </Link>

            {/* Small tiles */}
            {[
              { name: "Manchester", count: "340 with VR", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&auto=format&fit=crop" },
              { name: "Bristol", count: "185 with VR", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format&fit=crop" },
              { name: "Edinburgh", count: "210 with VR", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop" },
              { name: "Leeds", count: "160 with VR", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80&auto=format&fit=crop" },
            ].map((area) => (
              <Link key={area.name} href={`/browse?location=${area.name}`} className="group relative overflow-hidden rounded-2xl cursor-pointer">
                <Image
                  src={area.img}
                  alt={area.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
                  <div className="text-[18px] font-bold text-white drop-shadow">{area.name}</div>
                  <div className="mt-0.5 text-[11px] text-white/85">{area.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid items-stretch gap-8 lg:gap-14 lg:grid-cols-2">
            {/* Image panel */}
            <div className="relative min-h-[280px] sm:min-h-[360px] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop"
                alt="Living room VR tour"
                fill
                className="object-cover"
              />
              {/* In-tour badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-start gap-3 rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  ◉
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-gray-900">You&apos;re touring 6 Radnor Walk</div>
                  <div className="mt-0.5 text-[12px] text-gray-500">Living room · Room 1 of 5</div>
                  {/* Progress */}
                  <div className="mt-2 flex gap-1">
                    {[true, true, false, false, false].map((done, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${done ? "bg-[#08519A]" : "bg-gray-200"} ${i === 1 ? "opacity-50" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="mb-2 text-[clamp(22px,2.8vw,32px)] font-bold tracking-tight text-[#08519A] leading-tight">
                  Tour homes before you leave your sofa
                </h2>
                <p className="mb-5 text-[15px] leading-relaxed text-gray-500">
                  Walk every room in immersive VR, then decide if it&apos;s worth a visit. No more surprises on arrival.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  {
                    n: "1",
                    title: "Search and filter",
                    text: "Browse by location, price, and property type. Filter to VR-ready listings whenever you like.",
                  },
                  {
                    n: "2",
                    title: "Take the VR tour",
                    text: "Walk every room on desktop, mobile, or a headset. At your own pace, any time of day.",
                  },
                  {
                    n: "3",
                    title: "Shortlist and contact",
                    text: "Save only what genuinely fits. Reach the agent only when you're ready to commit to a viewing.",
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-[#08519A] hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#08519A]/25 bg-[#08519A]/10 text-[14px] font-bold text-[#08519A]">
                      {step.n}
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold text-gray-900">{step.title}</div>
                      <div className="mt-0.5 text-[13.5px] leading-relaxed text-gray-500">{step.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-2.5">
                <Link
                  href="/how-vr-works"
                  className="rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]"
                >
                  How VR works
                </Link>
                <Link
                  href="/browse?vr=1"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50"
                >
                  Browse VR listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-8 text-center">
            <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-[#08519A]">
              Why buyers choose us
            </h2>
            <p className="mt-1 text-[14px] text-gray-500">
              Every decision we make is about saving you time and helping you choose with confidence.
            </p>
          </div>
          <BenefitsCarousel />
        </div>
      </section>



      {/* ── FOR AGENTS ───────────────────────────────────────── */}
      <section className="bg-[#1A3A6C]">
        <div className="mx-auto max-w-[1800px] px-5 py-10 sm:py-16">
          <div className="grid items-center gap-8 sm:gap-16 lg:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-3.5 text-[12px] font-bold uppercase tracking-[.1em] text-white">
                For estate agents
              </p>
              <h2 className="mb-3.5 text-[clamp(24px,3vw,38px)] font-bold leading-tight tracking-tight text-white">
                Fewer wasted viewings.<br />More committed buyers.
              </h2>
              <p className="mb-7 text-[15px] leading-relaxed text-white/75">
                When a buyer calls to book a viewing, they've already walked the property in VR. Every conversation starts warmer and closes faster.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/for-agents"
                  className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
                >
                  Agent overview
                </Link>
                <Link
                  href="/agents/request-access"
                  className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white/85 transition-colors hover:border-white/45 hover:bg-white/10"
                >
                  Request access
                </Link>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-2.5">
              {[
                { num: "68%", text: "Fewer unqualified viewings for partner agencies" },
                { num: "3.2×", text: "Faster time-to-offer on VR-listed properties" },
                { num: "180+", text: "Agency partners live on the platform today" },
              ].map((m) => (
                <div
                  key={m.num}
                  className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[.07] px-6 py-5 transition-colors hover:border-blue-300/35"
                >
                  <div className="min-w-[70px] sm:min-w-[88px] text-[22px] sm:text-[30px] font-extrabold leading-none tracking-tight text-white">
                    {m.num}
                  </div>
                  <div className="text-[13.5px] leading-snug text-white/75">{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-200 bg-gray-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-[#08519A]">
                Common questions
              </h2>
              <p className="mt-1 text-[14px] text-gray-500">Straight answers, no jargon.</p>
            </div>
            <Link
              href="/faq"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:bg-blue-50"
            >
              All FAQs
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {faqs.slice(0, 4).map((faq) => (
              <Card
                key={faq.id}
                className="rounded-xl border border-gray-200 bg-white"
              >
                <CardContent className="p-5">
                  <p className="mb-2 text-[14.5px] font-bold leading-snug text-gray-900">
                    {faq.question}
                  </p>
                  <p className="text-[13.5px] leading-relaxed text-gray-500">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <HideWhenAuthed>
      <section className="pb-14 pt-0 bg-white">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
            {/* Background image */}
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85&auto=format&fit=crop"
              alt="Beautiful home exterior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A3A6C]/90 via-[#1A3A6C]/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-start gap-6 p-6 sm:p-12">
              <div>
                <h2 className="mb-2 text-[clamp(22px,3vw,36px)] font-bold leading-tight tracking-tight text-white">
                  Ready to find your next home?
                </h2>
                <p className="text-[15px] text-white/70">
                  No account needed to browse. Create a free account to save listings and set alerts.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/browse"
                  className="rounded-lg bg-white px-6 py-3 text-[15px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
                >
                  Browse properties
                </Link>
                <Link
                  href="/account/signup"
                  className="rounded-lg border border-white/25 px-6 py-3 text-[15px] font-semibold !text-white transition-colors hover:border-white/45 hover:bg-white/10"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </HideWhenAuthed>

    </div>
  );
}
