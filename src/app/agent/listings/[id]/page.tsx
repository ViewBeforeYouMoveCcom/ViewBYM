"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import FormField from "@/components/FormField";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

type PropStatus = "draft" | "published" | "archived";

// Reflects the real deployed schema — no price_display, price_qualifier,
// area_sqft, listing_type, or features columns.
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
  status: PropStatus;
}

interface VrTour {
  id: string;
  embed_url: string | null;
  iframe_html: string | null;
  provider: string | null;
  is_enabled: boolean;  // real schema column (not is_active)
}

interface MediaItem {
  id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
}

const statusVariant: Record<PropStatus, "default" | "success" | "warning" | "error" | "amber"> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [vr, setVr] = useState<VrTour | null>(null);
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<Partial<Property>>({});
  const [vrForm, setVrForm] = useState({ embed_url: "", iframe_html: "", provider: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingVr, setSavingVr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [showVrPreview, setShowVrPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data: prop } = await supabaseClient
        .from("properties")
        .select(
          "id, title, address_line1, address_line2, city, postcode, price, " +
          "bedrooms, bathrooms, property_type, market_status, tenure, description, status, agency_id"
        )
        .eq("id", id)
        .single();

      if (!prop) { router.push("/agent/listings"); return; }
      setProperty(prop as unknown as Property);
      setForm(prop as unknown as Property);
      setAgencyId((prop as unknown as Property & { agency_id: string }).agency_id ?? null);

      const { data: vrData } = await supabaseClient
        .from("property_vr")
        .select("id, embed_url, iframe_html, provider, is_enabled")
        .eq("property_id", id)
        .single();

      if (vrData) {
        setVr(vrData as VrTour);
        setVrForm({
          embed_url: vrData.embed_url ?? "",
          iframe_html: vrData.iframe_html ?? "",
          provider: vrData.provider ?? "",
        });
      }

      const { data: mediaData } = await supabaseClient
        .from("property_media")
        .select("id, storage_path, public_url, sort_order")
        .eq("property_id", id)
        .eq("type", "photo")
        .order("sort_order", { ascending: true });

      setPhotos((mediaData ?? []) as MediaItem[]);
      setLoading(false);
    }
    load();
  }, [id, router]);

  function setField(field: string, value: string | number | null) {
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

  async function saveVr() {
    setSavingVr(true);
    if (vr) {
      await supabaseClient
        .from("property_vr")
        .update({
          embed_url: vrForm.embed_url || null,
          iframe_html: vrForm.iframe_html || null,
          provider: vrForm.provider || null,
        })
        .eq("id", vr.id);
    } else {
      const { data } = await supabaseClient
        .from("property_vr")
        .insert({
          property_id: id,
          embed_url: vrForm.embed_url || null,
          iframe_html: vrForm.iframe_html || null,
          provider: vrForm.provider || null,
          is_enabled: true,  // real schema column (not is_active)
        })
        .select("id, embed_url, iframe_html, provider, is_enabled")
        .single();
      if (data) setVr(data as VrTour);
    }
    setSavingVr(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);

    const uploadedItems: MediaItem[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${agencyId ?? "unknown"}/${id}/${timestamp}-${safeName}`;

      const { error: uploadErr } = await supabaseClient.storage
        .from("property-media")
        .upload(storagePath, file, { upsert: false });

      if (uploadErr) {
        setUploadError(`Upload failed: ${uploadErr.message}`);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabaseClient.storage
        .from("property-media")
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;

      const { data: mediaRow, error: insertErr } = await supabaseClient
        .from("property_media")
        .insert({
          property_id: id,
          type: "photo",
          storage_path: storagePath,
          public_url: publicUrl,
          sort_order: photos.length + uploadedItems.length,
        })
        .select("id, storage_path, public_url, sort_order")
        .single();

      if (insertErr) {
        setUploadError(`DB insert failed: ${insertErr.message}`);
        setUploading(false);
        return;
      }

      uploadedItems.push(mediaRow as MediaItem);
    }

    setPhotos((prev) => [...prev, ...uploadedItems]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deletePhoto(photo: MediaItem) {
    await supabaseClient.storage
      .from("property-media")
      .remove([photo.storage_path]);

    await supabaseClient
      .from("property_media")
      .delete()
      .eq("id", photo.id);

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
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
              className="h-9 rounded-[10px] bg-blue-700 text-sm text-white hover:bg-blue-800"
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
                <PlacesAutocomplete
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
              <Input
                id="city"
                value={form.city ?? ""}
                onChange={(e) => setField("city", e.target.value)}
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
              className="h-11 rounded-[10px] bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800"
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
            Upload images for your listing. JPG, PNG, and WebP up to 10 MB each.
          </p>

          {photos.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.public_url}
                    alt="Property photo"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => deletePhoto(photo)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-red-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-50"
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
              accept="image/*"
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

      {/* VR Tour */}
      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Immersive VR tour</h2>

          <div className="mb-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm">
            <p className="font-medium text-gray-900">Which tool should I use?</p>
            <p className="mt-1 text-[#6B7280]">
              We recommend one of these two options — both work out of the box with VBYM:
            </p>
            <ul className="mt-2 space-y-2 text-[#6B7280]">
              <li>
                <span className="font-medium text-gray-900">Matterport</span>
                {" "}—{" "}
                <a
                  href="https://matterport.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  matterport.com
                </a>
                . Industry standard for 3D walkthroughs. Free tier includes 3 active spaces.
                Copy the share URL:{" "}
                <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">
                  https://my.matterport.com/show/?m=XXXXX
                </code>
              </li>
              <li>
                <span className="font-medium text-gray-900">Kuula</span>
                {" "}—{" "}
                <a
                  href="https://kuula.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  kuula.co
                </a>
                . More affordable, great for 360° photo tours. Share URL:{" "}
                <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">
                  https://kuula.co/share/XXXXX
                </code>
              </li>
            </ul>
            <p className="mt-2 text-xs text-[#6B7280]">
              Paste the share URL into the field below — no embed code needed.
            </p>
          </div>

          <div className="space-y-4">
            <FormField id="provider" label="Provider (optional)">
              <Input
                id="provider"
                placeholder="Matterport / Kuula / Custom"
                value={vrForm.provider}
                onChange={(e) => setVrForm((prev) => ({ ...prev, provider: e.target.value }))}
              />
            </FormField>

            <FormField id="embed_url" label="Embed URL">
              <Input
                id="embed_url"
                placeholder="https://my.matterport.com/show/?m=..."
                value={vrForm.embed_url}
                onChange={(e) => setVrForm((prev) => ({ ...prev, embed_url: e.target.value }))}
              />
            </FormField>

            <FormField id="iframe_html" label="iframe HTML (alternative)">
              <textarea
                id="iframe_html"
                rows={3}
                placeholder='<iframe src="..." ...></iframe>'
                value={vrForm.iframe_html}
                onChange={(e) => setVrForm((prev) => ({ ...prev, iframe_html: e.target.value }))}
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 font-mono text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={saveVr}
                disabled={savingVr}
                className="h-10 rounded-[10px] bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                {savingVr ? "Saving…" : "Save VR tour"}
              </Button>

              {(vrForm.embed_url || vrForm.iframe_html) && (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 rounded-[10px] px-5 text-sm"
                  onClick={() => setShowVrPreview((v) => !v)}
                >
                  {showVrPreview ? "Hide preview" : "Preview tour"}
                </Button>
              )}
            </div>
          </div>

          {showVrPreview && (vrForm.embed_url || vrForm.iframe_html) && (
            <div className="mt-5">
              <p className="mb-2 text-xs text-[#6B7280]">
                Live preview — this is exactly how buyers will see the tour.
              </p>
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
                {vrForm.iframe_html ? (
                  <div
                    className="min-h-[420px] w-full md:min-h-[540px]"
                    dangerouslySetInnerHTML={{ __html: vrForm.iframe_html }}
                  />
                ) : (
                  <iframe
                    src={vrForm.embed_url}
                    className="h-[420px] w-full md:h-[540px]"
                    allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                    allowFullScreen
                    title="VR tour preview"
                  />
                )}
              </div>
              <p className="mt-2 text-xs text-[#6B7280]">
                If the tour doesn&apos;t load, make sure the URL is correct and the Space is published on your provider.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
