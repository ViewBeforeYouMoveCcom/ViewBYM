"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

interface PropertyContext {
  id: string;
  title: string | null;
  address_line1: string | null;
  city: string | null;
  price: number | null;
  listing_type: string | null;
  agency_id: string;
}

const TIME_OPTIONS = [
  { value: "morning", label: "Morning (9am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 5pm)" },
  { value: "evening", label: "Evening (5pm – 7pm)" },
  { value: "flexible", label: "Flexible — any time" },
];

export default function BookViewingPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyContext | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "flexible",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill name/email if user is logged in
  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setForm((prev) => ({ ...prev, email: user.email! }));
      }
    });
  }, []);

  // Load property context
  useEffect(() => {
    async function loadProperty() {
      const { data, error: fetchErr } = await supabaseClient
        .from("properties")
        .select("id, title, address_line1, city, price, listing_type, agency_id")
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (fetchErr || !data) {
        setPropertyError(true);
      } else {
        setProperty(data as unknown as PropertyContext);
      }
      setPropertyLoading(false);
    }
    loadProperty();
  }, [id]);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!property) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabaseClient
      .from("viewing_requests")
      .insert({
        property_id: property.id,
        agency_id: property.agency_id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time,
        notes: form.notes.trim() || null,
      });

    setSubmitting(false);

    if (insertError) {
      setError("Could not submit your request. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  // ── Loading state ────────────────────────────────────────
  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="space-y-4">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
          </div>
        </div>
      </div>
    );
  }

  // ── Property not found ───────────────────────────────────
  if (propertyError || !property) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-sm text-[#6B7280]">
            This property is not available for viewing requests.{" "}
            <Link href="/browse" className="underline hover:text-[#0F172A]">
              Browse other listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-[15px] font-semibold text-[#0F172A]">
              Viewing request sent
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">
              Your request for{" "}
              <span className="font-medium text-[#0F172A]">
                {property.title || property.address_line1}
              </span>{" "}
              has been sent to the agent. They will be in touch to confirm a
              time.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/property/${property.id}`}
                className="inline-flex h-10 items-center rounded-[10px] border border-[#0F172A] px-5 text-[13.5px] font-semibold text-[#0F172A] hover:bg-[#F9FAFB]"
              >
                Back to listing
              </Link>
              <Link
                href="/browse"
                className="inline-flex h-10 items-center rounded-[10px] border border-gray-300 px-5 text-[13.5px] font-semibold text-[#6B7280] hover:border-gray-400"
              >
                Browse more
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayAddress = [property.address_line1, property.city]
    .filter(Boolean)
    .join(", ");

  const priceDisplay = property.price
    ? `£${property.price.toLocaleString()}${property.listing_type === "rent" ? " pcm" : ""}`
    : null;

  // ── Main form ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            href={`/property/${property.id}`}
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F172A]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to listing
          </Link>

          <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
            Request a viewing
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {property.title || displayAddress}
            {displayAddress && property.title ? ` · ${displayAddress}` : ""}
            {priceDisplay ? ` · ${priceDisplay}` : ""}
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Card className="rounded-xl border border-[#E5E7EB]">
            <CardContent className="p-6">
              <p className="mb-5 text-[13px] text-[#6B7280]">
                We recommend taking the VR tour first to confirm the layout
                before requesting an in-person visit.
              </p>

              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField id="bv-name" label="Your name">
                      <Input
                        id="bv-name"
                        placeholder="Sophie Reeves"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField id="bv-email" label="Email">
                    <Input
                      id="bv-email"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField id="bv-phone" label="Phone (optional)">
                    <Input
                      id="bv-phone"
                      placeholder="+44 7700 900000"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </FormField>

                  <FormField id="bv-date" label="Preferred date (optional)">
                    <Input
                      id="bv-date"
                      type="date"
                      value={form.preferred_date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setField("preferred_date", e.target.value)
                      }
                      className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormField>

                  <FormField id="bv-time" label="Preferred time">
                    <select
                      id="bv-time"
                      value={form.preferred_time}
                      onChange={(e) =>
                        setField("preferred_time", e.target.value)
                      }
                      className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField id="bv-notes" label="Additional notes (optional)">
                      <textarea
                        id="bv-notes"
                        rows={3}
                        placeholder="Anything the agent should know — accessibility needs, who will be attending, questions…"
                        value={form.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormField>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full rounded-[10px] bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  {submitting ? "Submitting…" : "Request viewing"}
                </Button>

                <p className="text-[12px] text-[#6B7280]">
                  Your request goes directly to the agent. View Before You Move
                  is not an estate agency and does not manage viewings.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Right aside */}
          <aside className="space-y-4 lg:block">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
              <p className="text-[13px] font-semibold text-[#0F172A]">
                What happens next
              </p>
              <div className="mt-3 space-y-3 text-[13px] text-[#6B7280]">
                {[
                  "Your request is sent directly to the agent.",
                  "They will contact you to confirm a date and time.",
                  "You explore the property in person.",
                ].map((step, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-[11px] font-bold text-blue-700">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
              <p className="text-[13px] font-semibold text-[#0F172A]">Tip</p>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                Take the immersive VR tour before visiting in person to check
                layout, room sizes, and natural light.
              </p>
              <Link
                href={`/property/${property.id}`}
                className="mt-3 block text-[13px] text-blue-700 hover:underline"
              >
                View VR tour →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
