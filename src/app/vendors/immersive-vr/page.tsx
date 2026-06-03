import Image from "next/image";
import Link from "next/link";

export default function VendorPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
          alt="Modern property interior ready for VR capture"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay with fade to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A6C]/90 via-[#1A3A6C]/75 to-[#1A3A6C]/40" />
        {/* Bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

        {/* Content */}
        <div className="relative mx-auto max-w-[1800px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.12em] text-white/70">
            Vendor capture service
          </p>
          <h1 className="mb-3.5 max-w-[620px] text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Professional VR capture, handled for you.
          </h1>
          <p className="mb-7 max-w-[500px] text-[15px] leading-relaxed text-white/80">
            We arrange an approved vendor to visit the property and produce a
            full immersive 360° tour. No equipment or technical knowledge
            required from you.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Speak to the team
            </Link>
            <Link
              href="/how-vr-works"
              className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-white/10"
            >
              How VR tours work
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            The process
          </p>
          <h2 className="mb-2 text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-gray-900">
            What happens on the day
          </h2>
          <p className="mb-10 text-[15px] leading-relaxed text-gray-500">
            A straightforward, low-disruption session that typically takes under two hours.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Your agent schedules the visit",
                body: "Your agent coordinates directly with our approved vendor and confirms a time that suits you. You will receive a confirmation with everything you need to know.",
              },
              {
                step: "2",
                title: "The vendor scans each room",
                body: "Using professional 360° equipment, the vendor moves through the property room by room, capturing an accurate, immersive tour at a calm and unhurried pace.",
              },
              {
                step: "3",
                title: "Your tour is live within 48 hours",
                body: "We process and host the VR tour, then attach it to your property listing automatically. Your agent is notified as soon as it is ready.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#08519A] text-[13px] font-bold text-white">
                  {step}
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-gray-900">{title}</h3>
                <p className="text-[14px] leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO PREPARE + PRIVACY ─────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Prepare */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#08519A]/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="mb-1.5 text-[17px] font-bold text-gray-900">How to prepare</h2>
              <p className="mb-5 text-[14px] text-gray-500">
                A few simple steps help ensure your tour looks its best.
              </p>
              <ul className="space-y-3">
                {[
                  "Open blinds and curtains to let in as much natural light as possible.",
                  "Tidy key rooms: clear surfaces, make beds, and put away clutter.",
                  "Remove personal items you would prefer not to appear in the tour.",
                  "Switch on all lights, including lamps, for a warm and inviting result.",
                  "Secure pets in a separate area during the session.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0 text-blue-700" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[14px] leading-relaxed text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#08519A]/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#08519A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="mb-1.5 text-[17px] font-bold text-gray-900">Reassurance and privacy</h2>
              <p className="mb-5 text-[14px] text-gray-500">
                Your comfort and privacy are a priority throughout the process.
              </p>
              <ul className="space-y-3">
                {[
                  "Every tour is reviewed by our team before it goes live on the platform.",
                  "You can request edits or removal of any section of the tour at any time.",
                  "Vendors are vetted and operate under strict confidentiality obligations.",
                  "The tour is linked only to your property listing and is not shared externally without your agent's consent.",
                  "You retain the right to request full removal of the tour at any point.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0 text-blue-700" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[14px] leading-relaxed text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────── */}
      <section className="bg-gray-50 py-10 sm:py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-6 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Why it works
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "68%", label: "Fewer unproductive viewings", sub: "Buyers arrive already familiar with the layout." },
              { stat: "3.2×", label: "Faster to offer", sub: "Confident buyers make decisions sooner." },
              { stat: "48h", label: "Turnaround time", sub: "Your tour is live within two business days." },
              { stat: "100%", label: "Review before publish", sub: "Nothing goes live without your agent confirming it." },
            ].map(({ stat, label, sub }) => (
              <div key={stat} className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[28px] font-extrabold tracking-tight text-blue-700">{stat}</p>
                <p className="mt-1 text-[14px] font-semibold text-gray-900">{label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-[#1A3A6C] py-10 sm:py-14">
        <div className="mx-auto max-w-[1800px] px-5 text-center">
          <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-extrabold leading-[1.15] tracking-tight text-white">
            Ready to arrange a capture session?
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/75">
            Speak to your agent or contact the VBYM team and we will take it from there.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
            >
              Contact the team
            </Link>
            <Link
              href="/browse?vr=1"
              className="rounded-lg border border-white/25 px-6 py-3 text-[14px] font-semibold !text-white transition-colors hover:bg-white/10"
            >
              Browse VR listings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
