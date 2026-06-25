"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}

export default function VrUploadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<PropertyContext | null>(null);
  const [vr, setVr] = useState<VrRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);

    if (selectedFiles.some((file) => !file.type.startsWith("video/"))) {
      setFiles([]);
      setError("VR upload must be a video file.");
      e.target.value = "";
      return;
    }

    setFiles(selectedFiles);
    setError(null);
    e.target.value = "";
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseClient.auth.getUser();
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

      if (prop) setProperty(prop as unknown as PropertyContext);

      const { data: vrData } = await supabaseClient
        .from("property_vr")
        .select("id, submission_status, submitted_at")
        .eq("property_id", id)
        .maybeSingle();

      setVr(
        vrData
          ? (vrData as unknown as VrRecord)
          : { id: null, submission_status: "not_submitted", submitted_at: null }
      );

      setLoading(false);
    }
    load();
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) return;
    setSubmitting(true);
    setError(null);
    setUploadProgress(0);
    setUploadSpeed(0);
    setUploadedBytes(0);

    try {
      let rawFootagePath: string | null = null;
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      setTotalBytes(totalSize);
      let uploadedSoFar = 0;
      const startTime = Date.now();

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${agencyId ?? "unknown"}/${id}/vr-raw/${Date.now()}-${safeName}`;

        // Get auth token before creating the Promise
        const { data: { session } } = await supabaseClient.auth.getSession();
        const token = session?.access_token;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        // Upload with progress tracking using XMLHttpRequest
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const fileProgress = uploadedSoFar + e.loaded;
              setUploadedBytes(fileProgress);
              
              const progress = (fileProgress / totalSize) * 100;
              setUploadProgress(progress);

              const elapsedSeconds = (Date.now() - startTime) / 1000;
              const speed = fileProgress / elapsedSeconds;
              setUploadSpeed(speed);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadedSoFar += file.size;
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
          });

          xhr.open('POST', `${supabaseUrl}/storage/v1/object/property-media/${storagePath}`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('apikey', anonKey || '');
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        if (!rawFootagePath) rawFootagePath = storagePath;
      }

      const vrPayload = {
        property_id: id,
        submission_status: "ready",
        submitted_at: new Date().toISOString(),
        raw_footage_path: rawFootagePath,
        video_path: rawFootagePath ? `property-media/${rawFootagePath}` : null,
        is_enabled: true,
        ...(notes.trim() ? { submission_notes: notes.trim() } : {}),
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

      router.push(`/agent/listings/${id}/vr-status`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-64 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
      </div>
    );
  }

  const inPipeline =
    vr?.submission_status === "queued" ||
    vr?.submission_status === "processing";

  if (inPipeline) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Link href={`/agent/listings/${id}`} className="hover:text-[#0F172A]">← Listing</Link>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A]">VR submission</h1>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-semibold text-[#0F172A]">
            {vr?.submission_status === "ready" ? "VR tour is live" : "Submission received"}
          </p>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            {vr?.submission_status === "queued" && "Your footage is in the VBYM processing queue. We will update the status when work begins."}
            {vr?.submission_status === "processing" && "Your VR tour is currently being processed by the VBYM team. We will notify you when it is ready."}
            {vr?.submission_status === "ready" && "Your VR tour has been processed and is live on your listing."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link href={`/agent/listings/${id}/vr-status`}
              className="inline-flex h-9 items-center rounded-[10px] bg-blue-700 px-4 text-[13.5px] font-semibold text-white hover:bg-blue-800">
              View status
            </Link>
            <Link href={`/agent/listings/${id}`}
              className="inline-flex h-9 items-center rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-[13.5px] font-semibold text-[#374151] hover:bg-[#F9FAFB]">
              Back to listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <Link href="/agent/listings" className="hover:text-[#0F172A]">Listings</Link>
        <span>/</span>
        <Link href={`/agent/listings/${id}`} className="hover:text-[#0F172A]">
          {property?.title || property?.address_line1 || "Edit listing"}
        </Link>
        <span>/</span>
        <span className="text-[#0F172A]">VR submission</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Submit VR footage</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {vr?.submission_status === "rejected"
            ? "Your previous submission was rejected. Please review the feedback and resubmit."
            : "Upload your raw 360° footage. VBYM will process and host it securely — no third-party URLs or embeds are used."}
        </p>
      </div>

      {vr?.submission_status === "rejected" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Previous submission was rejected.</p>
          <p className="mt-1">
            Check the{" "}
            <Link href={`/agent/listings/${id}/vr-status`} className="underline">status page</Link>
            {" "}for details, then resubmit below.
          </p>
        </div>
      )}

      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">360° footage files</p>
              <p className="text-[13px] text-[#6B7280]">
                Upload your 360° video files. Accepted: MP4 or MOV. Max 5 GB per file.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/mov,video/quicktime"
                multiple
                className="hidden"
                onChange={onFileChange}
              />

              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm">
                      <span className="truncate text-[#0F172A]">{f.name}</span>
                      <span className="ml-3 shrink-0 text-[12px] text-[#6B7280]">
                        {(f.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" className="h-9 rounded-[10px] text-sm"
                    onClick={() => fileInputRef.current?.click()}>
                    Change files
                  </Button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
                  </svg>
                  <p className="text-[14px] font-semibold text-gray-700">Click to select footage</p>
                  <p className="text-[12px] text-gray-400">MP4 or MOV — up to 5 GB</p>
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
                <p className="font-semibold">Platform-only processing</p>
                <p className="mt-1">
                  Your footage is uploaded directly to VBYM&apos;s storage and saved to this listing.
                  No third-party services are used. The final VR tour is served exclusively through this platform via secure, time-limited access.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                Notes for VBYM team <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Main entrance at the back, shoot done in natural light only…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {submitting && (
              <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#0F172A]">Uploading VR footage...</span>
                  <span className="text-[#6B7280]">{uploadProgress.toFixed(1)}%</span>
                </div>
                
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-100">
                  <div 
                    className="h-full bg-[#08519A] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
                  <span>
                    {(uploadedBytes / (1024 * 1024)).toFixed(1)} MB of {(totalBytes / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  <span>
                    {uploadSpeed > 0 ? `${(uploadSpeed / (1024 * 1024)).toFixed(2)} MB/s` : 'Calculating...'}
                  </span>
                </div>

                {uploadSpeed > 0 && uploadProgress < 100 && (
                  <div className="text-[12px] text-[#6B7280]">
                    Remaining: {Math.ceil((totalBytes - uploadedBytes) / uploadSpeed)} seconds
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={submitting || files.length === 0}
                className="h-11 rounded-[10px] bg-[#08519A] px-6 text-sm font-semibold !text-white hover:bg-[#063d75] disabled:opacity-40">
                {submitting ? "Uploading…" : "Submit for processing"}
              </Button>
              <Button type="button" variant="secondary" className="h-11 rounded-[10px] px-6 text-sm"
                onClick={() => router.push(`/agent/listings/${id}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <p className="text-sm font-semibold text-[#0F172A]">Filming requirements</p>
        <ul className="mt-2 space-y-1.5 text-[13px] text-[#6B7280]">
          <li>• Shoot in good natural or artificial light — no motion blur</li>
          <li>• Cover all main rooms: living area, kitchen, bedrooms, bathrooms</li>
          <li>• Include hallways and key transition spaces</li>
          <li>• Shoot from door-height (approx. 1.4 m) for natural perspective</li>
          <li>• Avoid capturing faces, personal documents, or screen content</li>
        </ul>
      </div>
    </div>
  );
}
