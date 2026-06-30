"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import FormField from "@/components/FormField";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";
import { preparePhotoFile } from "@/lib/videoFrameToJpeg";

type PropStatus = "draft" | "published" | "archived";

interface Property {
  id: string;
  title: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  price: number | null;           // numeric(12,2) GBP
  bedrooms: number | null;
  bathrooms: number | null;
  property_type: string;
  market_status: string;
  tenure: string | null;
  description: string | null;
  features: string[] | null;
  status: PropStatus;
}

interface MediaItem {
  id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
}

// New interface for local state management to include UI-specific properties
interface LocalMediaItem {
  tempId: string; // Unique key for React list rendering before DB ID
  id: string | null; // Supabase DB ID, null for new items until DB insert
  storage_path: string | null; // Supabase storage path, null for new items until upload
  public_url: string; // Blob URL for client-side preview, then Supabase URL
  sort_order: number;
  uploading: boolean; // True while processing/uploading
  error?: string; // Error message if upload/conversion failed
  originalFile?: File; // Keep original file for potential re-upload or info
}

const statusVariant: Record<PropStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function isTransientNetworkError(err: unknown) {
  return /failed to fetch|network|timeout|timed out|load failed/i.test(getErrorMessage(err));
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryTransient<T>(task: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (!isTransientNetworkError(err) || attempt === attempts) break;
      await wait(900 * attempt);
    }
  }

  throw lastError;
}

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<LocalMediaItem[]>([]); // Use LocalMediaItem
  const [floorplan, setFloorplan] = useState<MediaItem | null>(null);
  const [walkthrough, setWalkthrough] = useState<MediaItem | null>(null);
  const [form, setForm] = useState<Partial<Property>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [wtUploading, setWtUploading] = useState(false);
  const [wtProgress, setWtProgress] = useState(0);
  const [wtSpeed, setWtSpeed] = useState(0);
  const [wtUploadedBytes, setWtUploadedBytes] = useState(0);
  const [wtTotalBytes, setWtTotalBytes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const floorplanInputRef = useRef<HTMLInputElement>(null);
  const walkthroughInputRef = useRef<HTMLInputElement>(null);
  const draggedIdx = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    async function load() {
      const { data: prop } = await supabaseClient
        .from("properties")
        .select(
          "id, title, address_line1, address_line2, city, postcode, price, " +
          "bedrooms, bathrooms, property_type, market_status, tenure, description, features, status, agency_id"
        )
        .eq("id", id)
        .single();

      if (!prop) { router.push("/agent/listings"); return; }
      setProperty(prop as unknown as Property);
      setForm(prop as unknown as Property);
      setAgencyId((prop as unknown as Property & { agency_id: string }).agency_id ?? null);

      const { data: mediaData } = await supabaseClient
        .from("property_media")
        .select("id, storage_path, public_url, sort_order")
        .eq("property_id", id)
        .eq("type", "photo")
        .order("sort_order", { ascending: true });

      const isVideoUrl = (url: string) => /\.(mp4|mov|m4v|webm)(?:$|\?)/i.test(url);
      setPhotos(((mediaData ?? []) as MediaItem[]).filter((item) => !isVideoUrl(item.public_url)).map(item => ({
          ...item,
          tempId: item.id, // Use DB ID as tempId for existing items
          uploading: false,
          originalFile: undefined, // Not available for existing items
      })));

      const { data: floorplanData } = await supabaseClient
        .from("property_media")
        .select("id, storage_path, public_url, sort_order")
        .eq("property_id", id)
        .eq("type", "floorplan")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setFloorplan((floorplanData as MediaItem | null) ?? null);

      const { data: walkthroughData } = await supabaseClient
        .from("property_media")
        .select("id, storage_path, public_url, sort_order")
        .eq("property_id", id)
        .eq("type", "video")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setWalkthrough((walkthroughData as MediaItem | null) ?? null);
      setLoading(false);
    }
    load();
  }, [id, router]);

  function setField(field: string, value: string | number | string[] | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSaved(false);
  }

  async function saveDetails() {
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabaseClient
      .from("properties")
      .update({
        title: form.title ?? null,
        address_line1: form.address_line1 ?? null,
        address_line2: form.address_line2 ?? null,
        city: form.city ?? null,
        postcode: form.postcode ?? null,
        price: form.price ?? null,               // numeric(12,2) GBP
        bedrooms: form.bedrooms ?? null,
        bathrooms: form.bathrooms ?? null,
        property_type: form.property_type,
        market_status: form.market_status ?? "available",
        tenure: form.tenure ?? null,
        description: form.description ?? null,
        features: form.features ?? [],
      })
      .eq("id", id);
    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function changeStatus(status: PropStatus) {
    await supabaseClient.from("properties").update({ status }).eq("id", id);
    setProperty((prev) => prev ? { ...prev, status } : prev);
    setForm((prev) => ({ ...prev, status }));
  }

  function onPhotoDragStart(idx: number, tempId: string) {
    draggedIdx.current = idx;
    setDraggingId(tempId);
  }

  function onPhotoDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIdx(idx);
  }

  function onPhotoDrop(idx: number) {
    const from = draggedIdx.current;
    if (from === null || from === idx) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      next.forEach((p, i) => {
        if (p.id) {
          supabaseClient
            .from("property_media")
            .update({ sort_order: i })
            .eq("id", p.id)
            .then(() => {});
        }
      });
      return next.map((p, i) => ({ ...p, sort_order: i }));
    });
  }

  function onPhotoDragEnd() {
    setDraggingId(null);
    setDragOverIdx(null);
    draggedIdx.current = null;
  }

  function addFeature() {
    const val = featureInput.trim();
    const current = form.features ?? [];
    if (val && !current.includes(val)) {
      setField("features", [...current, val]);
    }
    setFeatureInput("");
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);

    // Track the count locally so we can assign correct sort_order in the loop
    let currentPhotoCount = photos.length; // Base for sort_order, will increment for each new file

    for (const file of files) {
      const tempId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const initialPreviewUrl = URL.createObjectURL(file); // Client-side blob URL for immediate preview

      const initialLocalMediaItem: LocalMediaItem = {
          tempId,
          id: null, // No DB ID yet
          storage_path: null, // No storage path yet
          public_url: initialPreviewUrl, // Client-side preview
          sort_order: currentPhotoCount, // Tentative sort order
          uploading: true,
          originalFile: file,
      };

      setPhotos((prev) => [...prev, initialLocalMediaItem]); // Add placeholder to UI immediately
      try {
        console.log(`Processing file: ${file.name} (${file.type})`);
        
        // 1. Convert video to JPEG with a 60-second timeout protection.
        // This prevents one bad video from hanging the entire upload process.
        const conversionPromise = preparePhotoFile(file);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Video conversion timed out. The file might be too large or incompatible.")), 60000)
        );

        const uploadFile = await Promise.race([conversionPromise, timeoutPromise]);
        console.log(`File prepared for upload: ${uploadFile.name} as ${uploadFile.type}`);

        // Create a URL for the new JPEG frame
        const jpegPreviewUrl = URL.createObjectURL(uploadFile);

        // Update UI to show the JPEG immediately while the upload happens in the background
        setPhotos((prev) => prev.map((item) =>
          item.tempId === tempId
              ? { ...item, public_url: jpegPreviewUrl, error: undefined }
              : item
        ));

        // Now it's safe to revoke the original video blob
        URL.revokeObjectURL(initialPreviewUrl);

        const timestamp = Date.now();
        const originalName = file.name;
        let safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

        // 2. Ensure proper extension for converted videos (e.g. video.mp4 -> video.jpg)
        // This is critical so the listing view doesn't filter it out as a "video".
        if (uploadFile.type.startsWith("image/") && /\.(mp4|mov|m4v|webm|qt|avi|mkv)$/i.test(safeName)) {
          safeName = safeName.replace(/\.[^.]+$/, ".jpg");
        }

        const storagePath = `${agencyId ?? "unknown"}/${id}/${timestamp}-${safeName}`;

        // 3. Upload the JPEG to Supabase Storage
        const { error: uploadErr } = await retryTransient(async () =>
          await supabaseClient.storage
            .from("property-media")
            .upload(storagePath, uploadFile, {
              contentType: uploadFile.type.startsWith("image/") ? "image/jpeg" : uploadFile.type,
              upsert: true,
            })
        );

        if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

        const { data: urlData } = supabaseClient.storage
          .from("property-media")
          .getPublicUrl(storagePath);

        // 4. Save metadata to DB with type "photo"
        const { data: mediaRow, error: insertErr } = await supabaseClient
          .from("property_media")
          .insert({
            property_id: id,
            type: "photo",
            storage_path: storagePath,
            public_url: urlData.publicUrl,
            sort_order: currentPhotoCount,
          })
          .select("id, storage_path, public_url, sort_order")
          .single();

        if (insertErr) throw new Error(`DB insert failed: ${insertErr.message}`);

        // Update the specific item in state with actual DB data and mark as not uploading
        setPhotos((prev) => prev.map((item) =>
            item.tempId === tempId
                ? {
                      ...item,
                      id: (mediaRow as MediaItem).id,
                      storage_path: (mediaRow as MediaItem).storage_path,
                      public_url: jpegPreviewUrl,
                      sort_order: (mediaRow as MediaItem).sort_order,
                      uploading: false,
                      error: undefined,
                  }
                : item
        ));
        currentPhotoCount++;

        // Add a small delay between files to allow the browser to garbage collect video decoders
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        console.error("Upload error:", err);
        const message = err instanceof Error ? err.message : "Could not prepare the selected photo for upload.";
        setPhotos((prev) => prev.map((item) =>
          item.tempId === tempId
              ? { ...item, uploading: false, error: message }
              : item
        ));
        setUploadError(`Failed for ${file.name}: ${message}`);
        // Continue to the next file rather than aborting the entire batch
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deletePhoto(photo: LocalMediaItem) {
    if (photo.storage_path) {
      await supabaseClient.storage
        .from("property-media")
        .remove([photo.storage_path]);
    }

    if (photo.id) {
      await supabaseClient
        .from("property_media")
        .delete()
        .eq("id", photo.id);
    }

    setPhotos((prev) => prev.filter((p) => p.tempId !== photo.tempId));
  }

  async function handleFloorplanUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${agencyId ?? "unknown"}/${id}/floorplan/${timestamp}-${safeName}`;

    const { error: uploadErr } = await supabaseClient.storage
      .from("property-media")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      setUploadError(`Floor plan upload failed: ${uploadErr.message}`);
      setUploading(false);
      return;
    }

    const publicUrl = supabaseClient.storage
      .from("property-media")
      .getPublicUrl(storagePath).data.publicUrl;

    const { data: mediaRow, error: insertErr } = await supabaseClient
      .from("property_media")
      .insert({
        property_id: id,
        type: "floorplan",
        storage_path: storagePath,
        public_url: publicUrl,
        sort_order: 0,
      })
      .select("id, storage_path, public_url, sort_order")
      .single();

    setUploading(false);
    if (floorplanInputRef.current) floorplanInputRef.current.value = "";

    if (insertErr) {
      setUploadError(`Floor plan save failed: ${insertErr.message}`);
      return;
    }

    if (floorplan) {
      await supabaseClient.storage.from("property-media").remove([floorplan.storage_path]);
      await supabaseClient.from("property_media").delete().eq("id", floorplan.id);
    }

    setFloorplan(mediaRow as MediaItem);
  }

  async function deleteFloorplan() {
    if (!floorplan) return;

    setUploading(true);
    setUploadError(null);

    await supabaseClient.storage.from("property-media").remove([floorplan.storage_path]);
    const { error: deleteErr } = await supabaseClient
      .from("property_media")
      .delete()
      .eq("id", floorplan.id);

    setUploading(false);

    if (deleteErr) {
      setUploadError(`Floor plan delete failed: ${deleteErr.message}`);
      return;
    }

    setFloorplan(null);
  }

  async function handleWalkthroughUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setWtUploading(true);
    setWtProgress(0);
    setWtSpeed(0);
    setWtUploadedBytes(0);
    setWtTotalBytes(file.size);
    setUploadError(null);

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() ?? "mp4";
    const storagePath = `${agencyId ?? "unknown"}/${id}/video/${timestamp}-walkthrough.${ext}`;

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      const token = session?.access_token;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const startTime = Date.now();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable) {
            setWtUploadedBytes(ev.loaded);
            setWtProgress((ev.loaded / ev.total) * 100);
            const elapsed = (Date.now() - startTime) / 1000;
            setWtSpeed(ev.loaded / elapsed);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));

        xhr.open("POST", `${supabaseUrl}/storage/v1/object/property-media/${storagePath}`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("apikey", anonKey || "");
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      const publicUrl = supabaseClient.storage
        .from("property-media")
        .getPublicUrl(storagePath).data.publicUrl;

      const { data: mediaRow, error: insertErr } = await supabaseClient
        .from("property_media")
        .insert({
          property_id: id,
          type: "video",
          storage_path: storagePath,
          public_url: publicUrl,
          sort_order: 0,
        })
        .select("id, storage_path, public_url, sort_order")
        .single();

      if (walkthroughInputRef.current) walkthroughInputRef.current.value = "";

      if (insertErr) {
        setUploadError(`Video save failed: ${insertErr.message}`);
      } else {
        if (walkthrough) {
          await supabaseClient.storage.from("property-media").remove([walkthrough.storage_path]);
          await supabaseClient.from("property_media").delete().eq("id", walkthrough.id);
        }
        setWalkthrough(mediaRow as MediaItem);
      }
    } catch (err) {
      setUploadError(`Video upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setWtUploading(false);
    }
  }

  async function deleteWalkthrough() {
    if (!walkthrough) return;

    setWtUploading(true);
    setUploadError(null);

    await supabaseClient.storage.from("property-media").remove([walkthrough.storage_path]);
    const { error: deleteErr } = await supabaseClient
      .from("property_media")
      .delete()
      .eq("id", walkthrough.id);

    setWtUploading(false);

    if (deleteErr) {
      setUploadError(`Video delete failed: ${deleteErr.message}`);
      return;
    }

    setWalkthrough(null);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-64 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            {property?.title || property?.address_line1 || "Edit listing"}
          </h1>
          {property && (
            <Badge variant={statusVariant[property.status]}>
              {property.status}
            </Badge>
          )}
        </div>

        {/* Status actions */}
        <div className="flex gap-2">
          {property?.status === "draft" && (
            <Button
              className="h-9 rounded-[10px] bg-[#08519A] text-sm !text-white hover:bg-[#063d75]"
              onClick={() => changeStatus("published")}
            >
              Publish
            </Button>
          )}
          {property?.status === "published" && (
            <Button
              variant="secondary"
              className="h-9 rounded-[10px] text-sm"
              onClick={() => changeStatus("draft")}
            >
              Unpublish
            </Button>
          )}
          {property?.status !== "archived" && (
            <Button
              variant="secondary"
              className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
              onClick={() => changeStatus("archived")}
            >
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Details form */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Property details</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField id="title" label="Title">
                <Input
                  id="title"
                  value={form.title ?? ""}
                  onChange={(e) => setField("title", e.target.value)}
                  required
                />
              </FormField>
            </div>

            {/* Address — Google Places Autocomplete */}
            <div className="md:col-span-2">
              <FormField id="address_line1" label="Address">
                <AddressAutocomplete
                  id="address_line1"
                  value={form.address_line1 ?? ""}
                  onChange={(raw) => setField("address_line1", raw)}
                  onSelect={({ line1, city, postcode }) => {
                    setForm((prev) => ({
                      ...prev,
                      address_line1: line1 || prev.address_line1,
                      city: city || prev.city,
                      postcode: postcode || prev.postcode,
                    }));
                    setSaved(false);
                  }}
                />
              </FormField>
            </div>

            <FormField id="city" label="City">
              <LocationAutocomplete
                id="city"
                value={form.city ?? ""}
                onChange={(v) => setField("city", v)}
                onSelect={(v) => setField("city", v)}
                placeholder="Town or city…"
              />
            </FormField>

            <FormField id="postcode" label="Postcode">
              <Input
                id="postcode"
                value={form.postcode ?? ""}
                onChange={(e) => setField("postcode", e.target.value)}
              />
            </FormField>

            <FormField id="market_status" label="Availability">
              <select
                id="market_status"
                value={form.market_status ?? "available"}
                onChange={(e) => setField("market_status", e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">New / Available</option>
                <option value="Under offer">Under offer</option>
                <option value="Sold STC">Sold STC</option>
                <option value="Let agreed">Let agreed</option>
              </select>
            </FormField>

            <FormField id="price" label="Price (£)">
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="625000"
                value={form.price ?? ""}
                onChange={(e) =>
                  setField("price", e.target.value ? parseFloat(e.target.value) : null)
                }
              />
            </FormField>

            <FormField id="property_type" label="Property type">
              <select
                id="property_type"
                value={form.property_type ?? "apartment"}
                onChange={(e) => setField("property_type", e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["apartment","house","townhouse","studio","detached","semi_detached","terraced","bungalow","cottage","penthouse","loft","other"].map((t) => (
                  <option key={t} value={t}>{t.replace("_", "-")}</option>
                ))}
              </select>
            </FormField>

            <FormField id="bedrooms" label="Bedrooms">
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms ?? ""}
                onChange={(e) => setField("bedrooms", e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormField>

            <FormField id="bathrooms" label="Bathrooms">
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms ?? ""}
                onChange={(e) => setField("bathrooms", e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormField>

            <FormField id="tenure" label="Tenure">
              <Input
                id="tenure"
                value={form.tenure ?? ""}
                onChange={(e) => setField("tenure", e.target.value)}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField id="description" label="Description">
                <textarea
                  id="description"
                  rows={4}
                  value={form.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField id="features" label="Key features">
                <div className="flex gap-2">
                  <Input
                    id="features"
                    placeholder="e.g. Underfloor heating"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-[10px] px-4 text-sm"
                    onClick={addFeature}
                    disabled={false}
                  >
                    Add
                  </Button>
                </div>
                {(form.features ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(form.features ?? []).map((f) => (
                      <span key={f} className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700">
                        {f}
                        <button
                          type="button"
                          onClick={() => setField("features", (form.features ?? []).filter((x) => x !== f))}
                          className="ml-0.5 text-blue-400 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </FormField>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5">
            <Button
              onClick={saveDetails}
              disabled={saving}
              className="h-11 rounded-[10px] bg-[#08519A] px-6 text-sm font-semibold !text-white hover:bg-[#063d75]"
            >
              {saved ? "Saved!" : saving ? "Saving…" : "Save details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Property photos</h2>
          <p className="mb-4 text-xs text-[#6B7280]">
            Upload images for your listing. MP4 files are converted to JPEG from the first frame.
          </p>

          {photos.length > 0 && (
            <>
              <p className="mb-2 text-xs text-[#6B7280]">Drag photos to reorder. First photo is the cover image.</p>
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.tempId}
                    draggable={!photo.uploading && !photo.error}
                    onDragStart={() => onPhotoDragStart(idx, photo.tempId)}
                    onDragOver={(e) => onPhotoDragOver(e, idx)}
                    onDrop={() => onPhotoDrop(idx)}
                    onDragEnd={onPhotoDragEnd}
                    className={`group relative aspect-[4/3] overflow-hidden rounded-xl border bg-[#F9FAFB] transition-opacity ${
                      draggingId === photo.tempId
                        ? "opacity-40 border-blue-400"
                        : dragOverIdx === idx && draggingId !== null
                        ? "border-blue-400 ring-2 ring-blue-300"
                        : "border-[#E5E7EB]"
                    } ${!photo.uploading && !photo.error ? "cursor-grab active:cursor-grabbing" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.public_url}
                      alt="Property photo"
                      className={`h-full w-full object-cover ${photo.uploading || photo.error ? "opacity-50" : ""}`}
                    />
                    {idx === 0 && !photo.uploading && !photo.error && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-[#08519A] px-2 py-0.5 text-[10px] font-bold text-white">
                        Cover
                      </span>
                    )}
                    {photo.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <svg className="h-5 w-5 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      </div>
                    )}
                    {photo.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100/80 p-2 text-center text-red-700 text-xs">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="mt-1">Failed</p>
                        <p className="line-clamp-2" title={photo.error}>{photo.error.split(":").pop()?.trim() || "Error"}</p>
                      </div>
                    )}
                    {!photo.uploading && !photo.error && (
                      <>
                        <button
                          type="button"
                          onClick={() => deletePhoto(photo)}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-red-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-50"
                          title="Delete photo"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                            <circle cx="2" cy="2" r="1"/><circle cx="8" cy="2" r="1"/>
                            <circle cx="2" cy="5" r="1"/><circle cx="8" cy="5" r="1"/>
                            <circle cx="2" cy="8" r="1"/><circle cx="8" cy="8" r="1"/>
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {uploadError && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/quicktime,video/webm" // Added more video types
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              className="h-10 rounded-[10px] text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading…" : photos.length > 0 ? "Add more photos" : "Upload photos"}
            </Button>
            {photos.length > 0 && (
              <p className="text-xs text-[#6B7280]">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Walkthrough video */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Walkthrough video</h2>
          <p className="mb-4 text-xs text-[#6B7280]">
            Upload a standard property walkthrough video. Existing video can be previewed, replaced, or removed.
          </p>

          <input
            ref={walkthroughInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/*"
            className="hidden"
            onChange={handleWalkthroughUpload}
          />

          {walkthrough ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <video
                  src={walkthrough.public_url}
                  controls
                  className="h-56 w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={wtUploading}
                  className="h-9 rounded-[10px] text-sm"
                  onClick={() => walkthroughInputRef.current?.click()}
                >
                  {wtUploading ? "Uploading…" : "Replace video"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={wtUploading}
                  className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                  onClick={deleteWalkthrough}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => walkthroughInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <p className="text-[14px] font-semibold text-gray-700">
                {wtUploading ? "Uploading…" : "Click to upload walkthrough video"}
              </p>
              <p className="text-[12px] text-gray-400">MP4, MOV, WebM — up to 500 MB</p>
            </div>
          )}

          {wtUploading && (
            <div className="mt-4 space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0F172A]">Uploading video...</span>
                <span className="text-[#6B7280]">{wtProgress.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full bg-[#08519A] transition-all duration-300"
                  style={{ width: `${wtProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
                <span>
                  {(wtUploadedBytes / (1024 * 1024)).toFixed(1)} MB of {(wtTotalBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
                <span>
                  {wtSpeed > 0 ? `${(wtSpeed / (1024 * 1024)).toFixed(2)} MB/s` : "Calculating..."}
                </span>
              </div>
              {wtSpeed > 0 && wtProgress < 100 && (
                <div className="text-[12px] text-[#6B7280]">
                  Remaining: {Math.ceil((wtTotalBytes - wtUploadedBytes) / wtSpeed)} seconds
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floor plan */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Floor plan</h2>
          <p className="mb-4 text-xs text-[#6B7280]">
            Upload a PDF or image floor plan. Existing floor plans can be opened, replaced, or removed.
          </p>

          <input
            ref={floorplanInputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFloorplanUpload}
          />

          {floorplan ? (
            <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={floorplan.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {/\.(jpg|jpeg|png|webp)(?:$|\?)/i.test(floorplan.public_url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={floorplan.public_url}
                    alt="Floor plan preview"
                    className="h-16 w-24 shrink-0 rounded-lg border border-[#E5E7EB] object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">
                    PDF
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900">
                    Open floor plan
                  </span>
                  <span className="block text-xs text-[#6B7280]">
                    Click to view in a new tab
                  </span>
                </span>
              </a>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                  className="h-9 rounded-[10px] text-sm"
                  onClick={() => floorplanInputRef.current?.click()}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                  className="h-9 rounded-[10px] border-red-200 text-sm text-red-600 hover:bg-red-50"
                  onClick={deleteFloorplan}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              className="h-10 rounded-[10px] text-sm"
              onClick={() => floorplanInputRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Upload floor plan"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* VR Tour */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Immersive VR tour</h2>
          <p className="mb-4 text-[13px] text-[#6B7280]">
            VR tours are exclusively platform-hosted. Upload your raw 360° footage and VBYM will process and serve it securely — no third-party embed URLs are accepted.
          </p>
          <Link
            href={`/agent/listings/${id}/vr-upload`}
            className="inline-flex h-10 items-center rounded-[10px] bg-[#08519A] px-5 text-sm font-semibold !text-white hover:bg-[#063d75]"
          >
            Manage VR submission →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
