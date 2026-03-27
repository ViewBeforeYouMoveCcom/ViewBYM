"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VR360Player from "@/components/VR360Player";
import { supabaseClient } from "@/lib/supabaseClient";

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
  url?: string;
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

  // Floor plan PDF
  const [floorplan, setFloorplan] = useState<{ file: File; uploading: boolean; url?: string } | null>(null);
  const floorplanRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Mandatory field validation ───────────────────────────────────────────
  const isValid =
    form.title.trim() !== "" &&
    form.address.trim() !== "" &&
    form.city.trim() !== "" &&
    form.postcode.trim() !== "" &&
    form.price.trim() !== "" &&
    form.bedrooms.trim() !== "" &&
    photos.length > 0 &&
    vrFile !== null;

  function setField(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setError(null);
  }

  // ── Feature tags ────────────────────────────────────────────────────────
  function addFeature() {
    const val = featureInput.trim();
    if (val && !features.includes(val)) setFeatures((f) => [...f, val]);
    setFeatureInput("");
  }

  // ── Photo handlers ──────────────────────────────────────────────────────
  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPhotos((p) => [...p, ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f), uploading: false }))]);
    e.target.value = "";
  }

  function removePhoto(i: number) {
    setPhotos((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, idx) => idx !== i); });
  }

  // ── Video handler ────────────────────────────────────────────────────────
  function onVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo({ file, preview: URL.createObjectURL(file), uploading: false });
    e.target.value = "";
  }

  // ── VR file handler ──────────────────────────────────────────────────────
  function onVrFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVrFile({ file, preview: URL.createObjectURL(file), uploading: false });
    e.target.value = "";
  }

  // ── Floor plan handler ───────────────────────────────────────────────────
  function onFloorplanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFloorplan({ file, uploading: false });
    e.target.value = "";
  }

  // ── Upload helpers ───────────────────────────────────────────────────────
  async function uploadFile(file: File, path: string): Promise<string | null> {
    const { error: upErr } = await supabaseClient.storage
      .from("property-media")
      .upload(path, file, { upsert: false });
    if (upErr) { console.error("Upload failed:", upErr.message); return null; }
    return supabaseClient.storage.from("property-media").getPublicUrl(path).data.publicUrl;
  }

  async function uploadPhotos(propertyId: string): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      setPhotos((p) => p.map((x, idx) => idx === i ? { ...x, uploading: true } : x));
      const ext = photos[i].file.name.split(".").pop() ?? "jpg";
      const url = await uploadFile(photos[i].file, `${propertyId}/photos/${Date.now()}-${i}.${ext}`);
      setPhotos((p) => p.map((x, idx) => idx === i ? { ...x, uploading: false, url: url ?? undefined } : x));
      if (url) urls.push(url);
    }
    return urls;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function onSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true); setError(null);

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { setError("Session expired."); setSaving(false); return; }

    const { data: membership } = await supabaseClient
      .from("agency_members").select("agency_id").eq("user_id", user.id).limit(1).single();
    if (!membership) { setError("No agency found."); setSaving(false); return; }

    const priceNumeric = form.price ? parseFloat(form.price.replace(/[^0-9.]/g, "")) : null;

    const { data: inserted, error: insertError } = await supabaseClient
      .from("properties")
      .insert({
        agency_id: membership.agency_id,
        title: form.title.trim(),
        address_line1: form.address.trim() || null,
        city: form.city.trim() || null,
        postcode: form.postcode.trim() || null,
        price: priceNumeric,
        price_qualifier: form.price_qualifier || null,
        listing_type: form.listing_type,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        area_sqft: form.area_sqft ? parseInt(form.area_sqft, 10) : null,
        property_type: form.property_type,
        market_status: form.market_status,
        tenure: form.tenure.trim() || null,
        description: form.description.trim() || null,
        features: features.length > 0 ? features : null,
        status: publish ? "published" : "draft",
        created_by: user.id,
        slug: generateSlug(form.title, form.address),
      })
      .select("id").single();

    if (insertError || !inserted) {
      setError("Could not create listing: " + insertError?.message);
      setSaving(false); return;
    }

    const propertyId = inserted.id;

    // Geocode address and store coordinates
    const coords = await geocodeAddress(form.address, form.city, form.postcode);
    if (coords) {
      await supabaseClient
        .from("properties")
        .update({ latitude: coords.lat, longitude: coords.lng })
        .eq("id", propertyId);
    }

    // Upload photos
    const photoUrls = await uploadPhotos(propertyId);
    if (photoUrls.length > 0) {
      await supabaseClient.from("property_media").insert(
        photoUrls.map((url, i) => ({ property_id: propertyId, public_url: url, sort_order: i, type: "photo" }))
      );
    }

    // Upload walkthrough video
    if (video) {
      setVideo((v) => v ? { ...v, uploading: true } : v);
      const ext = video.file.name.split(".").pop() ?? "mp4";
      const videoUrl = await uploadFile(video.file, `${propertyId}/video/walkthrough.${ext}`);
      setVideo((v) => v ? { ...v, uploading: false } : v);
      if (videoUrl) {
        await supabaseClient.from("properties").update({ video_url: videoUrl }).eq("id", propertyId);
      }
    }

    // VR — upload to private "property-vr" bucket, store path only, never a public URL
    if (vrFile) {
      setVrFile((v) => v ? { ...v, uploading: true } : v);
      const ext = vrFile.file.name.split(".").pop() ?? "mp4";
      const vrPath = `${propertyId}/tour.${ext}`;
      const { error: vrUpErr } = await supabaseClient.storage
        .from("property-vr")
        .upload(vrPath, vrFile.file, { upsert: false });
      setVrFile((v) => v ? { ...v, uploading: false } : v);
      if (!vrUpErr) {
        await supabaseClient.from("property_vr").insert({
          property_id: propertyId,
          video_path: vrPath,
          is_enabled: true,
        });
      }
    }

    // Floor plan PDF
    if (floorplan) {
      setFloorplan((f) => f ? { ...f, uploading: true } : f);
      const ext = floorplan.file.name.split(".").pop() ?? "pdf";
      const floorplanUrl = await uploadFile(floorplan.file, `${propertyId}/floorplan/floorplan.${ext}`);
      setFloorplan((f) => f ? { ...f, uploading: false, url: floorplanUrl ?? undefined } : f);
      if (floorplanUrl) {
        await supabaseClient.from("property_media").insert({
          property_id: propertyId,
          public_url: floorplanUrl,
          type: "floorplan",
          sort_order: 0,
        });
      }
    }

    setSaving(false);
    router.push(`/agent/listings/${propertyId}`);
  }

  const missingFields = [
    !form.title.trim() && "title",
    !form.address.trim() && "address",
    !form.city.trim() && "city",
    !form.postcode.trim() && "postcode",
    !form.price.trim() && "price",
    !form.bedrooms.trim() && "bedrooms",
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
            <Field label="City" required><Input placeholder="London" value={form.city} onChange={(e) => setField("city", e.target.value)} /></Field>
            <Field label="Postcode" required><Input placeholder="E14 9UH" value={form.postcode} onChange={(e) => setField("postcode", e.target.value)} /></Field>
            <Field label="Listing type">
              <Sel value={form.listing_type} onChange={(v) => setField("listing_type", v)}>
                <option value="sale">For sale</option>
                <option value="rent">To let</option>
              </Sel>
            </Field>
            <Field label="Property type">
              <Sel value={form.property_type} onChange={(v) => setField("property_type", v)}>
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
              </Sel>
            </Field>
            <Field label="Bedrooms" required><Input type="number" min="0" placeholder="2" value={form.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} /></Field>
            <Field label="Bathrooms"><Input type="number" min="0" placeholder="1" value={form.bathrooms} onChange={(e) => setField("bathrooms", e.target.value)} /></Field>
            <Field label="Floor area (sq ft)"><Input type="number" min="0" placeholder="850" value={form.area_sqft} onChange={(e) => setField("area_sqft", e.target.value)} /></Field>
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
            <Button type="button" variant="secondary" className="h-11 rounded-[10px] px-4 text-sm" onClick={addFeature} disabled={features.length >= 10}>Add</Button>
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
          sub="Upload property photos. First image becomes the cover."
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
            <p className="text-[12px] text-gray-400">JPG, PNG, WebP — up to 10 MB each</p>
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotoChange} />
          </div>
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((photo, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-gray-100">
                  <Image src={photo.preview} alt={`Photo ${i + 1}`} fill className="object-cover" />
                  {i === 0 && <div className="absolute left-1.5 top-1.5 rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">Cover</div>}
                  {photo.uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <svg className="h-5 w-5 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    </div>
                  ) : (
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute right-1.5 top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white group-hover:flex" aria-label="Remove">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
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
          sub="Upload an equirectangular 360° video. Played natively in-browser — no third-party tool needed."
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
                <p className="mt-1 text-[12px] text-gray-400">Equirectangular MP4 or WebM · up to 2 GB</p>
                <p className="mt-0.5 text-[11.5px] text-gray-400">Works on desktop, mobile &amp; VR headsets — processed entirely on our platform</p>
              </div>
              <input ref={vrFileRef} type="file" accept="video/mp4,video/webm,video/*" className="hidden" onChange={onVrFileChange} />
            </div>
          )}
        </Section>

        {/* ── 6. Floor plan ────────────────────────────────────── */}
        <Section title="Floor plan" sub="Upload a floor plan document or image. Optional — PDF, JPG, or PNG.">
          {floorplan ? (
            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">{floorplan.file.name}</p>
                  <p className="text-[12px] text-gray-400">{(floorplan.file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {floorplan.uploading && (
                  <svg className="h-4 w-4 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                )}
                <button type="button" onClick={() => setFloorplan(null)}
                  className="text-[13px] text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ) : (
            <div onClick={() => floorplanRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-[14px] font-semibold text-gray-700">Click to upload floor plan</p>
              <p className="text-[12px] text-gray-400">PDF, JPG, or PNG — up to 20 MB</p>
              <input ref={floorplanRef} type="file" accept=".pdf,image/jpeg,image/png" className="hidden" onChange={onFloorplanChange} />
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
            className="h-11 rounded-[10px] bg-blue-700 px-6 text-[14px] font-semibold !text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={(e) => onSubmit(e as unknown as React.FormEvent, true)}>
            {saving ? "Publishing…" : "Save & publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
