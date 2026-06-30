"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

interface Invite {
  id: string;
  token: string;
  note: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  used_by_agency_id: string | null;
}

const APP_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState(30);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ token: string; ok: boolean; error?: string } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient
      .from("agency_invites")
      .select("id, token, note, used_at, expires_at, created_at, used_by_agency_id")
      .order("created_at", { ascending: false });
    setInvites((data as Invite[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createInvite() {
    setCreating(true);
    setEmailStatus(null);
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + expiryDays);

    await supabaseClient
      .from("agency_invites")
      .insert({
        note: note.trim() || null,
        expires_at: expires_at.toISOString(),
      });

    // Fetch the token of the invite we just created
    const { data: newInvite } = await supabaseClient
      .from("agency_invites")
      .select("token")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // If a recipient email was provided, send the invite link directly
    if (recipientEmail.trim() && newInvite?.token) {
      const { data: { session } } = await supabaseClient.auth.getSession();
      const res = await fetch("/api/admin/send-invite-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: recipientEmail.trim(), token: newInvite.token }),
      });
      const result = await res.json() as { sent?: boolean; error?: string };
      setEmailStatus({ token: newInvite.token, ok: res.ok, error: result.error });
    }

    setNote("");
    setRecipientEmail("");
    load();
    setCreating(false);
  }

  async function revokeInvite(id: string) {
    await supabaseClient.from("agency_invites").delete().eq("id", id);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  function copyLink(token: string) {
    const url = `${APP_URL}/agents/join/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  function inviteStatus(invite: Invite): { label: string; colour: string } {
    if (invite.used_at) return { label: "Used", colour: "bg-green-100 text-green-700" };
    if (invite.expires_at && new Date(invite.expires_at) < new Date())
      return { label: "Expired", colour: "bg-red-100 text-red-700" };
    return { label: "Active", colour: "bg-blue-100 text-blue-700" };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Invites</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share an invite link with an agency to bypass the approval flow — they go straight to signup.
        </p>
      </div>

      {/* Create invite */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-gray-900">Create invite</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-[12.5px] font-medium text-gray-500">Note (optional)</label>
              <input
                type="text"
                placeholder="e.g. Jones & Partners, Manchester"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#08519A]/40 focus:bg-white"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[12.5px] font-medium text-gray-500">Email invite to (optional)</label>
              <input
                type="email"
                placeholder="agent@agency.co.uk"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#08519A]/40 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-gray-500">Expires in</label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-[13.5px] text-gray-700 outline-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
            <button
              onClick={createInvite}
              disabled={creating}
              className="h-10 rounded-lg bg-[#08519A] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#063d75] disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create invite"}
            </button>
          </div>

          {emailStatus && (
            <p className={`text-[12px] ${emailStatus.ok ? "text-green-600" : "text-red-500"}`}>
              {emailStatus.ok
                ? "Invite email sent successfully."
                : `Email failed: ${emailStatus.error ?? "unknown error"} — copy the link manually.`}
            </p>
          )}
        </div>
        <p className="mt-3 text-[12px] text-gray-400">
          The invite link can be used once. The agency skips the application queue and gets an approved account immediately.
        </p>
      </div>

      {/* Invite list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">
            All invites{" "}
            {!loading && (
              <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {invites.length}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center justify-between px-5 py-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-48 rounded-full bg-gray-200" />
                  <div className="h-3 w-32 rounded-full bg-gray-100" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-24 rounded-lg bg-gray-100" />
                  <div className="h-8 w-16 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : invites.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-400">No invites yet. Create one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invites.map((invite) => {
              const status = inviteStatus(invite);
              const url = `${APP_URL}/agents/join/${invite.token}`;
              return (
                <li key={invite.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${status.colour}`}>
                        {status.label}
                      </span>
                      {invite.note && (
                        <span className="text-[13px] font-medium text-gray-900">{invite.note}</span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[11.5px] text-gray-400 font-mono">{url}</p>
                    <p className="text-[11.5px] text-gray-400">
                      Created {new Date(invite.created_at).toLocaleDateString("en-GB")}
                      {invite.expires_at && ` · Expires ${new Date(invite.expires_at).toLocaleDateString("en-GB")}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!invite.used_at && (
                      <button
                        onClick={() => copyLink(invite.token)}
                        className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-[12.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {copied === invite.token ? "Copied!" : "Copy link"}
                      </button>
                    )}
                    {!invite.used_at && (
                      <button
                        onClick={() => revokeInvite(invite.id)}
                        className="h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-[12.5px] font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
