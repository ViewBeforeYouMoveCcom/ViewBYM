"use client";

import { useState } from "react";
import Link from "next/link";

import FormField from "@/components/FormField";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

export default function RequestAccessPage() {
  const [form, setForm] = useState({
    agencyName: "",
    agencyLocation: "",
    contactName: "",
    contactRole: "",
    businessEmail: "",
    phone: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabaseClient
      .from("agent_applications")
      .insert({
        agency_name: form.agencyName.trim(),
        branch_location: form.agencyLocation.trim() || null,
        contact_name: form.contactName.trim(),
        contact_role: form.contactRole.trim() || null,
        business_email: form.businessEmail.trim(),
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        status: "new",
      });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again or contact us directly.");
      return;
    }

    // Notify admin of new request
    await fetch("/api/admin/notify-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "request_access",
        agentEmail: form.businessEmail.trim(),
        agentName: form.contactName.trim(),
        agencyName: form.agencyName.trim(),
      }),
    });

    setSuccess(true);
  }

  return (
    <div className="bg-white">
      {/* Page hero */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            For agents
          </p>
          <h1 className="mb-3.5 text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Request agent access.
          </h1>
          <p className="mb-5 max-w-[520px] text-[15px] leading-relaxed text-gray-500">
            Share your details and we'll contact you with onboarding steps. Access is managed to keep tour quality and presentation consistent.
          </p>
          <Link
            href="/for-agents"
            className="text-[14px] text-blue-700 hover:underline"
          >
            ← Back to agent overview
          </Link>
        </div>
      </section>

      {/* Body */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Form card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <h2 className="mb-1 text-[17px] font-bold text-gray-900">
                Agency details
              </h2>
              <p className="mb-6 text-[14px] leading-relaxed text-gray-500">
                Use a business email where possible.
              </p>

              {success ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-[15px] font-semibold text-blue-700">Request received</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-blue-700/80">
                    We've received your details and will be in touch shortly with next steps.
                    In the meantime, you can{" "}
                    <Link href="/account/signup" className="underline">
                      create an account
                    </Link>{" "}
                    to get ready.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={onSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField id="agency-name" label="Agency name">
                      <Input
                        id="agency-name"
                        placeholder="Brightside Property"
                        value={form.agencyName}
                        onChange={(e) => set("agencyName", e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField id="agency-location" label="Primary location">
                      <Input
                        id="agency-location"
                        placeholder="London"
                        value={form.agencyLocation}
                        onChange={(e) => set("agencyLocation", e.target.value)}
                      />
                    </FormField>

                    <FormField id="contact-name" label="Contact name">
                      <Input
                        id="contact-name"
                        placeholder="Sophie Reeves"
                        value={form.contactName}
                        onChange={(e) => set("contactName", e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField id="contact-role" label="Role">
                      <Input
                        id="contact-role"
                        placeholder="Head of Lettings"
                        value={form.contactRole}
                        onChange={(e) => set("contactRole", e.target.value)}
                      />
                    </FormField>

                    <FormField id="business-email" label="Business email">
                      <Input
                        id="business-email"
                        type="email"
                        placeholder="sophie@agency.co.uk"
                        value={form.businessEmail}
                        onChange={(e) => set("businessEmail", e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField id="phone" label="Phone">
                      <Input
                        id="phone"
                        placeholder="+44 20 7946 0123"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                    </FormField>

                    <div className="md:col-span-2">
                      <FormField id="website" label="Website">
                        <Input
                          id="website"
                          placeholder="https://youragency.co.uk"
                          value={form.website}
                          onChange={(e) => set("website", e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[14px] text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[13px] text-gray-400">
                      By submitting, you confirm these details are accurate.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
                    >
                      {loading ? "Submitting…" : "Submit request"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right aside */}
            <aside className="space-y-4">
              {/* What happens next */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="mb-4 text-[14px] font-bold text-gray-900">What happens next</p>
                <div className="space-y-3">
                  {[
                    {
                      num: "1",
                      title: "Review",
                      text: "We confirm your agency details and preferred workflow.",
                    },
                    {
                      num: "2",
                      title: "Onboarding",
                      text: "We share the filming guide and upload process.",
                    },
                    {
                      num: "3",
                      title: "Publish",
                      text: "We process tours and provide hosted listing links.",
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-[14px] font-bold text-blue-700">
                        {step.num}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">{step.title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-2 text-[14px] font-bold text-gray-900">Notes</p>
                <p className="text-[13px] leading-relaxed text-gray-500">
                  Full immersive tours remain hosted on VBYM so you can share links across channels while keeping presentation consistent.
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-gray-400">
                  View Before You Move is not an estate agency. Listings and enquiries are handled by the agent.
                </p>
              </div>

              <Link
                href="/contact"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:border-gray-400"
              >
                Need help? Contact us
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
