"use client";

import { useState } from "react";
import Link from "next/link";

import FormField from "@/components/FormField";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Choose a new password
        </h1>
        <p className="text-[14px] text-gray-500">
          Enter a new password for your account.
        </p>
      </div>

      {success ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] text-blue-700">
          <p className="font-bold">Password updated</p>
          <p className="mt-1">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField id="password" label="New password">
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          <FormField id="confirm" label="Confirm new password">
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13.5px] text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between text-[13.5px]">
        <Link
          href="/account/login"
          className="text-gray-700 hover:text-gray-900 hover:underline"
        >
          ← Back to sign in
        </Link>
        <Link
          href="/account/forgot-password"
          className="text-gray-700 hover:text-gray-900 hover:underline"
        >
          Need a reset link?
        </Link>
      </div>

      <p className="mt-4 text-[12px] text-gray-400">
        For security, choose a unique password you don&apos;t use elsewhere.
      </p>
    </div>
  );
}
