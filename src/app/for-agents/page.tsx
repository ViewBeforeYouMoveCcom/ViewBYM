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
          <p className="mb-7 max-w-[500px] text-[16px] leading-relaxed text-white/75">
            When buyers have already walked your property in VR, every viewing request is warmer and every offer comes faster.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/agents/request-access"
              className="rounded-lg bg-white px-6 py-3 text-[15px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Request access
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

          {/* Connecting line (desktop only) */}
          <div className="relative">
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-[2px] bg-gradient-to-r from-[#08519A]/10 via-[#08519A]/30 to-[#08519A]/10 md:block" />

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
              ].map((s) => (
                <div
                  key={s.step}
                  className="group relative flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Icon container */}
                  <div className="relative z-10 mb-5 flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-[#08519A] shadow-lg shadow-[#08519A]/25 transition-transform duration-300 group-hover:scale-110">
                    {s.icon}
                  </div>
                  {/* Step badge */}
                  <span className="mb-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#08519A]/10 text-[11px] font-bold text-[#08519A]">
                    {s.step}
                  </span>
                  <p className="mb-2 text-[16px] font-bold text-gray-900">{s.title}</p>
                  <p className="text-[13.5px] leading-relaxed text-gray-500">{s.text}</p>
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
                  Request access
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
