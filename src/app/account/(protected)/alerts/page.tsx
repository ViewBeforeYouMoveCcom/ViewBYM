"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ALERT_OPTIONS = [
  { id: "new-properties", label: "New properties" },
  { id: "price-changes", label: "Price changes" },
  { id: "status-updates", label: "Status updates (under offer, let agreed, sold)" },
];

const STORAGE_KEY = "vbym_alert_prefs";

export default function AlertsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    "new-properties": true,
    "price-changes": true,
    "status-updates": false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs(JSON.parse(raw) as Record<string, boolean>);
    } catch {}
  }, []);

  function toggle(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
        Alert preferences
      </h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-4 text-[14px] text-gray-500">
          Choose which notifications you&apos;d like to receive when saved searches
          have updates.
        </p>

        <div className="space-y-4">
          {ALERT_OPTIONS.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3">
              <Checkbox
                id={alert.id}
                checked={prefs[alert.id] ?? false}
                onCheckedChange={() => toggle(alert.id)}
              />
              <Label
                htmlFor={alert.id}
                className="cursor-pointer text-[14px] text-gray-700"
              >
                {alert.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]"
          >
            {saved ? "Saved!" : "Save preferences"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-[14px] font-semibold text-gray-900">Email alerts</p>
        <p className="mt-1 text-[13.5px] text-gray-500">
          Email notifications will be sent to your account email address when
          matching properties appear on the platform.
        </p>
      </div>
    </div>
  );
}
