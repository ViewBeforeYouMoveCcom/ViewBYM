import Link from "next/link";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1A3A6C] py-14 sm:py-20 lg:py-24">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-5">
          <div className="max-w-[640px]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9.5h8M8 12.5h5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.12em] text-white">
              Get in touch
            </p>
            <h1 className="mb-4 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
              We&apos;d love to <br /> hear from you.
            </h1>
            <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-white/70">
              Whether you&apos;re a buyer, tenant, or agent send us a message and we&apos;ll respond promptly.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/faq"
                className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-bold text-[#1A3A6C] transition-colors hover:bg-blue-50"
              >
                Visit FAQs
              </Link>
              <Link
                href="/browse"
                className="rounded-lg border border-white/25 px-5 py-2.5 text-[14px] font-semibold !text-white/85 transition-colors hover:border-white/45 hover:bg-white/10"
              >
                Browse properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO STRIP ───────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Email */}
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08519A]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="1.8"/>
                  <path d="M22 7l-10 6L2 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">Email us</p>
                <p className="mt-0.5 text-[13px] text-gray-500">hello@viewbym.com</p>
                <p className="mt-0.5 text-[12px] text-gray-400">We reply within 24 hours</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08519A]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">Call us</p>
                <p className="mt-0.5 text-[13px] text-gray-500">0800 123 4567</p>
                <p className="mt-0.5 text-[12px] text-gray-400">Mon – Fri, 9am – 5pm</p>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08519A]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="1.8"/>
                  <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.8"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">Visit us</p>
                <p className="mt-0.5 text-[13px] text-gray-500">London, United Kingdom</p>
                <p className="mt-0.5 text-[12px] text-gray-400">By appointment only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMS ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-20 top-20 h-[300px] w-[300px] rounded-full bg-blue-50/60 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-5">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-[#08519A]">
              Send a message
            </p>
            <h2 className="mb-2 text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-gray-900">
              How can we help?
            </h2>
            <p className="text-[15px] text-gray-500">
              Choose the form that best fits your enquiry.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Buyer / tenant */}
            <Card className="flex flex-col rounded-2xl border-l-4 border-l-[#08519A] border-t-0 border-r-0 border-b-0 bg-white shadow-md shadow-gray-200/60 transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-1 flex-col space-y-5 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08519A]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-gray-900">
                      Buyer or tenant enquiry
                    </h2>
                    <p className="text-[13px] text-gray-500">
                      Ask about a listing, a VR tour, or your saved searches.
                    </p>
                  </div>
                </div>

                <FormField
                  id="buyer-name"
                  label="Full name"
                  helper="Use the name you would provide to agents."
                >
                  <Input id="buyer-name" placeholder="Jane Patel" />
                </FormField>

                <FormField
                  id="buyer-email"
                  label="Email"
                  helper="We'll only use this to respond to your enquiry."
                >
                  <Input id="buyer-email" type="email" placeholder="jane@email.com" />
                </FormField>

                <FormField id="buyer-message" label="Message">
                  <Textarea id="buyer-message" rows={4} placeholder="Tell us how we can help." />
                </FormField>

                <div className="mt-auto pt-2">
                  <Button className="w-full rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]">
                    Send enquiry
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent / partner */}
            <Card className="flex flex-col rounded-2xl border-l-4 border-l-[#08519A] border-t-0 border-r-0 border-b-0 bg-white shadow-md shadow-gray-200/60 transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-1 flex-col space-y-5 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08519A]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                      <path d="M16 7V5a4 4 0 00-8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M12 14v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-gray-900">
                      Agent or partner enquiry
                    </h2>
                    <p className="text-[13px] text-gray-500">
                      Discuss VR capture, onboarding, or listing integrations.
                    </p>
                  </div>
                </div>

                <FormField
                  id="agent-name"
                  label="Full name"
                  helper="Include your role and agency name."
                >
                  <Input id="agent-name" placeholder="Tom Briggs" />
                </FormField>

                <FormField id="agent-email" label="Business email">
                  <Input id="agent-email" type="email" placeholder="tom@agency.co.uk" />
                </FormField>

                <FormField id="agent-message" label="Message">
                  <Textarea
                    id="agent-message"
                    rows={4}
                    placeholder="Tell us how we can support your listings."
                  />
                </FormField>

                <div className="mt-auto pt-2">
                  <Button className="w-full rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]">
                    Request a callback
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Footer note */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#08519A]/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#08519A" strokeWidth="1.8"/>
                <path d="M12 16v-4M12 8h.01" stroke="#08519A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-500">
              For listing-specific questions (price, availability, viewing arrangements), please
              contact the agent shown directly on the property page.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
