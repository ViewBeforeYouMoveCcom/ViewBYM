"use client";

import { useEffect, useState } from "react";

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
  // real schema: no is_handled boolean — use handled_at timestamptz instead
  handled_at: string | null;
  created_at: string;
  property: EnquiryProperty | null;
}

export default function AgentEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<Record<string, boolean>>({});
  const [showHandled, setShowHandled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
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

    // Fetch properties for this agency (to build property map)
    const { data: agencyProperties } = await supabaseClient
      .from("properties")
      .select("id, title, address_line1")
      .eq("agency_id", membership.agency_id);

    if (!agencyProperties || agencyProperties.length === 0) {
      setEnquiries([]);
      setLoading(false);
      return;
    }

    const propertyIds = agencyProperties.map((p) => p.id);
    const propertyMap: Record<string, EnquiryProperty> = {};
    for (const p of agencyProperties) {
      propertyMap[p.id] = p;
    }

    // Fetch enquiries by agency_id directly (real schema has agency_id on enquiries)
    const { data: enquiryData } = await supabaseClient
      .from("enquiries")
      .select("id, name, email, phone, message, handled_at, created_at, property_id")
      .eq("agency_id", membership.agency_id)
      .in("property_id", propertyIds)
      .order("created_at", { ascending: false });

    const mapped: Enquiry[] = (enquiryData ?? []).map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      message: e.message,
      handled_at: e.handled_at,
      created_at: e.created_at,
      property: propertyMap[e.property_id] ?? null,
    }));

    setEnquiries(mapped);
    setLoading(false);
  }

  async function markHandled(enquiryId: string, handle: boolean) {
    setWorking((prev) => ({ ...prev, [enquiryId]: true }));
    const update = handle
      ? { handled_at: new Date().toISOString(), handled_by: userId }
      : { handled_at: null, handled_by: null };

    await supabaseClient
      .from("enquiries")
      .update(update)
      .eq("id", enquiryId);

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId
          ? { ...e, handled_at: handle ? new Date().toISOString() : null }
          : e
      )
    );
    setWorking((prev) => ({ ...prev, [enquiryId]: false }));
  }

  const filtered = showHandled ? enquiries : enquiries.filter((e) => !e.handled_at);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">Enquiries</h1>
        <button
          type="button"
          onClick={() => setShowHandled((v) => !v)}
          className="text-sm text-blue-700 hover:underline"
        >
          {showHandled ? "Hide handled" : "Show all (including handled)"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#0F172A]">{enquiry.name}</p>
                      {enquiry.handled_at && <Badge variant="success">Handled</Badge>}
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
                  {enquiry.phone && <span> · {enquiry.phone}</span>}
                </div>

                <p className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm text-[#0F172A]">
                  {enquiry.message}
                </p>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(
                      enquiry.property?.title || enquiry.property?.address_line1 || "your enquiry"
                    )}`}
                    className="inline-flex h-9 items-center rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#0F172A] hover:bg-[#F9FAFB]"
                  >
                    Reply by email
                  </a>
                  <Button
                    variant="secondary"
                    className="h-9 rounded-[10px] text-sm"
                    onClick={() => markHandled(enquiry.id, !enquiry.handled_at)}
                    disabled={working[enquiry.id]}
                  >
                    {enquiry.handled_at ? "Mark unhandled" : "Mark handled"}
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
