"use client";

import { useEffect, useState } from "react";

import FormField from "@/components/FormField";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

type FormMessage = { type: "success" | "error"; text: string } | null;

function Msg({ msg }: { msg: FormMessage }) {
  if (!msg) return null;
  return (
    <div
      className={`rounded-xl border p-3 text-[13.5px] ${
        msg.type === "success"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {msg.text}
    </div>
  );
}

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [emailMsg, setEmailMsg] = useState<FormMessage>(null);
  const [passwordMsg, setPasswordMsg] = useState<FormMessage>(null);
  const [profileMsg, setProfileMsg] = useState<FormMessage>(null);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        supabaseClient
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setFullName(data.full_name ?? "");
              setPhone(data.phone ?? "");
            }
          });
      }
    });
  }, []);

  async function onEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMsg(null);
    const { error } = await supabaseClient.auth.updateUser({ email: email.trim() });
    setEmailLoading(false);
    if (error) {
      setEmailMsg({ type: "error", text: error.message });
    } else {
      setEmailMsg({ type: "success", text: "Confirmation sent to your new email address." });
    }
  }

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setNewPassword("");
      setPasswordMsg({ type: "success", text: "Password updated." });
    }
  }

  async function onProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    const { error } = await supabaseClient
      .from("profiles")
      .upsert(
        { id: user.id, full_name: fullName.trim() || null, phone: phone.trim() || null },
        { onConflict: "id" }
      );
    setProfileLoading(false);
    if (error) {
      setProfileMsg({ type: "error", text: error.message });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated." });
      // Notify HeaderNav to update the displayed name immediately
      window.dispatchEvent(
        new CustomEvent("vbym:profile-updated", {
          detail: { full_name: fullName.trim() || null },
        })
      );
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-gray-900 mb-6">
        Account settings
      </h1>

      {/* Profile */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-[15px] font-bold text-gray-900">Profile</h2>
        <form className="space-y-4" onSubmit={onProfileSubmit}>
          <FormField id="full-name" label="Full name">
            <Input
              id="full-name"
              placeholder="Sophie Reeves"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormField>
          <FormField id="phone" label="Phone">
            <Input
              id="phone"
              placeholder="+44 20 7946 0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>
          <Msg msg={profileMsg} />
          <button
            type="submit"
            disabled={profileLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-60"
          >
            {profileLoading ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>

      {/* Email */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-[15px] font-bold text-gray-900">Email</h2>
        <form className="space-y-4" onSubmit={onEmailSubmit}>
          <FormField id="email" label="Email address">
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <Msg msg={emailMsg} />
          <button
            type="submit"
            disabled={emailLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-60"
          >
            {emailLoading ? "Updating…" : "Update email"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-[15px] font-bold text-gray-900">Password</h2>
        <form className="space-y-4" onSubmit={onPasswordSubmit}>
          <FormField id="new-password" label="New password">
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>
          <Msg msg={passwordMsg} />
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-60"
          >
            {passwordLoading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-[15px] font-bold text-gray-900">
          Notifications
        </h2>
        <p className="text-[13.5px] text-gray-500">
          Notification preferences are managed in the{" "}
          <a href="/account/alerts" className="text-gray-900 underline">
            Alerts
          </a>{" "}
          section.
        </p>
      </div>
    </div>
  );
}
