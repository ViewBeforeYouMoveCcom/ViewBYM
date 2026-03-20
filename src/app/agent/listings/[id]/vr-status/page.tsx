"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

type SubmissionStatus =
  | "not_submitted"
  | "queued"
  | "processing"
  | "ready"
  | "rejected";

interface VrRecord {
  id: string;
  submission_status: SubmissionStatus;
  submission_notes: string | null;
  submitted_at: string | null;
  embed_url: string | null;
  raw_footage_path: string | null;
}

interface PropertyContext {
  id: string;
  title: string | null;
  address_line1: string | null;
}

const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    label: string;
    variant: "default" | "success" | "warning" | "error" | "amber";
    heading: string;
    body: string;
  }
> = {
  not_submitted: {
    label: "Not submitted",
    variant: "default",
    heading: "No VR material submitted yet",
    body: "Submit your 360° footage or an embed URL to start the processing workflow. Once submitted, the VBYM team will process and publish your tour.",
  },
  queued: {
    label: "Queued",
    variant: "amber",
    heading: "Submission received — in queue",
    body: "Your VR material has been received and is in the processing queue. The VBYM team will begin work shortly. Typical turnaround is 2–5 working days.",
  },
  processing: {
    label: "Processing",
    variant: "warning",
    heading: "Processing in progress",
    body: "Your VR tour is currently being processed by the VBYM team. We will update this page when the tour is ready to preview and publish.",
  },
  ready: {
    label: "Live",
    variant: "success",
    heading: "VR tour is live",
    body: "Your VR tour has been processed and is now live on your listing. Buyers can view the tour directly from the property page.",
  },
  rejected: {
    label: "Rejected",
    variant: "error",
    heading: "Submission rejected",
    body: "Your submission could not be processed. Please review the notes below and resubmit with updated material.",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VrStatusPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyContext | null>(null);
  const [vr, setVr] = useState<VrRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: prop }, { data: vrData }] = await Promise.all([
        supabaseClient
          .from("properties")
          .select("id, title, address_line1")
          .eq("id", id)
          .single(),
        supabaseClient
          .from("property_vr")
          .select(
            "id, submission_status, submission_notes, submitted_at, embed_url, raw_footage_path"
          )
          .eq("property_id", id)
          .maybeSingle(),
      ]);

      if (prop) setProperty(prop as unknown as PropertyContext);
      if (vrData) setVr(vrData as unknown as VrRecord);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-48 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
      </div>
    );
  }

  const status: SubmissionStatus = vr?.submission_status ?? "not_submitted";
  const config = STATUS_CONFIG[status];
  const listingTitle =
    property?.title || property?.address_line1 || "This listing";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <Link href="/agent/listings" className="hover:text-[#0F172A]">
          Listings
        </Link>
        <span>/</span>
        <Link href={`/agent/listings/${id}`} className="hover:text-[#0F172A]">
          {listingTitle}
        </Link>
        <span>/</span>
        <span className="text-[#0F172A]">VR status</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          VR tour status
        </h1>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      {/* Status card */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <p className="text-[15px] font-semibold text-[#0F172A]">
            {config.heading}
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">{config.body}</p>

          {/* Submission metadata */}
          {vr && (
            <div className="mt-5 space-y-2">
              <div className="grid grid-cols-[120px_1fr] gap-1 text-sm">
                <span className="text-[#6B7280]">Submitted</span>
                <span className="text-[#0F172A]">
                  {formatDate(vr.submitted_at)}
                </span>
              </div>
              {vr.embed_url && (
                <div className="grid grid-cols-[120px_1fr] gap-1 text-sm">
                  <span className="text-[#6B7280]">Source URL</span>
                  <a
                    href={vr.embed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-700 hover:underline"
                  >
                    {vr.embed_url}
                  </a>
                </div>
              )}
              {vr.raw_footage_path && (
                <div className="grid grid-cols-[120px_1fr] gap-1 text-sm">
                  <span className="text-[#6B7280]">Footage</span>
                  <span className="text-[#0F172A]">Uploaded</span>
                </div>
              )}
            </div>
          )}

          {/* Rejection notes from VBYM team */}
          {status === "rejected" && vr?.submission_notes && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Rejection notes from VBYM
              </p>
              <p className="mt-1.5 text-sm text-red-700/80">
                {vr.submission_notes}
              </p>
            </div>
          )}

          {/* Processing notes from VBYM team (if any, non-rejection) */}
          {status !== "rejected" && vr?.submission_notes && (
            <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="text-sm font-semibold text-[#0F172A]">
                Notes from VBYM
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                {vr.submission_notes}
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            {(status === "not_submitted" || status === "rejected") && (
              <Link
                href={`/agent/listings/${id}/vr-upload`}
                className="inline-flex h-10 items-center rounded-[10px] bg-blue-700 px-5 text-[13.5px] font-semibold text-white hover:bg-blue-800"
              >
                {status === "rejected" ? "Resubmit" : "Submit VR material"}
              </Link>
            )}
            {status === "ready" && vr?.embed_url && (
              <a
                href={vr.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-[10px] bg-blue-700 px-5 text-[13.5px] font-semibold text-white hover:bg-blue-800"
              >
                Preview tour
              </a>
            )}
            <Link
              href={`/agent/listings/${id}`}
              className="inline-flex h-10 items-center rounded-[10px] border border-[#E5E7EB] bg-white px-5 text-[13.5px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              Back to listing
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline steps */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <p className="mb-4 text-sm font-semibold text-[#0F172A]">
            Processing pipeline
          </p>
          <div className="space-y-3">
            {(
              [
                {
                  step: "not_submitted",
                  label: "Material submitted",
                  desc: "Agent uploads footage or submits embed URL",
                },
                {
                  step: "queued",
                  label: "In queue",
                  desc: "VBYM team picks up the submission",
                },
                {
                  step: "processing",
                  label: "Processing",
                  desc: "Tour is being built and quality-checked",
                },
                {
                  step: "ready",
                  label: "Live",
                  desc: "Tour published on listing for buyers",
                },
              ] as const
            ).map((item, idx) => {
              const steps: SubmissionStatus[] = [
                "not_submitted",
                "queued",
                "processing",
                "ready",
              ];
              const currentIdx = steps.indexOf(
                status === "rejected" ? "not_submitted" : status
              );
              const itemIdx = steps.indexOf(item.step);
              const isDone = itemIdx < currentIdx;
              const isCurrent = itemIdx === currentIdx && status !== "rejected";

              return (
                <div key={idx} className="flex gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isDone
                        ? "border-blue-500 bg-blue-500 text-white"
                        : isCurrent
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-[#E5E7EB] bg-white text-[#6B7280]"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </div>
                  <div className="pt-0.5">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent ? "text-blue-700" : "text-[#0F172A]"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[13px] text-[#6B7280]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
