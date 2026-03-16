import Link from "next/link";

export default function ForAgentsPage() {
  return (
    <div className="bg-white">
      {/* Dark Hero */}
      <section className="bg-[#1A3A6C] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[.1em] text-blue-300">
            For estate agents
          </p>
          <h1 className="mb-4 max-w-[640px] text-[clamp(32px,4.5vw,56px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Fewer wasted viewings. More committed buyers.
          </h1>
          <p className="mb-7 max-w-[500px] text-[16px] leading-relaxed text-white/75">
            When buyers have already walked your property in VR, every viewing request is warmer — and every offer comes faster.
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
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Benefits
          </p>
          <h2 className="mb-2 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            What agencies get
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-gray-500">
            Practical outcomes — delivered in a calm, premium format.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Reduce wasted viewings */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="1.8"/>
                  <path d="M15 9l-3 3-2-2-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9h-3v3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Reduce wasted viewings</p>
              <p className="text-[14px] leading-relaxed text-gray-500">Buyers confirm layout and flow before booking in-person, so every viewing is already qualified.</p>
            </div>

            {/* Premium presentation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-amber-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.2"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Premium presentation</p>
              <p className="text-[14px] leading-relaxed text-gray-500">A consistent, calm listing experience that reflects your brand — not a generic portal page.</p>
            </div>

            {/* Faster shortlisting */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 shadow-md shadow-violet-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.15"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Faster shortlisting</p>
              <p className="text-[14px] leading-relaxed text-gray-500">Serious buyers shortlist with confidence and clarity, cutting the time from listing to offer.</p>
            </div>

            {/* Control distribution */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-sky-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 shadow-md shadow-sky-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8"/>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Control distribution</p>
              <p className="text-[14px] leading-relaxed text-gray-500">Full tours live on VBYM. Share links across channels without losing quality or presentation control.</p>
            </div>

            {/* Cleaner leads */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                  <path d="M19 8l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Cleaner leads</p>
              <p className="text-[14px] leading-relaxed text-gray-500">Encourage enquiries only after VR engagement — so every lead has genuine intent behind it.</p>
            </div>

            {/* Ready to scale */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-rose-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-700 shadow-md shadow-rose-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="mb-1.5 text-[15px] font-semibold text-gray-900">Ready to scale</p>
              <p className="text-[14px] leading-relaxed text-gray-500">A portal-grade foundation designed to grow across branches and regions without extra friction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Process
          </p>
          <h2 className="mb-8 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
            A simple 4-step workflow
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Capture",
                text: "Film your property using our short filming guide. No specialist equipment required.",
              },
              {
                step: "2",
                title: "Upload",
                text: "Send your footage securely to VBYM through your agent portal.",
              },
              {
                step: "3",
                title: "Publish",
                text: "We process and host the VR tour — then attach it to your listing automatically.",
              },
              {
                step: "4",
                title: "Convert",
                text: "Share listing links across channels to drive higher-intent viewing requests and faster offers.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-[14px] font-bold text-blue-700">
                  {s.step}
                </div>
                <p className="mb-1.5 text-[15px] font-semibold text-gray-900">{s.title}</p>
                <p className="text-[14px] leading-relaxed text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controlled distribution */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A3A6C] via-[#1E4A82] to-[#162F58] py-10 sm:py-16">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-5">
          <div className="grid items-center gap-8 lg:gap-14 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.12em] text-blue-300">
                Distribution
              </p>
              <h2 className="mb-4 text-[clamp(22px,2.8vw,32px)] font-bold tracking-tight text-white">
                Your brand, in control
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-white/70">
                Full immersive tours remain hosted on VBYM. You get a shareable link that works everywhere — social, email, portals — without sending raw files or losing control of the experience.
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
              <p className="mb-5 text-[13px] font-bold uppercase tracking-[.1em] text-blue-300">
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
                    className={`rounded-xl border border-white/10 border-l-[3px] ${item.accent} bg-white/[.06] p-4 transition-all hover:bg-white/[.12]`}
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
      <div className="border-y border-blue-100 bg-blue-50 py-4 text-center text-[14px] text-blue-700">
        Already an agent?{" "}
        <Link href="/agent" className="font-semibold hover:underline">
          Sign in to your portal →
        </Link>
      </div>
    </div>
  );
}
