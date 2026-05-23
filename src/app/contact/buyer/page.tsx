"use client";

import { useState } from "react";
import Link from "next/link";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BuyerContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      type: "buyer",
    };
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, agentEmail: "jt@universaltvmedia.com", propertyTitle: "General buyer enquiry" }),
      });
      setSubmitted(true);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white font-sans">
      <section className="relative overflow-hidden bg-[#1A3A6C] py-12 sm:py-16">
        <div className="relative mx-auto max-w-[1800px] px-5">
          <Link href="/contact" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-white/70 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to contact
          </Link>
          <h1 className="mb-2 text-[clamp(26px,3.5vw,42px)] font-extrabold leading-tight tracking-tight text-white">
            Buyer enquiry
          </h1>
          <p className="text-[15px] text-white/70">Ask us anything — we&apos;ll get back to you within 24 hours.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-[700px] px-5">
          {submitted ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 className="text-[18px] font-bold text-gray-900">Message sent!</h2>
              <p className="mt-2 text-[14px] text-gray-500">We&apos;ll be in touch within 24 hours.</p>
              <Link href="/browse" className="mt-6 inline-block rounded-lg bg-[#08519A] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#063d75]">
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField id="name" label="Full name" helper="Use the name you would provide to agents.">
                  <Input id="name" name="name" placeholder="Jane Patel" required />
                </FormField>
                <FormField id="email" label="Email" helper="We&apos;ll only use this to respond to your enquiry.">
                  <Input id="email" name="email" type="email" placeholder="jane@email.com" required />
                </FormField>
                <FormField id="phone" label="Phone number (optional)">
                  <Input id="phone" name="phone" type="tel" placeholder="07700 900000" />
                </FormField>
                <FormField id="message" label="Message">
                  <Textarea id="message" name="message" rows={5} placeholder="Tell us how we can help — mention a property address or search area if relevant." required />
                </FormField>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#08519A] px-5 py-3 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75] disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send enquiry"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
