"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabaseClient";

const ALERT_OPTIONS = [
  {
    id: "new-properties",
    label: "New properties",
    description: "When new listings match your saved searches",
  },
  {
    id: "price-changes",
    label: "Price reductions",
    description: "When a saved property has its price reduced",
  },
  {
    id: "status-updates",
    label: "Status updates",
    description: "When a saved property goes under offer, let agreed, or sold",
  },
];

type AlertPrefs = Record<string, boolean>;

const DEFAULT_PREFS: AlertPrefs = {
  "new-properties": true,
  "price-changes": true,
  "status-updates": false,
};

export default function AlertsPage() {
  const [prefs, setPrefs] = useState<AlertPrefs>(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        // Fetch from profiles.alert_prefs (added in migration 003)
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("alert_prefs")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.alert_prefs) {
          setPrefs({ ...DEFAULT_PREFS, ...(profile.alert_prefs as AlertPrefs) });
        }
      } else {
        // Guest fallback: persist to localStorage
        try {
          const raw = localStorage.getItem("vbym_alert_prefs");
          if (raw) setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as AlertPrefs) });
        } catch {
          /* ignore */
        }
      }

      setLoaded(true);
    }
    load();
  }, []);

  function toggle(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);

    if (isLoggedIn) {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        await supabaseClient.from("profiles").upsert(
          { id: user.id, alert_prefs: prefs },
          { onConflict: "id" }
        );
      }
    } else {
      localStorage.setItem("vbym_alert_prefs", JSON.stringify(prefs));
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!loaded) {
    return (
      <div className="space-y-4">
        <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
          Alert preferences
        </h1>
        <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
        Alert preferences
      </h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-5 text-[14px] text-gray-500">
          Choose which updates you&apos;d like to receive about your saved
          properties and searches.
        </p>

        <div className="space-y-5">
          {ALERT_OPTIONS.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <Checkbox
                id={alert.id}
                checked={prefs[alert.id] ?? false}
                onCheckedChange={() => toggle(alert.id)}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor={alert.id}
                  className="cursor-pointer text-[14px] font-semibold text-gray-900"
                >
                  {alert.label}
                </Label>
                <p className="text-[13px] text-gray-500">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save preferences"}
          </button>
        </div>
      </div>

      {/* Email alerts notice */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-[14px] font-semibold text-gray-900">
          Email alerts
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">
          Email notifications for saved searches and price changes are coming
          soon. Your preferences are saved and will take effect when email
          alerts launch.
        </p>
        {!isLoggedIn && (
          <p className="mt-3 text-[13px] text-gray-400">
            <a href="/account/signup" className="underline text-gray-600">
              Create an account
            </a>{" "}
            to ensure your preferences are saved across devices.
          </p>
        )}
      </div>
    </div>
  );
}
