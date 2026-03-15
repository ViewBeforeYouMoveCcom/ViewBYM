"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

type AgencyStatus = "pending" | "approved" | "suspended" | "rejected";

interface Agency {
  id: string;
  name: string;
  status: AgencyStatus;
  created_at: string;
}

const statusVariant: Record<AgencyStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  pending: "amber",
  approved: "success",
  suspended: "warning",
  rejected: "error",
};

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<Record<string, boolean>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient
      .from("agencies")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false });
    setAgencies((data as Agency[]) ?? []);
    setLoading(false);
  }

  async function approve(agencyId: string) {
    setWorking((prev) => ({ ...prev, [agencyId]: true }));
    const { data, error } = await supabaseClient.rpc("admin_approve_agency", {
      p_agency_id: agencyId,
    });
    setWorking((prev) => ({ ...prev, [agencyId]: false }));

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    // RPC returns the onboarding token
    setTokens((prev) => ({ ...prev, [agencyId]: data as string }));
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, status: "approved" } : a))
    );
  }

  async function updateStatus(agencyId: string, status: AgencyStatus) {
    setWorking((prev) => ({ ...prev, [agencyId]: true }));
    await supabaseClient
      .from("agencies")
      .update({ status })
      .eq("id", agencyId);
    setWorking((prev) => ({ ...prev, [agencyId]: false }));
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, status } : a))
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
        Agencies
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {agency.name}
                    </p>
                    <Badge variant={statusVariant[agency.status]}>
                      {agency.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(agency.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* Token display after approval */}
                {tokens[agency.id] && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold text-[#0F172A]">
                      Onboarding token (send to agent):
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-blue-700">
                      {tokens[agency.id]}
                    </p>
                    <p className="mt-2 text-xs text-[#6B7280]">
                      The agent redeems this at <strong>/agent/onboarding</strong>. Store it safely — it won't be shown again.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {agency.status === "pending" && (
                    <Button
                      className="h-9 rounded-[10px] bg-blue-700 text-sm text-white hover:bg-blue-800"
                      onClick={() => approve(agency.id)}
                      disabled={working[agency.id]}
                    >
                      Approve & generate token
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
