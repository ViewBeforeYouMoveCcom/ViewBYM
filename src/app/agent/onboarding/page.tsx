"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AgentOnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      setError("Session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    // Create agency.
    // Setting created_by triggers the add_creator_as_agency_owner DB trigger which
    // automatically inserts the owner row into agency_members — no manual insert needed.
    const { data: agency, error: insertError } = await supabaseClient
      .from("agencies")
      .insert({
        name: form.name.trim(),
        website: form.website.trim() || null,
        status: "pending",
        created_by: user.id,
      })
      .select("id")
      .single();

    setLoading(false);

    if (insertError || !agency) {
      setError("Could not create agency. " + insertError?.message);
      return;
    }

    router.push("/agent/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          Set up your agency
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create your agency profile to get started. Your account will be reviewed before you can publish listings.
        </p>
      </div>

      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="space-y-5 p-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <FormField id="agency-name" label="Agency name">
              <Input
                id="agency-name"
                placeholder="Brightside Property"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </FormField>

            <FormField id="website" label="Website (optional)">
              <Input
                id="website"
                placeholder="https://youragency.co.uk"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
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
              className="h-11 w-full rounded-[10px] bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {loading ? "Creating…" : "Create agency"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <p className="text-sm font-semibold text-[#0F172A]">What happens next</p>
        <div className="mt-3 space-y-2 text-sm text-[#6B7280]">
          <p>1. Your agency is created with a <strong>pending</strong> status.</p>
          <p>2. The VBYM team reviews your details and approves your account.</p>
          <p>3. Once approved, you can publish property listings with VR tours.</p>
        </div>
      </div>
    </div>
  );
}
