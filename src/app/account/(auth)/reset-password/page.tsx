"use client";

import { useState } from "react";
import Link from "next/link";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="w-full rounded-xl border border-[#E5E7EB]">
      <CardContent className="space-y-6 p-6 md:p-7">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-[#0F172A]">
            Choose a new password
          </h1>
          <p className="text-sm text-[#6B7280]">
            Enter a new password for your account.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-[#0F172A]">Password updated</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            <FormField id="password" label="New password">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-[10px] bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link href="/account/login" className="text-[#0F172A] hover:underline">
            Go to sign in
          </Link>
          <Link href="/account/forgot-password" className="text-[#0F172A] hover:underline">
            Need a reset link?
          </Link>
        </div>

        <p className="text-xs text-[#6B7280]">
          For security, choose a unique password you don't use elsewhere.
        </p>
      </CardContent>
    </Card>
  );
}
