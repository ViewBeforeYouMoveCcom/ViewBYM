"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FormField from "@/components/FormField";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

/** Generate a URL-safe slug from a title/address + a short random suffix. */
function generateSlug(title: string, address: string): string {
  const base = (title || address)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `property-${suffix}`;
}

const PRICE_QUALIFIERS = [
  { value: "", label: "None" },
  { value: "Guide price", label: "Guide price" },
  { value: "Offers over", label: "Offers over" },
  { value: "Offers in excess of", label: "Offers in excess of" },
  { value: "Fixed price", label: "Fixed price" },
  { value: "From", label: "From" },
  { value: "Price on application", label: "Price on application" },
];

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    postcode: "",
    listing_type: "sale",
    price: "",
    price_qualifier: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "apartment",
    market_status: "available",
    tenure: "",
    description: "",
  });

  // Features stored as an array; built via the tag input below
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function addFeature() {
    const trimmed = featureInput.trim();
    if (!trimmed || features.includes(trimmed)) return;
    setFeatures((prev) => [...prev, trimmed]);
    setFeatureInput("");
  }

  function removeFeature(feature: string) {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  }

  function onFeatureKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      setError("Session expired.");
      setLoading(false);
      return;
    }

    const { data: membership } = await supabaseClient
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership) {
      setError("No agency found.");
      setLoading(false);
      return;
    }

    const priceNumeric = form.price
      ? parseFloat(form.price.replace(/[^0-9.]/g, ""))
      : null;

    const { data: inserted, error: insertError } = await supabaseClient
      .from("properties")
      .insert({
        agency_id: membership.agency_id,
        title: form.title.trim(),
        address_line1: form.address.trim() || null,
        city: form.city.trim() || null,
        postcode: form.postcode.trim() || null,
        listing_type: form.listing_type,
        price: priceNumeric,
        price_qualifier: form.price_qualifier || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        property_type: form.property_type,
        market_status: form.market_status,
        tenure: form.tenure.trim() || null,
        description: form.description.trim() || null,
        features: features.length > 0 ? features : [],
        status: "draft",
        created_by: user.id,
        slug: generateSlug(form.title, form.address),
      })
      .select("id")
      .single();

    setLoading(false);

    if (insertError) {
      setError("Could not create listing: " + insertError.message);
      return;
    }

    router.push(`/agent/listings/${inserted.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
          Add listing
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Fill in the property details. You can publish once you&apos;re ready.
        </p>
      </div>

      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div className="md:col-span-2">
                <FormField id="title" label="Listing title">
                  <Input
                    id="title"
                    placeholder="e.g. Sunlit Riverside Apartment"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    required
                  />
                </FormField>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <FormField id="address" label="Address">
                  <PlacesAutocomplete
                    id="address"
                    value={form.address}
                    onChange={(raw) => set("address", raw)}
                    onSelect={({ line1, city, postcode }) => {
                      setForm((prev) => ({
                        ...prev,
                        address: line1,
                        city: city || prev.city,
                        postcode: postcode || prev.postcode,
                      }));
                    }}
                    placeholder="21 Meridian Wharf"
                  />
                </FormField>
              </div>

              <FormField id="city" label="City">
                <Input
                  id="city"
                  placeholder="London"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </FormField>

              <FormField id="postcode" label="Postcode">
                <Input
                  id="postcode"
                  placeholder="E14 9UH"
                  value={form.postcode}
                  onChange={(e) => set("postcode", e.target.value)}
                />
              </FormField>

              {/* Listing type */}
              <FormField id="listing_type" label="Listing type">
                <select
                  id="listing_type"
                  value={form.listing_type}
                  onChange={(e) => set("listing_type", e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sale">For sale</option>
                  <option value="rent">To let</option>
                </select>
              </FormField>

              {/* Availability */}
              <FormField id="market_status" label="Availability">
                <select
                  id="market_status"
                  value={form.market_status}
                  onChange={(e) => set("market_status", e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">New / Available</option>
                  <option value="Under offer">Under offer</option>
                  <option value="Sold STC">Sold STC</option>
                  <option value="Let agreed">Let agreed</option>
                </select>
              </FormField>

              {/* Price */}
              <FormField id="price" label="Price (£)">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={
                    form.listing_type === "rent" ? "2500" : "625000"
                  }
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </FormField>

              {/* Price qualifier */}
              <FormField id="price_qualifier" label="Price qualifier">
                <select
                  id="price_qualifier"
                  value={form.price_qualifier}
                  onChange={(e) => set("price_qualifier", e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PRICE_QUALIFIERS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Property type */}
              <FormField id="property_type" label="Property type">
                <select
                  id="property_type"
                  value={form.property_type}
                  onChange={(e) => set("property_type", e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                  <option value="loft">Loft</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField id="bedrooms" label="Bedrooms">
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
              </FormField>

              <FormField id="bathrooms" label="Bathrooms">
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                />
              </FormField>

              <FormField id="tenure" label="Tenure (optional)">
                <Input
                  id="tenure"
                  placeholder="Leasehold / Freehold"
                  value={form.tenure}
                  onChange={(e) => set("tenure", e.target.value)}
                />
              </FormField>

              {/* Description */}
              <div className="md:col-span-2">
                <FormField id="description" label="Description">
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the property…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormField>
              </div>

              {/* Key features tag input */}
              <div className="md:col-span-2">
                <FormField id="features" label="Key features (optional)">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="features"
                        placeholder="e.g. Private garden, then press Enter"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={onFeatureKeyDown}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 shrink-0 rounded-[10px] px-4 text-sm"
                        onClick={addFeature}
                      >
                        Add
                      </Button>
                    </div>
                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {features.map((f) => (
                          <span
                            key={f}
                            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[13px] text-[#0F172A]"
                          >
                            {f}
                            <button
                              type="button"
                              onClick={() => removeFeature(f)}
                              className="text-[#6B7280] hover:text-red-500"
                              aria-label={`Remove ${f}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[12px] text-[#6B7280]">
                      Add key selling points shown to buyers (e.g. Private
                      garden, Parking, South-facing).
                    </p>
                  </div>
                </FormField>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 rounded-[10px] bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800"
              >
                {loading ? "Saving…" : "Save as draft"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-[10px] px-6 text-sm"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
