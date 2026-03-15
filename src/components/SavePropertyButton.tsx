"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabaseClient";

const STORAGE_KEY = "vbym_saved_properties";
// UUID pattern — only DB properties use the saved_properties table
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  type: string;
}

interface Props {
  property: SavedProperty;
  className?: string;
}

export default function SavePropertyButton({ property, className }: Props) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isDbProperty = UUID_RE.test(property.id);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUserId(user?.id ?? null);

      if (user && isDbProperty) {
        // Logged-in + DB property: check saved_properties table
        const { data } = await supabaseClient
          .from("saved_properties")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", property.id)
          .maybeSingle();
        setSaved(!!data);
      } else {
        // Guest or mock property: check localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const list: SavedProperty[] = raw ? JSON.parse(raw) : [];
          setSaved(list.some((p) => p.id === property.id));
        } catch {}
      }
    }
    init();
  }, [property.id, isDbProperty]);

  async function toggle() {
    setLoading(true);
    try {
      if (userId && isDbProperty) {
        // DB save / unsave
        if (saved) {
          await supabaseClient
            .from("saved_properties")
            .delete()
            .eq("user_id", userId)
            .eq("property_id", property.id);
        } else {
          await supabaseClient.from("saved_properties").insert({
            user_id: userId,
            property_id: property.id,
          });
        }
        setSaved(!saved);
      } else {
        // localStorage fallback
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          let list: SavedProperty[] = raw ? JSON.parse(raw) : [];
          if (saved) {
            list = list.filter((p) => p.id !== property.id);
          } else {
            list = [...list, property];
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          setSaved(!saved);
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggle}
      disabled={loading}
      className={className}
      aria-label={saved ? "Remove from saved" : "Save property"}
    >
      {saved ? "Saved ♥" : "Save property"}
    </Button>
  );
}
