"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

type AgencyStatus = "pending" | "approved" | "suspended" | "rejected";
type Plan = "free" | "paid";

interface Agency {
  id: string;
  name: string;
  status: AgencyStatus;
  plan: Plan;
  email: string | null;
  created_at: string;
}

const statusVariant: Record<AgencyStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  pending: "amber",
  approved: "success",
  suspended: "warning",
  rejected: "error",
};

const PLAN_COLOURS: Record<Plan, string> = {
  free: "bg-gray-100 text-gray-600",
  paid: "bg-amber-100 text-amber-700",
};

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<Record<string, boolean>>({});
  const [emailSent, setEmailSent] = useState<Record<string, boolean>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient
      .from("agencies")
      .select("id, name, status, plan, email, created_at")
      .order("created_at", { ascending: false });
    setAgencies((data as Agency[]) ?? []);
    setLoading(false);
  }

  async function sendApprovalEmail(agency: Agency) {
    if (!agency.email) return;
    setWorking((prev) => ({ ...prev, [`email_${agency.id}`]: true }));

    const { data: { session } } = await supabaseClient.auth.getSession();
    await fetch("/api/admin/send-approval-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        agencyId: agency.id,
        agencyName: agency.name,
        contactEmail: agency.email,
      }),
    });

    setEmailSent((prev) => ({ ...prev, [agency.id]: true }));
    setWorking((prev) => ({ ...prev, [`email_${agency.id}`]: false }));
  }

  async function approve(agency: Agency) {
    setWorking((prev) => ({ ...prev, [agency.id]: true }));
    const { data, error } = await supabaseClient.rpc("admin_approve_agency", {
      p_agency_id: agency.id,
    });
    setWorking((prev) => ({ ...prev, [agency.id]: false }));

    if (error) { alert(`Error: ${error.message}`); return; }

    const rows = data as { agency_id: string; token: string }[] | null;
    const token = rows?.[0]?.token ?? null;
    if (token) setTokens((prev) => ({ ...prev, [agency.id]: token }));
    setAgencies((prev) => prev.map((a) => a.id === agency.id ? { ...a, status: "approved" } : a));

    // Auto-send email if email on file
    if (agency.email) sendApprovalEmail({ ...agency, status: "approved" });
  }

  async function updateStatus(agencyId: string, status: AgencyStatus) {
    setWorking((prev) => ({ ...prev, [agencyId]: true }));
    await supabaseClient.from("agencies").update({ status }).eq("id", agencyId);
    setWorking((prev) => ({ ...prev, [agencyId]: false }));
    setAgencies((prev) => prev.map((a) => a.id === agencyId ? { ...a, status } : a));
  }

  async function updatePlan(agencyId: string, plan: Plan) {
    await supabaseClient.from("agencies").update({ plan }).eq("id", agencyId);
    setAgencies((prev) => prev.map((a) => a.id === agencyId ? { ...a, plan } : a));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Agencies</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-40 rounded-full bg-gray-200" />
                  <div className="h-5 w-16 rounded-full bg-gray-100" />
                  <div className="h-5 w-12 rounded-full bg-gray-100" />
                </div>
                <div className="h-3 w-20 rounded-full bg-gray-100" />
              </div>
              <div className="mt-5 flex gap-2">
                <div className="h-9 w-36 rounded-lg bg-gray-100" />
                <div className="h-9 w-20 rounded-lg bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : agencies.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
          <p className="text-sm text-[#6B7280]">No agencies yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agencies.map((agency) => (
            <Card key={agency.id} className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="space-y-4 p-5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{agency.name}</p>
                    <Badge variant={statusVariant[agency.status]}>{agency.status}</Badge>
                    {/* Plan badge */}
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide ${PLAN_COLOURS[agency.plan] ?? PLAN_COLOURS.free}`}>
                      {agency.plan}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(agency.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* Email */}
                {agency.email && (
                  <p className="text-xs text-gray-400">Contact: {agency.email}</p>
                )}

                {/* Token after approval */}
                {tokens[agency.id] && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold text-gray-900">Onboarding token:</p>
                    <p className="mt-1 break-all font-mono text-xs text-blue-700">{tokens[agency.id]}</p>
                    <p className="mt-2 text-xs text-[#6B7280]">
                      Agent redeems at <strong>/agent/onboarding</strong>. Store it safely.
                    </p>
                  </div>
                )}

                {/* Plan selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Plan:</span>
                  <select
                    value={agency.plan}
                    onChange={(e) => updatePlan(agency.id, e.target.value as Plan)}
                    className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 text-[12.5px] font-medium text-gray-700 outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {agency.status === "pending" && (
                    <Button
                      className="h-9 rounded-[10px] bg-blue-700 text-sm text-white hover:bg-blue-800"
                      onClick={() => approve(agency)}
                      disabled={working[agency.id]}
                    >
                      Approve &amp; notify
                    </Button>
                  )}
                  {agency.status === "approved" && agency.email && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => sendApprovalEmail(agency)}
                      disabled={working[`email_${agency.id}`]}
                    >
                      {emailSent[agency.id] ? "Email sent ✓" : working[`email_${agency.id}`] ? "Sending…" : "Re-send approval email"}
                    </Button>
                  )}
                  {agency.status === "approved" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => updateStatus(agency.id, "suspended")}
                      disabled={working[agency.id]}
                    >
                      Suspend
                    </Button>
                  )}
                  {agency.status === "suspended" && (
                    <Button
                      className="h-9 rounded-[10px] bg-blue-700 text-sm text-white hover:bg-blue-800"
                      onClick={() => updateStatus(agency.id, "approved")}
                      disabled={working[agency.id]}
                    >
                      Reinstate
                    </Button>
                  )}
                  {agency.status !== "rejected" && agency.status !== "approved" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => updateStatus(agency.id, "rejected")}
                      disabled={working[agency.id]}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
