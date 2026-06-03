"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import { supabaseClient } from "@/lib/supabaseClient";

interface EnquiryProperty {
  id: string;
  title: string | null;
  address_line1: string | null;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled_at: string | null;
  created_at: string;
  property: EnquiryProperty | null;
}

export default function AgentEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<Record<string, boolean>>({});
  const [showHandled, setShowHandled] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { setLoading(false); return; }

    setUserId(user.id);

    const { data: membership } = await supabaseClient
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership) { setLoading(false); return; }

    const { data: agencyProperties } = await supabaseClient
      .from("properties")
      .select("id, title, address_line1")
      .eq("agency_id", membership.agency_id);

    if (!agencyProperties || agencyProperties.length === 0) {
      setEnquiries([]);
      setLoading(false);
      return;
    }

    const propertyIds = agencyProperties.map((property) => property.id);
    const propertyMap: Record<string, EnquiryProperty> = {};
    for (const property of agencyProperties) {
      propertyMap[property.id] = property;
    }

    const { data: enquiryData, error } = await supabaseClient
      .from("enquiries")
      .select("id, name, email, phone, message, handled_at, created_at, property_id")
      .eq("agency_id", membership.agency_id)
      .in("property_id", propertyIds)
      .order("created_at", { ascending: false });

    if (error) {
      setActionError(error.message);
      setLoading(false);
      return;
    }

    setEnquiries((enquiryData ?? []).map((enquiry) => ({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      message: enquiry.message,
      handled_at: enquiry.handled_at,
      created_at: enquiry.created_at,
      property: propertyMap[enquiry.property_id] ?? null,
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function markHandled(enquiryId: string, handle: boolean) {
    setWorking((prev) => ({ ...prev, [enquiryId]: true }));
    setActionError(null);
    const handledAt = new Date().toISOString();
    const update = handle
      ? { handled_at: handledAt, handled_by: userId }
      : { handled_at: null, handled_by: null };

    const { error } = await supabaseClient
      .from("enquiries")
      .update(update)
      .eq("id", enquiryId);

    setWorking((prev) => ({ ...prev, [enquiryId]: false }));

    if (error) {
      setActionError(error.message);
      return false;
    }

    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === enquiryId
          ? { ...enquiry, handled_at: handle ? handledAt : null }
          : enquiry
      )
    );
    return true;
  }

  async function replyByEmail(enquiry: Enquiry) {
    const marked = enquiry.handled_at ? true : await markHandled(enquiry.id, true);
    if (!marked) return;

    const subject = `Re: ${enquiry.property?.title || enquiry.property?.address_line1 || "your enquiry"}`;
    const body = [
      `Hi ${enquiry.name},`,
      "",
      "Thanks for your enquiry.",
      "",
      "Best regards,",
    ].join("\n");

    window.location.assign(`mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  function startEdit(enquiry: Enquiry) {
    setEditingId(enquiry.id);
    setEditForm({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone ?? "",
      message: enquiry.message,
    });
    setActionError(null);
  }

  async function saveEdit(enquiryId: string) {
    const next = {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim() || null,
      message: editForm.message.trim(),
    };

    setWorking((prev) => ({ ...prev, [enquiryId]: true }));
    setActionError(null);

    const { error } = await supabaseClient
      .from("enquiries")
      .update(next)
      .eq("id", enquiryId);

    setWorking((prev) => ({ ...prev, [enquiryId]: false }));

    if (error) {
      setActionError(error.message);
      return;
    }

    setEnquiries((prev) =>
      prev.map((enquiry) => (enquiry.id === enquiryId ? { ...enquiry, ...next } : enquiry))
    );
    setEditingId(null);
  }

  async function deleteEnquiry(enquiry: Enquiry) {
    const confirmed = window.confirm(`Delete enquiry from ${enquiry.name}? This cannot be undone.`);
    if (!confirmed) return;

    setWorking((prev) => ({ ...prev, [enquiry.id]: true }));
    setActionError(null);

    const { error } = await supabaseClient
      .from("enquiries")
      .delete()
      .eq("id", enquiry.id);

    setWorking((prev) => ({ ...prev, [enquiry.id]: false }));

    if (error) {
      setActionError(error.message);
      return;
    }

    setEnquiries((prev) => prev.filter((item) => item.id !== enquiry.id));
  }

  const handledCount = enquiries.filter((enquiry) => enquiry.handled_at).length;
  const newCount = enquiries.length - handledCount;
  const filtered = showHandled ? enquiries : enquiries.filter((enquiry) => !enquiry.handled_at);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">Enquiries</h1>
          {!loading && (
            <p className="mt-1 text-sm text-[#6B7280]">
              {newCount} new - {handledCount} handled
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowHandled((value) => !value)}
          className="text-sm text-blue-700 hover:underline"
        >
          {showHandled ? "Hide handled" : "Show all (including handled)"}
        </button>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Enquiries submitted through your listings will appear here."
          actionLabel="View listings"
          actionHref="/agent/listings"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((enquiry) => (
            <Card
              key={enquiry.id}
              className={`rounded-xl border ${enquiry.handled_at ? "border-[#E5E7EB] opacity-60" : "border-[#E5E7EB]"}`}
            >
              <CardContent className="space-y-3 p-5">
                {editingId === enquiry.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={editForm.name}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                        className="h-10 rounded-[10px] border border-[#E5E7EB] px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                        className="h-10 rounded-[10px] border border-[#E5E7EB] px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                      />
                      <input
                        value={editForm.phone}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
                        className="h-10 rounded-[10px] border border-[#E5E7EB] px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                        placeholder="Phone"
                      />
                    </div>
                    <textarea
                      value={editForm.message}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, message: event.target.value }))}
                      rows={4}
                      className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Message"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{enquiry.name}</p>
                          {enquiry.handled_at ? (
                            <Badge variant="success">Handled</Badge>
                          ) : (
                            <Badge variant="default">New</Badge>
                          )}
                        </div>
                        {enquiry.property && (
                          <p className="text-xs text-[#6B7280]">
                            Re: {enquiry.property.title || enquiry.property.address_line1}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {new Date(enquiry.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <div className="text-sm text-[#6B7280]">
                      <a href={`mailto:${enquiry.email}`} className="text-blue-700 hover:underline">
                        {enquiry.email}
                      </a>
                      {enquiry.phone && <span> - {enquiry.phone}</span>}
                    </div>

                    <p className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm text-gray-900">
                      {enquiry.message}
                    </p>
                  </>
                )}

                <div className="flex flex-wrap gap-2">
                  {editingId === enquiry.id ? (
                    <>
                      <Button
                        className="h-9 rounded-[10px] bg-[#08519A] text-sm !text-white hover:bg-[#063d75]"
                        onClick={() => saveEdit(enquiry.id)}
                        disabled={working[enquiry.id] || !editForm.name.trim() || !editForm.email.trim() || !editForm.message.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9 rounded-[10px] text-sm"
                        onClick={() => setEditingId(null)}
                        disabled={working[enquiry.id]}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => replyByEmail(enquiry)}
                        disabled={working[enquiry.id]}
                        className="inline-flex h-9 items-center rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-gray-900 hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reply by email
                      </button>
                      <Button
                        variant="secondary"
                        className="h-9 rounded-[10px] text-sm"
                        onClick={() => markHandled(enquiry.id, !enquiry.handled_at)}
                        disabled={working[enquiry.id]}
                      >
                        {enquiry.handled_at ? "Mark unhandled" : "Mark handled"}
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9 rounded-[10px] text-sm"
                        onClick={() => startEdit(enquiry)}
                        disabled={working[enquiry.id]}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => deleteEnquiry(enquiry)}
                        disabled={working[enquiry.id]}
                      >
                        Delete
                      </Button>
                    </>
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
