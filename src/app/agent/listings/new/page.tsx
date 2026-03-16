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

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    address: "",  // maps to address_line1 in DB
    city: "",
    postcode: "",
    price: "",            // numeric GBP amount (no £ sign needed)
    bedrooms: "",
    bathrooms: "",
    property_type: "apartment",
    market_status: "available",  // matches DB column default
    tenure: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { setError("Session expired."); setLoading(false); return; }

    const { data: membership } = await supabaseClient
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership) { setError("No agency found."); setLoading(false); return; }

    // Strip any non-numeric characters from price input (handles "£625,000" etc.)
    const priceNumeric = form.price
      ? parseFloat(form.price.replace(/[^0-9.]/g, ""))
      : null;

    const { data: inserted, error: insertError } = await supabaseClient
      .from("properties")
      .insert({
        agency_id: membership.agency_id,
        title: form.title.trim(),        // NOT NULL in real schema
        address_line1: form.address.trim() || null,
        city: form.city.trim() || null,
        postcode: form.postcode.trim() || null,
        price: priceNumeric,             // numeric(12,2) GBP — not price_display
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        property_type: form.property_type,
        market_status: form.market_status,
        tenure: form.tenure.trim() || null,
        description: form.description.trim() || null,
        status: "draft",
        created_by: user.id,             // triggers add_creator_as_agency_owner
        slug: generateSlug(form.title, form.address),  // NOT NULL in real schema
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
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Add listing</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Fill in the property details. You can publish once you&apos;re ready.
        </p>
      </div>

      <Card className="rounded-xl border border-[#E5E7EB]">
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
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

              <FormField id="market_status" label="Availability">
                <select
                  id="market_status"
                  value={form.market_status}
                  onChange={(e) => set("market_status", e.target.value)}
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
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </FormField>

              <FormField id="property_type" label="Property type">
                <select
                  id="property_type"
                  value={form.property_type}
                  onChange={(e) => set("property_type", e.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="md:col-span-2">
                <FormField id="description" label="Description">
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the property…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
