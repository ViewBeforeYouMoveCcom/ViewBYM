"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import VR360Player from "@/components/VR360Player";
import { supabaseClient } from "@/lib/supabaseClient";
import { preparePhotoFile } from "@/lib/videoFrameToJpeg";

async function geocodeAddress(address: string, city: string, postcode: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  const query = [address, city, postcode, "UK"].filter(Boolean).join(", ");
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status === "OK" && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
  } catch {
    // silently ignore geocoding failures
  }
  return null;
}

function generateSlug(title: string, address: string) {
  const base = (title || address)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `property-${suffix}`;
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-8">
      <div className="mb-6 border-b border-[#F3F4F6] pb-4">
        <h2 className="text-[16px] font-bold text-gray-900">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] text-gray-500">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] text-gray-400">{hint}</p>}
    </div>
  );
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  );
}

interface MediaFile {
  file: File;
  preview: string;
  uploading: boolean;
  tempId: string;
  url?: string;
  error?: string; // Added for error feedback
  mediaId?: string; // property_media row id, set once the photo is saved to the DB
  roomTitle?: string;
}

const ROOM_TITLE_SUGGESTIONS = [
  "Living room", "Kitchen", "Dining room", "Master bedroom", "Bedroom",
  "Bathroom", "Hallway", "Garden", "Exterior", "Balcony", "Garage", "Office",
];

interface UploadedFile {
  path: string;
  url: string;
}

function getUploadErrorMessage(label: string, message: string) {
  if (/failed to fetch|network|timeout|timed out|load failed/i.test(message)) {
    return `${label} upload hit a network timeout while talking to Supabase. Check your connection and try again.`;
  }

  if (/not[_ ]found|object not found|bucket/i.test(message)) {
    return `${label} upload failed because Supabase could not find the property-media bucket or object path. Check Storage > property-media exists and allows this file type.`;
  }

  if (/mime|type|not allowed|invalid/i.test(message)) {
    return `${label} upload failed because property-media does not allow this file type. Add image/jpeg, image/png, image/webp, video/mp4, video/webm, video/quicktime, and application/pdf to the bucket.`;
  }

  if (/size|too large|payload/i.test(message)) {
    return `${label} upload failed because the file is larger than the property-media bucket limit. Increase the bucket file size limit or upload a smaller file.`;
  }

  return `${label} upload failed: ${message}`;
}

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

