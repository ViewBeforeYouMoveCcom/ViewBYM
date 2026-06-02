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

async function sendNotification(type: string, agency: Agency) {
  if (!agency.email) return;
  await fetch("/api/admin/notify-application", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, agentEmail: agency.email, agencyName: agency.name }),
  });
}

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function approve(agency: Agency) {
    setWorking((prev) => ({ ...prev, [agency.id]: true }));
    const { error } = await supabaseClient.from("agencies").update({ status: "approved" }).eq("id", agency.id);
    setWorking((prev) => ({ ...prev, [agency.id]: false }));
    if (error) { alert(`Error: ${error.message}`); return; }
    setAgencies((prev) => prev.map((a) => a.id === agency.id ? { ...a, status: "approved" } : a));
    await sendNotification("agency_approved", agency);
    setEmailSent((prev) => ({ ...prev, [agency.id]: true }));
  }

  async function updateStatus(agency: Agency, status: AgencyStatus) {
    setWorking((prev) => ({ ...prev, [agency.id]: true }));
    const { error } = await supabaseClient.from("agencies").update({ status }).eq("id", agency.id);
    setWorking((prev) => ({ ...prev, [agency.id]: false }));
    if (error) { alert(`Error: ${error.message}`); return; }
    setAgencies((prev) => prev.map((a) => a.id === agency.id ? { ...a, status } : a));
    if (status === "approved") await sendNotification("agency_approved", agency);
  }

  async function resendEmail(agency: Agency) {
    setWorking((prev) => ({ ...prev, [`email_${agency.id}`]: true }));
    await sendNotification("agency_approved", agency);
    setWorking((prev) => ({ ...prev, [`email_${agency.id}`]: false }));
    setEmailSent((prev) => ({ ...prev, [agency.id]: true }));
  }

  async function updatePlan(agencyId: string, plan: Plan) {
    await supabaseClient.from("agencies").update({ plan }).eq("id", agencyId);
    setAgencies((prev) => prev.map((a) => a.id === agencyId ? { ...a, plan } : a));
  }

  async function deleteAgency(agencyId: string) {
    if (!confirm("Delete this agency? This will remove all associated data (properties, members, and user accounts). This cannot be undone.")) return;
    setWorking((prev) => ({ ...prev, [agencyId]: true }));
    
    // Get the agency creator user_id and email before deleting
    const { data: agencyData } = await supabaseClient
      .from("agencies")
      .select("created_by, email")
      .eq("id", agencyId)
      .single();
    
    const { error } = await supabaseClient.from("agencies").delete().eq("id", agencyId);
    
    // Also delete from agent_applications so they can re-apply
    if (agencyData?.email) {
      await supabaseClient.from("agent_applications").delete().eq("business_email", agencyData.email);
    }

    setWorking((prev) => ({ ...prev, [agencyId]: false }));
    if (error) { alert(`Error: ${error.message}`); return; }
    setAgencies((prev) => prev.filter((a) => a.id !== agencyId));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Agencies</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="h-4 w-40 rounded-full bg-gray-200" />
              <div className="mt-4 flex gap-2">
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
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide ${PLAN_COLOURS[agency.plan] ?? PLAN_COLOURS.free}`}>
                      {agency.plan}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(agency.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {agency.email && (
                  <p className="text-xs text-gray-400">Contact: {agency.email}</p>
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
                      className="h-9 rounded-[10px] text-sm text-white"
                      style={{ backgroundColor: "#08519A" }}
                      onClick={() => approve(agency)}
                      disabled={working[agency.id]}
                    >
                      {working[agency.id] ? "Approving…" : "Approve & notify"}
                    </Button>
                  )}
                  {agency.status === "approved" && agency.email && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => resendEmail(agency)}
                      disabled={working[`email_${agency.id}`]}
                    >
                      {emailSent[agency.id] ? "Email sent ✓" : working[`email_${agency.id}`] ? "Sending…" : "Re-send approval email"}
                    </Button>
                  )}
                  {agency.status === "approved" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => updateStatus(agency, "suspended")}
                      disabled={working[agency.id]}
                    >
                      Suspend
                    </Button>
                  )}
                  {agency.status === "suspended" && (
                    <Button
                      className="h-9 rounded-[10px] text-sm text-white"
                      style={{ backgroundColor: "#08519A" }}
                      onClick={() => updateStatus(agency, "approved")}
                      disabled={working[agency.id]}
                    >
                      Reinstate
                    </Button>
                  )}
                  {agency.status !== "rejected" && agency.status !== "approved" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => updateStatus(agency, "rejected")}
                      disabled={working[agency.id]}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => deleteAgency(agency.id)}
                    disabled={working[agency.id]}
                  >
                    Delete agency
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
