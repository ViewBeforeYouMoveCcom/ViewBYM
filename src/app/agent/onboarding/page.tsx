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
    const { data: applicationStatus } = await supabaseClient.rpc("agent_my_application_status");

    if (applicationStatus !== "approved") {
      setError("Your agent access request must be approved before onboarding.");
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

    // Fallback: manually insert agency_members in case the DB trigger didn't fire
    await supabaseClient
      .from("agency_members")
      .upsert({ agency_id: agency.id, user_id: user.id, member_role: "owner" }, { onConflict: "agency_id,user_id" });

    router.push("/agent/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900">
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
              className="h-11 w-full rounded-[10px] bg-[#08519A] text-sm font-semibold text-white hover:bg-[#063d75]"
            >
              {loading ? "Creating…" : "Create agency"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-[13.5px] font-semibold text-gray-900">What happens next</p>
        <div className="mt-4 space-y-3">
          {[
            { step: "1", title: "Account under review", body: "Your agency profile is submitted and held in a pending state while our team verifies your details." },
            { step: "2", title: "Approval within 1–2 business days", body: "A member of the View Before You Move team will review your agency and confirm your access by email." },
            { step: "3", title: "Start listing with immersive VR", body: "Once approved, you can create property listings and submit 360° footage for your full VR tours." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#08519A] text-[11px] font-bold text-white">
                {step}
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-gray-900">{title}</p>
                <p className="text-[13px] leading-relaxed text-gray-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
