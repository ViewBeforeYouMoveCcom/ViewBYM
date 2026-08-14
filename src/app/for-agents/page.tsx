import Link from "next/link";
import AgentBenefitsCarousel from "@/components/AgentBenefitsCarousel";

export default function ForAgentsPage() {
  return (
    <div className="bg-white">
      {/* Dark Hero */}
      <section className="bg-[#1A3A6C] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[.1em] text-white">
            For estate agents
          </p>
          <h1 className="mb-4 max-w-[640px] text-[clamp(32px,4.5vw,56px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Fewer wasted viewings. More committed buyers.
          </h1>
          <p className="mb-5 max-w-[500px] text-[16px] leading-relaxed text-white/75">
            When buyers have already walked your property in VR, every viewing request is warmer and every offer comes faster.
          </p>

          <p className="mb-7 max-w-[500px] rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-[13px] leading-relaxed text-blue-100">
            We are currently inviting a limited number of founder agencies to help test and refine the end-to-end service.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/agents/request-access"
              className="rounded-lg bg-white px-6 py-3 text-[15px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Join the Founder Pilot
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/25 px-6 py-3 text-[15px] font-semibold !text-white transition-colors hover:bg-white/10"
            >
              Speak to the team
            </Link>
          </div>

          {/* Metric pills */}
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              "68% fewer viewings",
              "3.2× faster to offer",
              "180+ partner agencies",
            ].map((metric) => (
              <span
                key={metric}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Benefits
          </p>
          <h2 className="mb-2 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-[#08519A]">
            What agencies get
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-gray-500">
            Practical outcomes delivered in a calm, premium format.
          </p>

          <AgentBenefitsCarousel />
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Pricing
            </p>
            <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-[#08519A]">
              Two ways to list
            </h2>
            <p className="mx-auto max-w-[540px] text-[15px] leading-relaxed text-gray-500">
              Bring your own media for free, or let our team handle the entire shoot for you.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 sm:p-8">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[.1em] text-gray-500">
                Free
              </p>
              <h3 className="mb-3 text-[20px] font-bold text-gray-900">Free listing layer</h3>
              <p className="mb-5 text-[14px] leading-relaxed text-gray-600">
                For agencies that already have their own property media.
              </p>
              <ul className="space-y-3">
                {[
                  "Qualifying existing agency stock",
                  "Existing media supplied or imported",
                  "No media pack included unless ordered",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Paid tier */}
            <div className="relative rounded-2xl border-2 border-[#08519A] bg-white p-7 shadow-lg shadow-[#08519A]/10 sm:p-8">
              <span className="absolute -top-3 left-7 rounded-full bg-[#08519A] px-3 py-1 text-[11px] font-bold text-white">
                Enhanced media
              </span>
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
                Paid
              </p>
              <h3 className="mb-3 text-[20px] font-bold text-gray-900">Enhanced-media layer</h3>
              <p className="mb-5 text-[14px] leading-relaxed text-gray-600">
                Our managed media team handles the entire shoot for you, from booking to draft.
              </p>
              <ul className="space-y-3">
                {[
                  "Appointment booking",
                  "Media collection",
                  "Immersive 360° tour",
                  "MP4 walkthrough",
                  "Photos",
                  "Floor plan",
                  "Draft property description",
                  "Agent approval before publication",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#08519A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-gradient-to-b from-white to-gray-50/80 py-14 sm:py-20">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-12 text-center">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Process
            </p>
            <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-[#08519A]">
              A simple 4-step workflow
            </h2>
            <p className="mx-auto max-w-[480px] text-[15px] leading-relaxed text-gray-500">
              From filming to offer a streamlined process designed for busy agents.
            </p>
          </div>

          <div className="relative">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Capture",
                  text: "Film your property using our short filming guide. No specialist equipment required.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                      <circle cx="12" cy="10" r="3.5" stroke="white" strokeWidth="1.8"/>
                      <circle cx="12" cy="10" r="1" fill="white"/>
                      <path d="M17 6h1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 20h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M12 17v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "Upload",
                  text: "Send your footage securely to VBYM through your agent portal.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 11l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 16.7A4.5 4.5 0 0017.5 8h-1.13A7 7 0 104 14.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "Publish",
                  text: "We process and host the VR tour — then attach it to your listing automatically.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                      <path d="M2 12h20" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" stroke="white" strokeWidth="1.5"/>
                      <path d="M3.5 7.5h17M3.5 16.5h17" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                    </svg>
                  ),
                },
                {
                  step: "4",
                  title: "Convert",
                  text: "Share listing links across channels to drive higher-intent viewing requests and faster offers.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
              ].map((s, i, arr) => (
                <div key={s.step} className="relative">
                  <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#08519A]/20 hover:shadow-[0_20px_40px_-15px_rgba(8,81,154,0.25)]">
                    {/* Icon */}
                    <div className="relative z-10 mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B63BC] to-[#08519A] shadow-lg shadow-[#08519A]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {s.icon}
                    </div>

                    <span className="relative z-10 mb-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#08519A]/10 text-[11px] font-bold text-[#08519A]">
                      {s.step}
                    </span>
                    <p className="relative z-10 mb-2 text-[16px] font-bold text-gray-900">{s.title}</p>
                    <p className="relative z-10 text-[13.5px] leading-relaxed text-gray-500">{s.text}</p>
                  </div>

                  {/* Connector arrow (desktop only, between cards) */}
                  {i < arr.length - 1 && (
                    <div className="pointer-events-none absolute -right-[27px] top-1/2 z-10 hidden -translate-y-1/2 md:block">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#08519A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced-media workflow */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mb-14 text-center">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Enhanced-media workflow
            </p>
            <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-[#08519A]">
              How the managed service works
            </h2>
            <p className="mx-auto max-w-[540px] text-[15px] leading-relaxed text-gray-500">
              From ordering to publication, handled end-to-end by our team.
            </p>
          </div>

          <div className="relative mx-auto max-w-[760px]">
            {/* Connecting line */}
            <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#08519A]/25 via-[#08519A]/25 to-transparent sm:left-[31px]" />

            <div className="space-y-3">
              {[
                {
                  title: "Order",
                  text: "You request the enhanced-media package for a listing.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="9" y="3" width="6" height="4" rx="1" stroke="white" strokeWidth="1.8"/>
                      <path d="M8 12h8M8 16h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Book appointment",
                  text: "We schedule a convenient time to visit the property.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="white" strokeWidth="1.8"/>
                      <path d="M3 10h18M8 3v4M16 3v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      <circle cx="12" cy="15" r="2" stroke="white" strokeWidth="1.6"/>
                    </svg>
                  ),
                },
                {
                  title: "Collect media",
                  text: "Our team captures 360° footage, walkthrough video, and photos on site.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="6" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                      <circle cx="12" cy="13" r="3.5" stroke="white" strokeWidth="1.8"/>
                      <path d="M8 6l1.5-2.5h5L16 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Upload",
                  text: "Raw footage is securely uploaded to our processing pipeline.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 11l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 16.7A4.5 4.5 0 0017.5 8h-1.13A7 7 0 104 14.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Process",
                  text: "Media is edited, colour-corrected, and prepared for the listing.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.4.55.7.7a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Create draft",
                  text: "A draft listing is assembled with all media and a written description.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                      <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M9 15l1.5-.4L15 10.1a1.2 1.2 0 000-1.7l-.4-.4a1.2 1.2 0 00-1.7 0L8.4 12.5 8 14z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Agent approval",
                  text: "You review the draft before anything goes live.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l7 3v6c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  title: "Publish",
                  text: "Once approved, the listing goes live on VBYM automatically.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                      <path d="M2 12h20" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  ),
                },
                {
                  title: "Return standard media assets",
                  text: "We hand back your photos, floor plan, and other standard assets to use anywhere.",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 8l-9-5-9 5 9 5 9-5z" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
                      <path d="M3 8v8l9 5 9-5V8" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
                      <path d="M12 13v8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <div key={s.title} className="group relative flex items-start gap-4 sm:gap-5">
                  {/* Icon node */}
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#08519A] shadow-md shadow-[#08519A]/20 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
                    {s.icon}
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-50 bg-white text-[11px] font-extrabold text-[#08519A] shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  {/* Text card */}
                  <div className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <p className="text-[15px] font-bold text-gray-900">{s.title}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-gray-500">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     {/* Controlled distribution */}
      <section className="relative overflow-hidden bg-[#1A3A6C] py-10 sm:py-16">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1800px] px-5">
          <div className="grid items-center gap-8 lg:gap-14 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.12em] text-white">
                Distribution
              </p>
              <h2 className="mb-4 text-[clamp(22px,2.8vw,32px)] font-bold tracking-tight text-white">
                Your brand, in control
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-white/70">
                Full immersive tours remain hosted on VBYM. You get a shareable link that works everywhere social, email, portals without sending raw files or losing control of the experience.
              </p>
              <p className="mb-7 text-[15px] leading-relaxed text-white/70">
                Every listing page carries your agency identity. Buyers see your brand, not a generic portal template.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Share links, not files",
                  "Consistent presentation",
                  "Higher-intent enquiries",
                  "Agency-branded pages",
                  "No viewer downloads",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — At a glance */}
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-7 shadow-2xl shadow-black/20 backdrop-blur-lg ring-1 ring-white/5">
              <p className="mb-5 text-[13px] font-bold uppercase tracking-[.1em] text-white">
                At a glance
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "VR-first listings",
                    text: "A calm, consistent presentation layer across every property.",
                    accent: "border-l-blue-400",
                  },
                  {
                    title: "Control distribution",
                    text: "Full tours live on VBYM — share links without losing control.",
                    accent: "border-l-violet-400",
                  },
                  {
                    title: "Higher intent leads",
                    text: "Encourage viewing requests only after buyers understand layout and flow.",
                    accent: "border-l-emerald-400",
                  },
                  {
                    title: "No extra portals",
                    text: "VBYM works alongside your existing portals — not instead of them.",
                    accent: "border-l-amber-400",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-xl border border-white/10 border-l-[3px] border-l-[#08519A] bg-white/[.06] p-4 transition-all hover:bg-white/[.12]`}
                  >
                    <p className="text-[14px] font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-white/60">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/agents/request-access"
                  className="inline-flex rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
                >
                  Join the Founder Pilot
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex rounded-lg border border-white/20 px-5 py-2.5 text-[14px] font-semibold !text-white/80 transition-colors hover:bg-white/10"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media rights */}
      <section className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="mx-auto max-w-[820px] rounded-2xl border border-gray-200 bg-gray-50 p-7 sm:p-9">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Media rights
            </p>
            <h2 className="mb-4 text-[20px] font-bold text-gray-900">Who owns what</h2>
            <p className="mb-4 text-[14px] leading-relaxed text-gray-600">
              View Before You Move retains legal ownership of all media it creates. Following full payment, the estate agent receives a perpetual, unrestricted licence to use the approved standard media-pack assets across property portals, its website, social media, brochures and other property-marketing channels. The complete immersive 360° experience and raw source material remain controlled by View Before You Move.
            </p>
            <p className="text-[13px] leading-relaxed text-gray-500">
              <span className="font-semibold text-gray-700">Standard licensed assets</span> = processed photographs, MP4 walkthrough, standard floor plan, approved property description.
            </p>
          </div>
        </div>
      </section>

      {/* Already an agent CTA strip */}
      <div className="border-y border-blue-100 bg-blue-50 py-4 text-center text-[14px] text-[#08519A]">
        Already an agent?{" "}
        <Link href="/agents/login" className="font-semibold text-[#08519A] hover:underline">
          Sign in to your portal →
        </Link>
      </div>
    </div>
  );
}
