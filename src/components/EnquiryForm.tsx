"use client";

import { useState } from "react";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

interface Props {
  propertyId: string;
  agencyId: string;  // required: real schema has agency_id NOT NULL on enquiries
  agentEmail?: string;
}

export default function EnquiryForm({ propertyId, agencyId, agentEmail }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
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

    const { error: insertError } = await supabaseClient.from("enquiries").insert({
      property_id: propertyId,
      agency_id: agencyId,  // real schema: agency_id NOT NULL, validated by RLS
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });

    setLoading(false);

    if (insertError) {
      setError("Could not send enquiry. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-gray-900">Enquiry sent</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          The agent will be in touch shortly.
          {agentEmail && (
            <>
              {" "}You can also email them directly at{" "}
              <a href={`mailto:${agentEmail}`} className="underline">
                {agentEmail}
              </a>
              .
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormField id="enq-name" label="Your name">
        <Input
          id="enq-name"
          placeholder="Sophie Reeves"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </FormField>

      <FormField id="enq-email" label="Email">
        <Input
          id="enq-email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </FormField>

      <FormField id="enq-phone" label="Phone (optional)">
        <Input
          id="enq-phone"
          placeholder="+44 7700 900000"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </FormField>

      <FormField id="enq-message" label="Message">
        <textarea
          id="enq-message"
          rows={3}
          placeholder="I'd like to arrange a viewing…"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
          className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-[10px] bg-[#08519A] text-sm font-semibold text-white hover:bg-[#063d75]"
      >
        {loading ? "Sending…" : "Send enquiry"}
      </Button>

      <p className="text-xs text-[#6B7280]">
        View Before You Move is not an estate agency. Enquiries go directly to the agent.
      </p>
    </form>
  );
}
