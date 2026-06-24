"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const ALERT_OPTIONS = [
  { id: "new_properties", label: "New properties" },
  { id: "price_changes", label: "Price changes" },
  { id: "status_updates", label: "Status updates (under offer, let agreed, sold)" },
];

type Notification = {
  id: string;
  type: string;
  property_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type AlertPreferences = {
  new_properties: boolean;
  price_changes: boolean;
  status_updates: boolean;
};

export default function AlertsPage() {
  const [prefs, setPrefs] = useState<AlertPreferences>({
    new_properties: true,
    price_changes: true,
    status_updates: false,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
    loadNotifications();
  }, []);

  async function loadPreferences() {
    try {
      const { data, error } = await supabaseClient.rpc("get_user_alert_preferences");
      if (!error && data && data.length > 0) {
        setPrefs(data[0]);
      }
    } catch (err) {
      console.error("Failed to load preferences:", err);
    }
  }

  async function loadNotifications() {
    try {
      const { data, error } = await supabaseClient
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await supabaseClient.rpc("mark_notification_read", { notification_id: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  async function markAllAsRead() {
    try {
      await supabaseClient.rpc("mark_all_notifications_read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }

  function toggle(id: keyof AlertPreferences) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await supabaseClient.rpc("update_user_alert_preferences", {
        p_new_properties: prefs.new_properties,
        p_price_changes: prefs.price_changes,
        p_status_updates: prefs.status_updates,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900">
          Alerts & Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[13px] font-semibold text-[#08519A] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Recent notifications ({unreadCount} unread)
          </h2>
        </div>
        <div>
          {loading ? (
            <div className="p-8 text-center text-[14px] text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-[14px] text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 transition-colors hover:bg-gray-50 ${
                    !notification.is_read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                        <h3 className="text-[14px] font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-[13px] text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-[12px] text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.property_id && (
                        <Link
                          href={`/property/${notification.property_id}`}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          View Property
                        </Link>
                      )}
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alert Preferences */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-[16px] font-semibold text-gray-900">
          Alert preferences
        </h2>
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
            disabled={saving}
            className="rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75] disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save preferences"}
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
