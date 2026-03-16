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
      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Get in touch
          </p>
          <h1 className="mb-3.5 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            We'd love to hear from you.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-gray-500">
            Whether you're a buyer, tenant, or agent — send us a message and we'll respond promptly.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/faq"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
            >
              Visit FAQs
            </Link>
            <Link
              href="/browse"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-[14px] font-semibold text-blue-700 transition-colors hover:bg-blue-700 hover:text-white"
            >
              Browse properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── FORMS ────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Buyer / tenant */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-md">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Buyer or tenant enquiry
                  </h2>
                  <p className="mt-1 text-[14px] text-gray-500">
                    Ask about a listing, a VR tour, or your saved searches.
                  </p>
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

                <Button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800">
                  Send enquiry
                </Button>
              </CardContent>
            </Card>

            {/* Agent / partner */}
            <Card className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-md">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Agent or partner enquiry
                  </h2>
                  <p className="mt-1 text-[14px] text-gray-500">
                    Discuss VR capture, onboarding, or listing integrations.
                  </p>
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

                <Button
                  variant="secondary"
                  className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
                >
                  Request a callback
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Footer note */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-[13px] text-gray-500">
            For listing-specific questions (price, availability, viewing arrangements), please
            contact the agent shown directly on the property page.
          </div>
        </div>
      </section>

    </div>
  );
}
