"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

interface Enquiry {
  id: string;
  created_at: string;
  property_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled_at: string | null;
  property_title?: string | null;
}

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", message: "" });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user?.email) return;

      const { data, error: loadError } = await supabaseClient
        .from("enquiries")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (loadError) throw loadError;
      setEnquiries(data ?? []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load your enquiries.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  function startEdit(enquiry: Enquiry) {
    setEditingId(enquiry.id);
    setEditForm({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone ?? "",
      message: enquiry.message,
    });
    setError(null);
  }

  async function saveEdit(enquiryId: string) {
    const next = {
      name: editForm.name.trim(),
      email: editForm.email.trim().toLowerCase(),
      phone: editForm.phone.trim() || null,
      message: editForm.message.trim(),
    };

    if (!next.name || !next.email || !next.message) {
      setError("Name, email, and message are required.");
      return;
    }

    setWorking((prev) => ({ ...prev, [enquiryId]: true }));
    setError(null);

    const { error: updateError } = await supabaseClient
      .from("enquiries")
      .update(next)
      .eq("id", enquiryId);

    setWorking((prev) => ({ ...prev, [enquiryId]: false }));

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEnquiries((prev) =>
      prev.map((enquiry) => (enquiry.id === enquiryId ? { ...enquiry, ...next } : enquiry))
    );
    setEditingId(null);
  }

  async function deleteEnquiry(enquiry: Enquiry) {
    const confirmed = window.confirm("Delete this enquiry? This cannot be undone.");
    if (!confirmed) return;

    setWorking((prev) => ({ ...prev, [enquiry.id]: true }));
    setError(null);

    const { error: deleteError } = await supabaseClient
      .from("enquiries")
      .delete()
      .eq("id", enquiry.id);

    setWorking((prev) => ({ ...prev, [enquiry.id]: false }));

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setEnquiries((prev) => prev.filter((item) => item.id !== enquiry.id));
  }

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-bold tracking-tight text-gray-900">My enquiries</h1>
      <p className="mb-6 text-[14px] text-gray-500">Messages you&apos;ve sent to agents about properties.</p>

      {loading && (
        <div className="flex items-center gap-2 text-[14px] text-gray-400">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading enquiries...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-[14px] text-red-700">
          {error}
        </div>
      )}

      {!loading && enquiries.length === 0 && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-gray-900">No enquiries yet</p>
          <p className="mt-1 text-[13px] text-gray-500">
            When you send a message to an agent from a property page, it will appear here.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-block rounded-lg bg-[#08519A] px-5 py-2.5 text-[13.5px] font-semibold !text-white hover:bg-[#063d75]"
          >
            Browse properties
          </Link>
        </div>
      )}

      {!loading && enquiries.length > 0 && (
        <div className="space-y-3">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/property/${enq.property_id}`}
                    className="text-[15px] font-semibold text-[#08519A] hover:underline"
                  >
                    {enq.property_title || "View property"}
                  </Link>
                  <p className="mt-0.5 text-[12px] text-gray-400">
                    Sent {new Date(enq.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    enq.handled_at
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-blue-100 bg-blue-50 text-blue-700"
                  }`}
                >
                  {enq.handled_at ? "Handled" : "Sent"}
                </span>
              </div>

              {editingId === enq.id ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={editForm.name}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="h-11 rounded-xl border border-[#E5E7EB] px-3 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="h-11 rounded-xl border border-[#E5E7EB] px-3 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                    <input
                      value={editForm.phone}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="h-11 rounded-xl border border-[#E5E7EB] px-3 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                      placeholder="Phone"
                    />
                  </div>
                  <textarea
                    value={editForm.message}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, message: event.target.value }))}
                    rows={4}
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Message"
                  />
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5">
                    <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-gray-700">
                      {enq.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[12px] text-gray-400">
                    <span>From: <span className="text-gray-600">{enq.name}</span></span>
                    <span>Email: <span className="text-gray-600">{enq.email}</span></span>
                    {enq.phone && <span>Phone: <span className="text-gray-600">{enq.phone}</span></span>}
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-2">
                {editingId === enq.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(enq.id)}
                      disabled={working[enq.id]}
                      className="h-9 rounded-lg bg-[#08519A] px-4 text-[13px] font-semibold !text-white hover:bg-[#063d75] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      disabled={working[enq.id]}
                      className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-4 text-[13px] font-semibold text-gray-700 hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(enq)}
                      disabled={working[enq.id]}
                      className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-4 text-[13px] font-semibold text-gray-700 hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEnquiry(enq)}
                      disabled={working[enq.id]}
                      className="h-9 rounded-lg border border-red-200 bg-white px-4 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
