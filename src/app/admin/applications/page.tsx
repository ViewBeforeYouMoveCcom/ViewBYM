"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

type AppStatus = "new" | "in_review" | "approved" | "rejected";

interface Application {
  id: string;
  agency_name: string;
  branch_location: string | null;
  contact_name: string;
  contact_role: string | null;
  business_email: string;
  phone: string | null;
  website: string | null;
  status: AppStatus;
  notes: string | null;
  created_at: string;
}

const statusVariant: Record<AppStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  new: "amber",
  in_review: "warning",
  approved: "success",
  rejected: "error",
};

const TAB_OPTIONS: { label: string; value: AppStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In review", value: "in_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState<AppStatus | "all">("new");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient
      .from("agent_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications((data as Application[]) ?? []);
    const initialNotes: Record<string, string> = {};
    (data as Application[] ?? []).forEach((a) => {
      initialNotes[a.id] = a.notes ?? "";
    });
    setNotes(initialNotes);
    setLoading(false);
  }

  async function updateStatus(id: string, status: AppStatus) {
    setSaving((prev) => ({ ...prev, [id]: true }));
    await supabaseClient
      .from("agent_applications")
      .update({ status, notes: notes[id] ?? null })
      .eq("id", id);
    setSaving((prev) => ({ ...prev, [id]: false }));
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  async function saveNotes(id: string) {
    setSaving((prev) => ({ ...prev, [`notes_${id}`]: true }));
    await supabaseClient
      .from("agent_applications")
      .update({ notes: notes[id] ?? null })
      .eq("id", id);
    setSaving((prev) => ({ ...prev, [`notes_${id}`]: false }));
  }

  const filtered =
    tab === "all" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-gray-900">
        Agent applications
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TAB_OPTIONS.map((t) => {
          const count = t.value === "all"
            ? applications.length
            : applications.filter((a) => a.status === t.value).length;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
          <p className="text-sm text-[#6B7280]">No applications in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <Card key={app.id} className="rounded-xl border border-[#E5E7EB]">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {app.agency_name}
                      </p>
                      <Badge variant={statusVariant[app.status]}>
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {app.branch_location && (
                      <p className="text-xs text-[#6B7280]">{app.branch_location}</p>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(app.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="text-[#6B7280]">Contact: </span>
                    <span className="text-gray-900">{app.contact_name}</span>
                    {app.contact_role && (
                      <span className="text-[#6B7280]"> · {app.contact_role}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Email: </span>
                    <a href={`mailto:${app.business_email}`} className="text-blue-700 hover:underline">
                      {app.business_email}
                    </a>
                  </div>
                  {app.phone && (
                    <div>
                      <span className="text-[#6B7280]">Phone: </span>
                      <span className="text-gray-900">{app.phone}</span>
                    </div>
                  )}
                  {app.website && (
                    <div>
                      <span className="text-[#6B7280]">Website: </span>
                      <a
                        href={app.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        {app.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#6B7280]">Internal notes</label>
                  <div className="flex gap-2">
                    <textarea
                      value={notes[app.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [app.id]: e.target.value }))
                      }
                      rows={2}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes…"
                    />
                    <Button
                      variant="secondary"
                      className="h-10 rounded-[10px] text-sm"
                      onClick={() => saveNotes(app.id)}
                      disabled={saving[`notes_${app.id}`]}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {app.status !== "in_review" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => updateStatus(app.id, "in_review")}
                      disabled={saving[app.id]}
                    >
                      Mark in review
                    </Button>
                  )}
                  {app.status !== "approved" && (
                    <Button
                      className="h-9 rounded-[10px] bg-blue-700 text-sm text-white hover:bg-blue-800"
                      onClick={() => updateStatus(app.id, "approved")}
                      disabled={saving[app.id]}
                    >
                      Approve
                    </Button>
                  )}
                  {app.status !== "rejected" && (
                    <Button
                      variant="secondary"
                      className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => updateStatus(app.id, "rejected")}
                      disabled={saving[app.id]}
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
