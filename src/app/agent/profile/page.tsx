"use client";

import { useEffect, useState } from "react";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

interface Agency {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  status: string;
}

export default function AgentProfilePage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [agencyForm, setAgencyForm] = useState({
    name: "",
    website: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabaseClient
        .from("agency_members")
        .select("agency_id, agencies(id, name, website, phone, email, status)")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (membership) {
        // Supabase returns the joined row as an array in this context
        const ag = (
          membership as { agencies: Agency[] | Agency }
        ).agencies;
        const agencyData: Agency = Array.isArray(ag) ? ag[0] : ag;
        if (agencyData) {
          setAgency(agencyData);
          setAgencyForm({
            name: agencyData.name ?? "",
            website: agencyData.website ?? "",
            phone: agencyData.phone ?? "",
            email: agencyData.email ?? "",
          });
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  function setField(field: string, value: string) {
    setAgencyForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSaved(false);
  }

  async function saveAgency(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agency) return;
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabaseClient
      .from("agencies")
      .update({
        name: agencyForm.name.trim(),
        website: agencyForm.website.trim() || null,
        phone: agencyForm.phone.trim() || null,
        email: agencyForm.email.trim() || null,
      })
      .eq("id", agency.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setAgency((prev) =>
      prev
        ? {
            ...prev,
            name: agencyForm.name.trim(),
            website: agencyForm.website.trim() || null,
            phone: agencyForm.phone.trim() || null,
            email: agencyForm.email.trim() || null,
          }
        : prev
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-32 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-64 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-sm text-[#6B7280]">
        No agency found. Please complete onboarding first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          Agency profile
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update your agency details. These appear on your listings and enquiry
          responses.
        </p>
      </div>

      {/* Agency status notice */}
      {agency.status !== "approved" && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            agency.status === "pending"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {agency.status === "pending" &&
            "Your agency is pending review. You can update details while you wait for approval."}
          {agency.status === "suspended" &&
            "Your agency has been suspended. Contact VBYM support for assistance."}
          {agency.status === "rejected" &&
            "Your agency application was not approved. Contact VBYM for details."}
        </div>
      )}

      {/* Agency details */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">
            Agency details
          </h2>
          <form className="space-y-5" onSubmit={saveAgency}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField id="agency-name" label="Agency name">
                  <Input
                    id="agency-name"
                    placeholder="Brightside Property"
                    value={agencyForm.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField id="agency-email" label="Business email">
                <Input
                  id="agency-email"
                  type="email"
                  placeholder="hello@youragency.co.uk"
                  value={agencyForm.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </FormField>

              <FormField id="agency-phone" label="Phone">
                <Input
                  id="agency-phone"
                  placeholder="+44 20 7946 0123"
                  value={agencyForm.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField id="agency-website" label="Website">
                  <Input
                    id="agency-website"
                    placeholder="https://youragency.co.uk"
                    value={agencyForm.website}
                    onChange={(e) => setField("website", e.target.value)}
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
              disabled={saving}
              className="h-11 rounded-[10px] bg-[#08519A] px-6 text-sm font-semibold text-white hover:bg-[#063d75]"
            >
              {saved ? "Saved!" : saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Read-only info */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <p className="text-sm font-semibold text-[#0F172A]">Agency status</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          Status:{" "}
          <span className="font-medium capitalize text-[#0F172A]">
            {agency.status}
          </span>
          . Status is managed by the VBYM team and cannot be changed here.
          Contact{" "}
          <a
            href="mailto:hello@viewbeforeyoumove.co.uk"
            className="underline hover:text-[#0F172A]"
          >
            hello@viewbeforeyoumove.co.uk
          </a>{" "}
          if you have questions.
        </p>
      </div>
    </div>
  );
}