export default function NewListingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "", address: "", city: "", postcode: "",
    price: "", price_qualifier: "", listing_type: "sale",
    bedrooms: "", bathrooms: "", area_sqft: "",
    property_type: "apartment", market_status: "available",
    tenure: "", description: "",
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Photos
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);

  // Walkthrough video
  const [video, setVideo] = useState<MediaFile | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // VR
  const [vrFile, setVrFile] = useState<MediaFile | null>(null);
  const vrFileRef = useRef<HTMLInputElement>(null);

  // Floor plan PDF/image
  const [floorplan, setFloorplan] = useState<{ file: File; preview: string; uploading: boolean; url?: string } | null>(null);
  const floorplanRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftPropertyId, setDraftPropertyId] = useState<string | null>(null);

  const isCommercial = form.listing_type === "commercial";

  // ── Mandatory field validation ───────────────────────────────────────────
  const isValid =
    form.title.trim() !== "" &&
    form.address.trim() !== "" &&
    form.city.trim() !== "" &&
    form.postcode.trim() !== "" &&
    form.price.trim() !== "" &&
    (isCommercial ? form.area_sqft.trim() !== "" : form.bedrooms.trim() !== "") &&
    photos.length > 0 &&
    vrFile !== null;

  function setField(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setError(null);
  }

  function getDetailsMissingFields() {
    return [
      !form.title.trim() && "title",
      !form.address.trim() && "address",
      !form.city.trim() && "city",
      !form.postcode.trim() && "postcode",
      !form.price.trim() && "price",
      form.listing_type === "commercial"
        ? !form.area_sqft.trim() && "square footage"
        : !form.bedrooms.trim() && "bedrooms",
    ].filter(Boolean) as string[];
  }

  async function savePropertyDetails(status: "draft" | "published" = "draft"): Promise<{ propertyId: string; agencyId: string }> {
    const { data: { user } } = await retryTransient(() => supabaseClient.auth.getUser());
    if (!user) throw new Error("Session expired.");

    const { data: membership } = await retryTransient(async () =>
      await supabaseClient
        .from("agency_members")
        .select("agency_id, agencies(status, plan)")
        .eq("user_id", user.id)
        .limit(1)
        .single()
    );

    if (!membership) throw new Error("No agency found associated with your account.");
    const agencyData = (membership as unknown as { agencies?: { status?: string; plan?: string } }).agencies;
    const agencyStatus = agencyData?.status;
    const agencyPlan = agencyData?.plan;
    if (agencyStatus !== "approved") {
      throw new Error("Your agent request must be approved before you can list properties.");
    }
    const currentAgencyId = membership.agency_id;

    // Check property limit based on plan
    if (!draftPropertyId) {
      const { count, error: countError } = await supabaseClient
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("agency_id", currentAgencyId)
        .neq("status", "archived");

      if (countError) throw new Error("Could not check property count.");

      const propertyLimit = agencyPlan === "paid" ? 50 : 1;
      if ((count ?? 0) >= propertyLimit) {
        if (agencyPlan === "free") {
          throw new Error("You have reached the limit for the free plan. You can only upload 1 property. Please upgrade to the paid plan to upload up to 50 properties.");
        } else {
          throw new Error(`You have reached the property limit (${propertyLimit}) for your plan.`);
        }
      }
    }

    const priceNumeric = form.price ? parseFloat(form.price.replace(/[^0-9.]/g, "")) : null;
    const submittedFeatures = Array.from(
      new Set([...features, featureInput.trim()].filter(Boolean))
    ).slice(0, 10);

    const payload = {
      agency_id: currentAgencyId,
      title: form.title.trim(),
      address_line1: form.address.trim() || null,
      city: form.city.trim() || null,
      postcode: form.postcode.trim() || null,
      price: priceNumeric,
      price_qualifier: form.price_qualifier || null,
      listing_type: form.listing_type,
      bedrooms: isCommercial ? null : form.bedrooms ? parseInt(form.bedrooms, 10) : null,
      bathrooms: isCommercial ? null : form.bathrooms ? parseInt(form.bathrooms, 10) : null,
      area_sqft: form.area_sqft ? parseInt(form.area_sqft, 10) : null,
      property_type: form.property_type,
      market_status: form.market_status,
      tenure: form.tenure.trim() || null,
      description: form.description.trim() || null,
      features: submittedFeatures,
      status,
    };

    if (draftPropertyId) {
      const { error: updateError } = await retryTransient(async () =>
        await supabaseClient
          .from("properties")
          .update(payload)
          .eq("id", draftPropertyId)
      );

      if (updateError) throw new Error(`Could not update listing: ${updateError.message}`);
      return { propertyId: draftPropertyId, agencyId: currentAgencyId };
    }

    const { data: inserted, error: insertError } = await supabaseClient
      .from("properties")
      .insert({
        ...payload,
        created_by: user.id,
        slug: generateSlug(form.title, form.address),
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      throw new Error("Could not create listing: " + insertError?.message);
    }

    setDraftPropertyId(inserted.id);
    return { propertyId: inserted.id as string, agencyId: currentAgencyId };
  }

  // ── Feature tags ────────────────────────────────────────────────────────
  function addFeature() {
    const val = featureInput.trim();
    if (val && !features.includes(val)) setFeatures((f) => [...f, val]);
    setFeatureInput("");
  }

  // ── Photo handlers ──────────────────────────────────────────────────────
  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    try {
      const missingDetails = getDetailsMissingFields();
      if (missingDetails.length > 0) {
        setError(`Fill ${missingDetails.join(", ")} before uploading photos.`);
        return;
      }

      const { propertyId, agencyId: currentAgencyId } = await savePropertyDetails("draft");
      const startIndex = photos.length;
      let firstUploadError: string | null = null;

      for (let i = 0; i < files.length; i++) {
        const tempId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        const originalFile = files[i];
        const previewUrl = URL.createObjectURL(originalFile);
        
        // 1. Add to UI immediately so the user sees progress
        setPhotos((p) => [...p, { tempId, file: originalFile, preview: previewUrl, uploading: true }]);

        try {
          // 2. Convert video to JPEG (sequential + 60s timeout to prevent browser freeze)
          const conversionPromise = preparePhotoFile(originalFile);
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Video conversion timed out. Try a smaller file.")), 60000)
          );
          const file = await Promise.race([conversionPromise, timeoutPromise]);

          // 2.5 Update the preview URL to the extracted JPEG frame
          const jpegPreviewUrl = URL.createObjectURL(file);
          
          // Update local state IMMEDIATELY after conversion so the user sees the frame
          setPhotos((current) => current.map((p) => 
            p.tempId === tempId ? { 
              ...p, 
              file, 
              preview: jpegPreviewUrl
            } : p
          ));

          URL.revokeObjectURL(previewUrl); // Safe to revoke original video blob now

          // 3. Determine file metadata
          const isImage = file.type.startsWith("image/");
          const wasVideo = /\.(mp4|mov|m4v|webm|qt|avi)$/i.test(originalFile.name);
          const ext = (isImage || wasVideo) ? "jpg" : (originalFile.name.split(".").pop() ?? "jpg");
          // 4. Upload to Storage
          const upload = await uploadFile(file, `${currentAgencyId}/${propertyId}/photos/${Date.now()}-${startIndex + i}.${ext}`, `Photo ${startIndex + i + 1}`);

          // 5. Save to Database (this is the first time it's saved)
          const { data: mediaRow, error: mediaError } = await supabaseClient
            .from("property_media")
            .insert({
              property_id: propertyId,
              storage_path: upload.path,
              public_url: upload.url,
              sort_order: startIndex + i,
              type: "photo",
            })
            .select("id")
            .single();
          if (mediaError) throw new Error(`Photo save failed: ${mediaError.message}`);

          // 6. Update local state
          setPhotos((current) => current.map((p) =>
            p.tempId === tempId ? {
              ...p,
              preview: jpegPreviewUrl,
              uploading: false,
              url: upload.url,
              mediaId: (mediaRow as { id: string } | null)?.id,
              error: undefined,
            } : p
          ));

          // Small delay to let the browser release video decoding resources
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
          console.error(`Error processing ${originalFile.name}:`, err);
          const message = err instanceof Error ? err.message : "Upload failed.";
          firstUploadError ??= `${originalFile.name}: ${message}`;
          setPhotos((current) => current.map((p) => 
            p.tempId === tempId ? { ...p, uploading: false, error: message } : p
          ));
        }
      }
      setError(firstUploadError);
    } catch (err) {
      setPhotos((p) => p.map((photo) => ({ ...photo, uploading: false })));
      setError(err instanceof Error ? err.message : "Could not convert the selected video to a photo.");
    }
  }

  function removePhoto(tempIdToRemove: string) {
    setPhotos((p) => {
      const photoToRemove = p.find(photo => photo.tempId === tempIdToRemove);
      if (photoToRemove) URL.revokeObjectURL(photoToRemove.preview);
      return p.filter((photo) => photo.tempId !== tempIdToRemove);
    });
  }

  function onRoomTitleChange(tempId: string, value: string) {
    setPhotos((current) => current.map((p) => (p.tempId === tempId ? { ...p, roomTitle: value } : p)));
  }

  async function saveRoomTitle(photo: MediaFile) {
    if (!photo.mediaId) return; // Not saved to the DB yet — will be picked up once the row exists.
    await supabaseClient
      .from("property_media")
      .update({ room_title: photo.roomTitle?.trim() || null })
      .eq("id", photo.mediaId);
  }

  // ── Video handler ────────────────────────────────────────────────────────
  function onVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const tempId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setVideo({ tempId, file, preview: URL.createObjectURL(file), uploading: false });
    e.target.value = "";
  }

  // ── VR file handler ──────────────────────────────────────────────────────
  function onVrFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const tempId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setVrFile({ tempId, file, preview: URL.createObjectURL(file), uploading: false });
    setError(null);
    e.target.value = "";
  }

  // ── Floor plan handler ───────────────────────────────────────────────────
  function onFloorplanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFloorplan((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return { file, preview: URL.createObjectURL(file), uploading: false };
    });
    e.target.value = "";
  }

  // ── Upload helpers ───────────────────────────────────────────────────────
  async function uploadFile(file: File, path: string, label = "File"): Promise<UploadedFile> {
    const { error: upErr } = await retryTransient(async () =>
      await supabaseClient.storage
        .from("property-media")
        .upload(path, file, { contentType: file.type.startsWith('image/') ? 'image/jpeg' : file.type, upsert: true })
    );
    if (upErr) throw new Error(getUploadErrorMessage(label, upErr.message));
    const url = supabaseClient.storage.from("property-media").getPublicUrl(path).data.publicUrl;
    return { path, url };
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function onSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true); setError(null);

    try {
    const { propertyId: savedPropertyId, agencyId: currentAgencyId } = await savePropertyDetails(publish ? "published" : "draft");

    // Geocode address and store coordinates
    const coords = await geocodeAddress(form.address, form.city, form.postcode);
    if (coords) {
      await supabaseClient
        .from("properties")
        .update({ latitude: coords.lat, longitude: coords.lng })
        .eq("id", savedPropertyId);
    }

    // Check if all photos are uploaded and have no errors
    const pendingOrFailedPhotos = photos.filter(p => p.uploading || !p.url || p.error);
    if (pendingOrFailedPhotos.length > 0) {
        throw new Error(`Cannot save: ${pendingOrFailedPhotos.length} photos are still uploading or failed. Please wait or remove them.`);
    }

    // Upload walkthrough video
    if (video) {
      setVideo((v) => v ? { ...v, uploading: true } : v);
      const ext = video.file.name.split(".").pop() ?? "mp4";
      const videoUpload = await uploadFile(video.file, `${currentAgencyId}/${savedPropertyId}/video/walkthrough.${ext}`, "Walkthrough video");
      setVideo((v) => v ? { ...v, uploading: false, url: videoUpload.url } : v);
      const { error: videoError } = await supabaseClient.from("property_media").insert({
        property_id: savedPropertyId,
        storage_path: videoUpload.path,
        public_url: videoUpload.url,
        type: "video",
        sort_order: 0,
      });
      if (videoError) throw new Error(`Walkthrough video save failed: ${videoError.message}`);
    }

    // VR — save the 360 video path in DB so the listing can show it on the website.
    if (vrFile) {
      setVrFile((v) => v ? { ...v, uploading: true } : v);
      const ext = vrFile.file.name.split(".").pop() ?? "mp4";
      const vrUpload = await uploadFile(vrFile.file, `${currentAgencyId}/${savedPropertyId}/vr/tour.${ext}`, "VR video");
      setVrFile((v) => v ? { ...v, uploading: false, url: vrUpload.url } : v);

      const { error: vrSaveError } = await supabaseClient
        .from("property_vr")
        .upsert({
          property_id: savedPropertyId,
          video_path: `property-media/${vrUpload.path}`,
          is_enabled: true,
          submission_status: "ready",
          submitted_at: new Date().toISOString(),
        }, { onConflict: "property_id" });

      if (vrSaveError) throw new Error(`VR save failed: ${vrSaveError.message}`);
    }

    // Floor plan PDF
    if (floorplan) {
      setFloorplan((f) => f ? { ...f, uploading: true } : f);
      const ext = floorplan.file.name.split(".").pop() ?? "pdf";
      const floorplanUpload = await uploadFile(floorplan.file, `${currentAgencyId}/${savedPropertyId}/floorplan/floorplan.${ext}`, "Floor plan");
      setFloorplan((f) => f ? { ...f, uploading: false, url: floorplanUpload.url } : f);
      const { error: floorplanError } = await supabaseClient.from("property_media").insert({
        property_id: savedPropertyId,
        storage_path: floorplanUpload.path,
        public_url: floorplanUpload.url,
        type: "floorplan",
        sort_order: 0,
      });
      if (floorplanError) throw new Error(`Floor plan save failed: ${floorplanError.message}`);
    }

    setSaving(false);
    router.push(`/agent/listings/${savedPropertyId}`);
    } catch (err) {
      setSaving(false);
      setPhotos((p) => p.map((photo) => ({ ...photo, uploading: false })));
      setVideo((v) => v ? { ...v, uploading: false } : v);
      setVrFile((v) => v ? { ...v, uploading: false } : v);
      setFloorplan((f) => f ? { ...f, uploading: false } : f);
      const message = err instanceof Error ? err.message : "Could not save listing media.";
      setError(`Listing partially saved: ${message}. You can fix it in the edit page.`);
    }
  }

  const missingFields = [
    !form.title.trim() && "title",
    !form.address.trim() && "address",
    !form.city.trim() && "city",
    !form.postcode.trim() && "postcode",
    !form.price.trim() && "price",
    isCommercial
      ? !form.area_sqft.trim() && "square footage"
      : !form.bedrooms.trim() && "bedrooms",
    photos.length === 0 && "at least 1 photo",
    !vrFile && "VR 360° file",
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add new listing</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Fields marked <span className="text-red-500 font-semibold">*</span> are required before saving.
          </p>
        </div>
        <Button type="button" variant="secondary" className="h-9 rounded-[10px] text-sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={(e) => onSubmit(e, false)} className="space-y-6">

        {/* ── 1. Property details ─────────────────────────────── */}
        <Section title="Property details" sub="Basic information about this listing.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Listing title" required>
                <Input placeholder="e.g. Sunlit Riverside Apartment" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address line 1" required>
                <Input placeholder="21 Meridian Wharf" value={form.address} onChange={(e) => setField("address", e.target.value)} />
              </Field>
            </div>
            <Field label="City" required>
              <LocationAutocomplete
                value={form.city}
                onChange={(v) => setField("city", v)}
                onSelect={(v) => setField("city", v)}
                placeholder="London"
              />
            </Field>
            <Field label="Postcode" required><Input placeholder="E14 9UH" value={form.postcode} onChange={(e) => setField("postcode", e.target.value)} /></Field>
            <Field label="Listing type">
              <Sel
                value={form.listing_type}
                onChange={(v) => {
                  setField("listing_type", v);
                  const nowCommercial = v === "commercial";
                  const wasCommercial = isCommercial;
                  if (nowCommercial && !wasCommercial) setField("property_type", "office");
                  if (!nowCommercial && wasCommercial) setField("property_type", "apartment");
                }}
              >
                <option value="sale">For sale</option>
                <option value="rent">To let</option>
                <option value="commercial">Commercial</option>
              </Sel>
            </Field>
            <Field label="Property type">
              <Sel value={form.property_type} onChange={(v) => setField("property_type", v)}>
                {isCommercial ? (
                  <>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="industrial">Industrial / Warehouse</option>
                    <option value="land">Land</option>
                    <option value="hotel_leisure">Hotel &amp; Leisure</option>
                    <option value="other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                    <option value="detached">Detached</option>
                    <option value="semi_detached">Semi-detached</option>
                    <option value="terraced">Terraced</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="cottage">Cottage</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="mews">Mews</option>
                    <option value="flat">Flat</option>
                    <option value="loft">Loft</option>
                    <option value="other">Other</option>
                  </>
                )}
              </Sel>
            </Field>
            {!isCommercial && (
              <>
                <Field label="Bedrooms" required><Input type="number" min="0" placeholder="2" value={form.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} /></Field>
                <Field label="Bathrooms"><Input type="number" min="0" placeholder="1" value={form.bathrooms} onChange={(e) => setField("bathrooms", e.target.value)} /></Field>
              </>
            )}
            <Field label="Square footage (sq ft)" required={isCommercial}><Input type="number" min="0" placeholder="850" value={form.area_sqft} onChange={(e) => setField("area_sqft", e.target.value)} /></Field>
            <Field label="Tenure"><Input placeholder="Freehold / Leasehold" value={form.tenure} onChange={(e) => setField("tenure", e.target.value)} /></Field>
            <Field label={form.listing_type === "rent" ? "Monthly rent (£)" : "Price (£)"} required>
              <Input type="number" min="0" step="1000" placeholder={form.listing_type === "rent" ? "1800" : "350000"} value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </Field>
            <Field label="Price qualifier" hint="e.g. Guide price, Offers over">
              <Sel value={form.price_qualifier} onChange={(v) => setField("price_qualifier", v)}>
                <option value="">None</option>
                <option value="Guide price">Guide price</option>
                <option value="Offers over">Offers over</option>
                <option value="Offers in excess of">Offers in excess of</option>
                <option value="Fixed price">Fixed price</option>
                <option value="From">From</option>
                <option value="POA">Price on application</option>
              </Sel>
            </Field>
            <Field label="Availability status">
              <Sel value={form.market_status} onChange={(v) => setField("market_status", v)}>
                <option value="available">New / Available</option>
                <option value="Under offer">Under offer</option>
                <option value="Sold STC">Sold STC</option>
                <option value="Let agreed">Let agreed</option>
              </Sel>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea rows={5} placeholder="Describe the property — layout, standout features, local area…" value={form.description} onChange={(e) => setField("description", e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
            </div>
          </div>
        </Section>

        {/* ── 2. Key features ─────────────────────────────────── */}
        <Section title="Key features" sub="Bullet points shown on the listing. Add up to 10.">
          <div className="flex gap-2">
            <Input placeholder="e.g. South-facing garden" value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              className="flex-1" />
            <Button type="button" variant="secondary" className="h-11 rounded-[10px] px-4 text-sm" onClick={addFeature} disabled={false}>Add</Button>
          </div>
          {features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700">
                  {f}
                  <button type="button" onClick={() => setFeatures((p) => p.filter((x) => x !== f))} className="ml-0.5 text-blue-400 hover:text-blue-700">×</button>
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* ── 3. Photos ────────────────────────────────────────── */}
        <Section
          title={<>Photos <span className="text-red-500">*</span></>  as unknown as string}
          sub="Upload property photos. MP4 files are converted to JPEG from the first frame."
        >
          <div onClick={() => photoRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              photos.length === 0
                ? "border-red-200 bg-red-50 hover:border-blue-400 hover:bg-blue-50"
                : "border-[#D1D5DB] bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
            }`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
            <p className="text-[14px] font-semibold text-gray-700">Click to upload photos</p>
            <p className="text-[12px] text-gray-400">JPG, PNG, WebP, or MP4 converted to JPEG</p>
            <input ref={photoRef} type="file" accept="image/*,video/mp4,video/quicktime,video/webm" multiple className="hidden" onChange={onPhotoChange} />
          </div>
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 items-start gap-3 sm:grid-cols-4">
              <datalist id="room-title-suggestions">
                {ROOM_TITLE_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
              </datalist>
              {photos.map((photo, i) => (
                <div key={photo.tempId} className="flex flex-col gap-1.5">
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && <div className="absolute left-1.5 top-1.5 rounded-full bg-[#08519A] px-2 py-0.5 text-[10px] font-bold text-white">Cover</div>}
                    {photo.uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-blue-700">
                        <svg className="h-5 w-5 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        <span className="sr-only">Uploading...</span>
                      </div>
                    ) : photo.error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100/80 p-2 text-center text-red-700 text-xs">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <p className="mt-1">Failed</p>
                          <p className="line-clamp-2" title={photo.error}>{photo.error.split(':').pop()?.trim() || 'Error'}</p>
                      </div>
                    ) : (
                      <button type="button" onClick={() => removePhoto(photo.tempId)}
                        className="absolute right-1.5 top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white group-hover:flex" aria-label="Remove">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  {!photo.uploading && !photo.error && (
                    <input
                      type="text"
                      list="room-title-suggestions"
                      placeholder="Room (e.g. Kitchen)"
                      value={photo.roomTitle ?? ""}
                      onChange={(e) => onRoomTitleChange(photo.tempId, e.target.value)}
                      onBlur={() => saveRoomTitle(photo)}
                      className="h-8 w-full rounded-lg border border-[#E5E7EB] px-2 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
              <button type="button" onClick={() => photoRef.current?.click()}
                className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] text-gray-400 hover:border-blue-400 hover:bg-blue-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
          )}
        </Section>

        {/* ── 4. Walkthrough video ─────────────────────────────── */}
        <Section title="Walkthrough video" sub="Upload a standard property walkthrough video (MP4, MOV, WebM — up to 500 MB). Optional.">
          {video ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-black">
                <video src={video.preview} controls className="h-56 w-full object-contain" />
              </div>
              <div className="flex items-center gap-3">
                {video.uploading && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <svg className="h-4 w-4 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Uploading…
                  </span>
                )}
                <button type="button" onClick={() => { URL.revokeObjectURL(video.preview); setVideo(null); }}
                  className="text-[13px] text-red-600 hover:underline">Remove video</button>
              </div>
            </div>
          ) : (
            <div onClick={() => videoRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <p className="text-[14px] font-semibold text-gray-700">Click to upload walkthrough video</p>
              <p className="text-[12px] text-gray-400">MP4, MOV, WebM — up to 500 MB</p>
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={onVideoChange} />
            </div>
          )}
        </Section>

        {/* ── 5. VR / 360° Tour ────────────────────────────────── */}
        <Section
          title={<>VR / 360° Tour <span className="text-red-500">*</span></> as unknown as string}
          sub="Upload a 360° video. Played natively in-browser — no third-party tool needed."
        >
          {vrFile ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-black">
                <VR360Player videoUrl={vrFile.preview} className="h-64 w-full" />
              </div>
              <p className="text-[12px] text-gray-500">Click and drag to look around in 360°. This is exactly how buyers will see it.</p>
              <div className="flex items-center gap-3">
                {vrFile.uploading && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <svg className="h-4 w-4 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Uploading…
                  </span>
                )}
                <button type="button" onClick={() => { URL.revokeObjectURL(vrFile.preview); setVrFile(null); }}
                  className="text-[13px] text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => vrFileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                !vrFile
                  ? "border-red-200 bg-red-50 hover:border-blue-400 hover:bg-blue-50"
                  : "border-[#D1D5DB] bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Upload 360° VR video</p>
                <p className="mt-1 text-[12px] text-gray-400">MP4 or WebM · up to 5 GB</p>
                <p className="mt-0.5 text-[11.5px] text-gray-400">Works on desktop, mobile &amp; VR headsets — processed entirely on our platform</p>
              </div>
              <input ref={vrFileRef} type="file" accept="video/mp4,video/webm,video/*" className="hidden" onChange={onVrFileChange} />
            </div>
          )}
        </Section>

        {/* ── 6. Floor plan ────────────────────────────────────── */}
        <Section title="Floor plan" sub="Upload a floor plan document or image. Optional — PDF, JPG, or PNG.">
          {floorplan ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => floorplanRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") floorplanRef.current?.click();
              }}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <div className="flex items-center gap-3">
                {floorplan.file.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={floorplan.preview} alt="Floor plan preview" className="h-14 w-20 rounded-lg border border-[#E5E7EB] object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">{floorplan.file.name}</p>
                  <p className="text-[12px] text-gray-400">Click to change - {(floorplan.file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {floorplan.uploading && (
                  <svg className="h-4 w-4 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                )}
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  URL.revokeObjectURL(floorplan.preview);
                  setFloorplan(null);
                }}
                  className="text-[13px] text-red-600 hover:underline">Remove</button>
              </div>
              <input ref={floorplanRef} type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={onFloorplanChange} />
            </div>
          ) : (
            <div onClick={() => floorplanRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-[14px] font-semibold text-gray-700">Click to upload floor plan</p>
              <p className="text-[12px] text-gray-400">PDF, JPG, PNG, or WebP - up to 20 MB</p>
              <input ref={floorplanRef} type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={onFloorplanChange} />
            </div>
          )}
        </Section>

        {/* ── Incomplete notice ────────────────────────────────── */}
        {!isValid && missingFields.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-amber-800">Required before saving</p>
            <p className="mt-1 text-[12.5px] text-amber-700">
              Still needed: {missingFields.join(", ")}.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        )}

        <div className="flex flex-wrap gap-3 pb-4">
          <Button type="submit" disabled={saving || !isValid}
            className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white px-6 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
            {saving ? "Saving…" : "Save as draft"}
          </Button>
          <Button type="button" disabled={saving || !isValid}
            className="h-11 rounded-[10px] bg-[#08519A] px-6 text-[14px] font-semibold !text-white hover:bg-[#063d75] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={(e) => onSubmit(e as unknown as React.FormEvent, true)}>
            {saving ? "Publishing…" : "Save & publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
