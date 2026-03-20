"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

interface PropertyContext {
  id: string;
  title: string | null;
  address_line1: string | null;
  agency_id: string;
}

interface VrRecord {
  id: string | null;
  submission_status: string;
  submitted_at: string | null;
  embed_url: string | null;
}

// Method the agent is choosing for this submission
type SubmitMethod = "footage" | "url";

export default function VrUploadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<PropertyContext | null>(null);
  const [vr, setVr] = useState<VrRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  const [method, setMethod] = useState<SubmitMethod>("url");
  const [embedUrl, setEmbedUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabaseClient
        .from("agency_members")
        .select("agency_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      setAgencyId(membership?.agency_id ?? null);

      const { data: prop } = await supabaseClient
        .from("properties")
        .select("id, title, address_line1, agency_id")
        .eq("id", id)
        .single();

      if (prop) {
        setProperty(prop as unknown as PropertyContext);
      }

      const { data: vrData } = await supabaseClient
        .from("property_vr")
        .select("id, submission_status, submitted_at, embed_url")
        .eq("property_id", id)
        .maybeSingle();

      setVr(
        vrData
          ? (vrData as unknown as VrRecord)
          : {
              id: null,
              submission_status: "not_submitted",
              submitted_at: null,
              embed_url: null,
            }
      );

      setLoading(false);
    }
    load();
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let rawFootagePath: string | null = null;

      // ── Upload raw footage files to Storage ─────────────
      if (method === "footage" && files.length > 0) {
        for (const file of files) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `${agencyId ?? "unknown"}/${id}/vr-raw/${Date.now()}-${safeName}`;

          const { error: uploadErr } = await supabaseClient.storage
            .from("vr-footage")
            .upload(storagePath, file, { upsert: false });

          if (uploadErr) {
            setError(`File upload failed: ${uploadErr.message}`);
            setSubmitting(false);
            return;
          }

          // Store path of first file as the primary reference
          if (!rawFootagePath) rawFootagePath = storagePath;
        }
      }

      const vrPayload = {
        property_id: id,
        submission_status: "queued",
        submitted_at: new Date().toISOString(),
        raw_footage_path: rawFootagePath,
        embed_url: method === "url" && embedUrl.trim() ? embedUrl.trim() : null,
        is_enabled: true,
      };

      if (vr?.id) {
        const { error: updateErr } = await supabaseClient
          .from("property_vr")
          .update(vrPayload)
          .eq("id", vr.id);

        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabaseClient
          .from("property_vr")
          .insert(vrPayload);

        if (insertErr) throw insertErr;
      }

      // Redirect to status page after submission
      router.push(`/agent/listings/${id}/vr-status`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
      setSubmitting(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-64 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
      </div>
    );
  }

  // ── Already submitted and in pipeline ───────────────────
  const inPipeline =
    vr?.submission_status === "queued" ||
    vr?.submission_status === "processing" ||
    vr?.submission_status === "ready";

  if (inPipeline) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/agent/listings/${id}`}
            className="text-sm text-[#6B7280] hover:text-[#0F172A]"
          >
            ← Listing
          </Link>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          VR submission
        </h1>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-semibold text-[#0F172A]">
            {vr?.submission_status === "ready"
              ? "VR tour is live"
              : "Submission received"}
          </p>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            {vr?.submission_status === "queued" &&
              "Your material has been submitted and is in the VBYM processing queue. We will update the status when work begins."}
            {vr?.submission_status === "processing" &&
              "Your VR tour is currently being processed by the VBYM team. We will notify you when it is ready."}
            {vr?.submission_status === "ready" &&
              "Your VR tour has been processed and is live on your listing."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={`/agent/listings/${id}/vr-status`}
              className="inline-flex h-9 items-center rounded-[10px] bg-blue-700 px-4 text-[13.5px] font-semibold text-white hover:bg-blue-800"
            >
              View status
            </Link>
            <Link
              href={`/agent/listings/${id}`}
              className="inline-flex h-9 items-center rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-[13.5px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              Back to listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main upload form ─────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <Link href="/agent/listings" className="hover:text-[#0F172A]">
          Listings
        </Link>
        <span>/</span>
        <Link href={`/agent/listings/${id}`} className="hover:text-[#0F172A]">
          {property?.title || property?.address_line1 || "Edit listing"}
        </Link>
        <span>/</span>
        <span className="text-[#0F172A]">VR submission</span>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          Submit VR material
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {vr?.submission_status === "rejected"
            ? "Your previous submission was rejected. Please review the feedback and resubmit."
            : "Submit your 360° footage or embed URL. VBYM will process it and publish the tour on your listing."}
        </p>
      </div>

      {/* Rejection notice */}
      {vr?.submission_status === "rejected" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Previous submission was rejected.</p>
          <p className="mt-1">
            Please check the{" "}
            <Link
              href={`/agent/listings/${id}/vr-status`}
              className="underline"
            >
              status page
            </Link>{" "}
            for details, then resubmit below.
          </p>
        </div>
      )}

      {/* Method selector */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <p className="mb-4 text-sm font-semibold text-[#0F172A]">
            How would you like to submit?
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "url" as SubmitMethod,
                label: "Submit embed URL",
                desc: "You already have a Matterport, Kuula, or custom tour URL. VBYM will integrate it.",
              },
              {
                value: "footage" as SubmitMethod,
                label: "Upload raw footage",
                desc: "Upload your 360° video or image files. VBYM will process and publish the tour.",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setMethod(opt.value);
                  setError(null);
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  method === opt.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-[#E5E7EB] bg-white hover:border-gray-300"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    method === opt.value ? "text-blue-700" : "text-[#0F172A]"
                  }`}
                >
                  {opt.label}
                </p>
                <p className="mt-1 text-[13px] text-[#6B7280]">{opt.desc}</p>
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* URL method */}
            {method === "url" && (
              <FormField id="embed-url" label="Tour URL">
                <Input
                  id="embed-url"
                  placeholder="https://my.matterport.com/show/?m=..."
                  value={embedUrl}
                  onChange={(e) => {
                    setEmbedUrl(e.target.value);
                    setError(null);
                  }}
                  required={method === "url"}
                />
                <p className="mt-1.5 text-[12px] text-[#6B7280]">
                  Accepted: Matterport share URLs, Kuula share URLs, or any
                  embeddable 360° tour link.
                </p>
              </FormField>
            )}

            {/* Footage upload method */}
            {method === "footage" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0F172A]">
                  360° footage files
                </p>
                <p className="text-[13px] text-[#6B7280]">
                  Upload your raw 360° video or image files. Accepted formats:
                  MP4, JPG, PNG. Max 500 MB per file.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/mov,image/jpeg,image/png"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    setFiles(Array.from(e.target.files ?? []));
                    setError(null);
                  }}
                />

                {files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm"
                      >
                        <span className="truncate text-[#0F172A]">{f.name}</span>
                        <span className="ml-3 shrink-0 text-[12px] text-[#6B7280]">
                          {(f.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 rounded-[10px] text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change files
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-[10px] text-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose files
                  </Button>
                )}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
                  <p className="font-semibold">Raw footage processing</p>
                  <p className="mt-1">
                    Once uploaded, the VBYM team will process your footage into a
                    polished VR experience. Processing typically takes 2–5
                    working days. You will be notified when your tour is ready.
                  </p>
                </div>
              </div>
            )}

            {/* Optional notes */}
            <FormField id="submission-notes" label="Notes for VBYM team (optional)">
              <textarea
                id="submission-notes"
                rows={2}
                placeholder="e.g. Main entrance is at the back, shoot was done in natural light only…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={
                  submitting ||
                  (method === "url" && !embedUrl.trim()) ||
                  (method === "footage" && files.length === 0)
                }
                className="h-11 rounded-[10px] bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800"
              >
                {submitting ? "Submitting…" : "Submit for processing"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-[10px] px-6 text-sm"
                onClick={() => router.push(`/agent/listings/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Guidance */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <p className="text-sm font-semibold text-[#0F172A]">
          Filming requirements
        </p>
        <ul className="mt-2 space-y-1.5 text-[13px] text-[#6B7280]">
          <li>• Shoot in good natural or artificial light — no motion blur</li>
          <li>• Cover all main rooms: living area, kitchen, bedrooms, bathrooms</li>
          <li>• Include hallways and key transition spaces</li>
          <li>• Shoot from door-height (approx. 1.4m) for natural perspective</li>
          <li>• Avoid capturing faces, personal documents, or screen content</li>
        </ul>
      </div>
    </div>
  );
}
