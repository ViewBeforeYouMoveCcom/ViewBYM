"use client";

import { useMemo, useState } from "react";
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

  /* Password strength indicator */
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  }, [newPassword]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"][passwordStrength];

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
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
      <div className="mb-7 space-y-2 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#08519A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-[#08519A]">
          Choose a new password
        </h1>
        <p className="text-[14px] text-gray-500">
          Create a strong, unique password to keep your account secure.
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-[14px] text-emerald-700">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <p className="font-bold">Password updated</p>
            </div>
            <p className="mt-1">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
          </div>
          <Link
            href="/account/login"
            className="block w-full rounded-xl bg-[#08519A] py-3 text-center text-[14px] font-bold text-white shadow-sm shadow-blue-900/15 transition-all duration-200 hover:bg-[#063d75] hover:shadow-md"
          >
            Sign in with new password →
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField id="password" label="New password">
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
            />
            {/* Password strength bar */}
            {newPassword && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        level <= passwordStrength ? strengthColor : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[11px] font-semibold ${
                  passwordStrength <= 1 ? "text-red-500" :
                  passwordStrength === 2 ? "text-amber-500" :
                  passwordStrength === 3 ? "text-blue-600" : "text-emerald-600"
                }`}>
                  {strengthLabel}
                </span>
              </div>
            )}
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
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
            />
          </FormField>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13.5px] text-red-700 flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#08519A] py-3 text-[14px] font-bold text-white shadow-sm shadow-blue-900/15 transition-all duration-200 hover:bg-[#063d75] hover:shadow-md disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Updating...
              </span>
            ) : "Update password"}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between text-[13.5px]">
        <Link
          href="/account/login"
          className="flex items-center gap-1 font-medium text-gray-500 transition-colors hover:text-[#08519A]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Back to sign in
        </Link>
        <Link
          href="/account/forgot-password"
          className="font-medium text-gray-500 transition-colors hover:text-[#08519A]"
        >
          Need a new reset link?
        </Link>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50/80 p-3">
        <p className="text-[12px] font-semibold text-gray-500 mb-1.5">Password tips</p>
        <ul className="space-y-1 text-[12px] text-gray-400">
          <li className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${newPassword.length >= 8 ? "bg-emerald-500" : "bg-gray-300"}`}/>
            At least 8 characters
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-emerald-500" : "bg-gray-300"}`}/>
            One uppercase letter
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(newPassword) ? "bg-emerald-500" : "bg-gray-300"}`}/>
            One number
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-emerald-500" : "bg-gray-300"}`}/>
            One special character
          </li>
        </ul>
      </div>
    </div>
  );
}
