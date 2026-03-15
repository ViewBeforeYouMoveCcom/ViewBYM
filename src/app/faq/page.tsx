import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { faqs } from "@/data/faqs";

export default function FaqPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-600">
            Help & FAQ
          </p>
          <h1 className="mb-3.5 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Common questions, straight answers.
          </h1>
          <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-gray-500">
            Clear answers for buyers, tenants, and agents. If you can't find what you
            need, contact us and we'll get back to you promptly.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/browse"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Browse properties
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* FAQ accordion */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-[15px] font-semibold text-gray-900 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[14px] leading-relaxed text-gray-500">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right aside */}
            <aside className="flex flex-col gap-4">

              {/* Quick tips */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-[14px] font-bold text-gray-900">Quick tips</p>
                <ul className="mt-3 flex flex-col gap-2.5 text-[14px] text-gray-500">
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-blue-600">•</span>
                    Use VR to confirm layout and flow before viewing in-person.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-blue-600">•</span>
                    Save listings to revisit and compare them later.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-blue-600">•</span>
                    If listing details look incorrect, contact the agent directly from the property page.
                  </li>
                </ul>
              </div>

              {/* Still need help? */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-[14px] font-bold text-gray-900">Still need help?</p>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                  Our team is available to answer questions about listings, VR tours, or your account.
                </p>
                <Button
                  asChild
                  className="mt-4 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>

            </aside>
          </div>
        </div>
      </section>

    </div>
  );
}
