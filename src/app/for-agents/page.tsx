import Link from "next/link";

export default function ForAgentsPage() {
  return (
    <div className="bg-white">
      {/* Dark Hero */}
      <section className="bg-[#1A3A6C] py-20">
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
              className="rounded-lg border border-white/25 px-6 py-3 text-[15px] font-semibold text-white/85 transition-colors hover:bg-white/10"
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
      <section className="bg-gray-50 py-14">
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

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "📉",
                title: "Reduce wasted viewings",
                text: "Buyers confirm layout and flow before booking in-person, so every viewing is already qualified.",
              },
              {
                emoji: "🏆",
                title: "Premium presentation",
                text: "A consistent, calm listing experience that reflects your brand — not a generic portal page.",
              },
              {
                emoji: "⚡",
                title: "Faster shortlisting",
                text: "Serious buyers shortlist with confidence and clarity, cutting the time from listing to offer.",
              },
              {
                emoji: "🔗",
                title: "Control distribution",
                text: "Full tours live on VBYM. Share links across channels without losing quality or presentation control.",
              },
              {
                emoji: "✅",
                title: "Cleaner leads",
                text: "Encourage enquiries only after VR engagement — so every lead has genuine intent behind it.",
              },
              {
                emoji: "📈",
                title: "Ready to scale",
                text: "A portal-grade foundation designed to grow across branches and regions without extra friction.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[22px]">
                  {item.emoji}
                </div>
                <p className="mb-1.5 text-[15px] font-semibold text-gray-900">{item.title}</p>
                <p className="text-[14px] leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
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
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
                Distribution
              </p>
              <h2 className="mb-4 text-[clamp(20px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
                Your brand, in control
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-gray-500">
                Full immersive tours remain hosted on VBYM. You get a shareable link that works everywhere — social, email, portals — without sending raw files or losing control of the experience.
              </p>
              <p className="mb-6 text-[15px] leading-relaxed text-gray-500">
                Every listing page carries your agency identity. Buyers see your brand, not a generic portal template.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Share links, not files",
                  "Consistent presentation",
                  "Higher-intent enquiries",
                  "Agency-branded pages",
                  "No viewer downloads",
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

            {/* Right — At a glance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="mb-4 text-[13px] font-bold uppercase tracking-[.08em] text-gray-400">
                At a glance
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "VR-first listings",
                    text: "A calm, consistent presentation layer across every property.",
                  },
                  {
                    title: "Control distribution",
                    text: "Full tours live on VBYM — share links without losing control.",
                  },
                  {
                    title: "Higher intent leads",
                    text: "Encourage viewing requests only after buyers understand layout and flow.",
                  },
                  {
                    title: "No extra portals",
                    text: "VBYM works alongside your existing portals — not instead of them.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <p className="text-[14px] font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href="/agents/request-access"
                  className="inline-flex rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Request access
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
