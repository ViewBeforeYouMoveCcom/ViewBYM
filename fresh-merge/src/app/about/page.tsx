import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A3A6C] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.12em] text-white/70">
            About VBYM
          </p>
          <h1 className="mb-3.5 max-w-[620px] text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Building a better way to find your home.
          </h1>
          <p className="mb-7 max-w-[500px] text-[15px] leading-relaxed text-white/70">
            View Before You Move is a VR-first UK property portal that helps
            buyers and tenants explore homes with real confidence before booking
            a single viewing.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Browse properties
            </Link>
            <Link
              href="/for-agents"
              className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-white/10"
            >
              For agents
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-8 sm:py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { num: "2,400+", label: "Properties with VR" },
              { num: "180+",   label: "Agency partners" },
              { num: "68%",    label: "Fewer wasted viewings" },
              { num: "2026",   label: "Founded" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[24px] font-extrabold leading-none tracking-tight text-gray-900 sm:text-[32px]">
                  {s.num}
                </p>
                <p className="mt-1.5 text-[13px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ───────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            What we stand for
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            Built on clear principles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Mission",
                text: "Reduce friction in property discovery by putting calm, clear VR tours first — every listing, every time.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="1" fill="white"/>
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Why VR-first",
                text: "Buyers evaluate space, flow, and light before they book. Fewer surprises means better-matched viewings and faster decisions.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="10" rx="3" stroke="white" strokeWidth="1.8"/>
                    <circle cx="8.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                    <circle cx="15.5" cy="12" r="2.5" stroke="white" strokeWidth="1.5"/>
                    <path d="M1 10v4M23 10v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Privacy",
                text: "Your data stays yours. We never sell personal information and provide simple, transparent privacy controls.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                title: "Trusted",
                text: "Consistent, agent-grade presentation across every listing builds trust for buyers and agencies alike.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#08519A]">
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900">{item.title}</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE FIT IN ────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Our role
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            How we fit in
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-[17px] font-bold text-gray-900">
                  VBYM is not an estate agency.
                </h3>
                <p className="mb-4 text-[14px] leading-relaxed text-gray-500">
                  Agents remain responsible for their listings, pricing, legal obligations, and
                  arranging viewings. View Before You Move provides the VR-first portal layer:
                  the hosting, presentation, and discovery experience that connects buyers with
                  the right agents.
                </p>
                <p className="text-[14px] leading-relaxed text-gray-500">
                  Every enquiry and transaction remains directly between the buyer and the
                  agent or agency.
                </p>
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  "Agents list properties with VR tours on VBYM.",
                  "Buyers explore in 360° from any device, at any time.",
                  "Qualified buyers contact the agent directly.",
                  "In-person viewings happen with real intent.",
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#08519A] text-[13px] font-bold text-white">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-600">{label}</p>
                  </div>
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
            Ready to find your next home?
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/75">
            Browse VR-enabled properties and shortlist with real confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/browse"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Browse properties
            </Link>
            <Link
              href="/for-agents"
              className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-white/10"
            >
              List with us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
