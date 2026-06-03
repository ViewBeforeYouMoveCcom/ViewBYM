"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

interface Enquiry {
  id: string;
  created_at: string;
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_title?: string;
}

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const { data, error } = await supabaseClient
          .from("enquiries")
          .select("*")
          .eq("email", user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEnquiries(data ?? []);
      } catch (err) {
        setError("Could not load your enquiries.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-bold tracking-tight text-gray-900">My enquiries</h1>
      <p className="mb-6 text-[14px] text-gray-500">Messages you&apos;ve sent to agents about properties.</p>

      {loading && (
        <div className="flex items-center gap-2 text-[14px] text-gray-400">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading enquiries…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-[14px] text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && enquiries.length === 0 && (
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
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  {enq.property_title ? (
                    <Link
                      href={`/property/${enq.property_id}`}
                      className="text-[15px] font-semibold text-[#08519A] hover:underline"
                    >
                      {enq.property_title}
                    </Link>
                  ) : (
                    <Link
                      href={`/property/${enq.property_id}`}
                      className="text-[15px] font-semibold text-[#08519A] hover:underline"
                    >
                      View property →
                    </Link>
                  )}
                  <p className="mt-0.5 text-[12px] text-gray-400">
                    Sent {new Date(enq.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                  Sent
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5">
                <p className="text-[13.5px] leading-relaxed text-gray-700 whitespace-pre-line">
                  {enq.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-[12px] text-gray-400">
                <span>From: <span className="text-gray-600">{enq.name}</span></span>
                <span>Email: <span className="text-gray-600">{enq.email}</span></span>
                {enq.phone && <span>Phone: <span className="text-gray-600">{enq.phone}</span></span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
