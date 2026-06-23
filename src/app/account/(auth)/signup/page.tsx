"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import FormField from "@/components/FormField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account/saved-properties";
  const authCallback = `/account/auth-callback?next=${encodeURIComponent(redirectTo)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const passwordsMatch = useMemo(() => {
    if (!password || !confirm) return true;
    return password === confirm;
  }, [password, confirm]);

  /* Password strength indicator */
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"][passwordStrength];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    if (!consent) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabaseClient.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${authCallback}`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    setSuccess(true);
  }

  async function resendConfirmation() {
    setResending(true);
    setError(null);
    setResendMessage(null);

    const { error: resendError } = await supabaseClient.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}${authCallback}`,
      },
    });

    setResending(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setResendMessage("Confirmation email resent. Please check your inbox and spam folder.");
  }

  if (success) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[.14em] text-emerald-600">
            Success
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-gray-900">
            Account created
          </h1>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-[14px] text-blue-700">
          <p className="font-bold">Check your email</p>
          <p className="mt-1">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then sign in below.
          </p>
          <p className="mt-1.5 text-[13px] text-blue-600/80">
            If it does not arrive, check spam or resend the confirmation email.
          </p>
        </div>

        {resendMessage && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-700">
            {resendMessage}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={resendConfirmation}
          disabled={resending}
          className="mt-4 w-full rounded-xl border border-blue-200 bg-white py-3 text-center text-[14px] font-bold text-[#08519A] transition-colors hover:bg-blue-50 disabled:opacity-60"
        >
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>

        <Link
          href={`/account/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="mt-6 block w-full rounded-xl bg-[#08519A] py-3 text-center text-[14px] font-bold text-white shadow-sm shadow-blue-900/15 transition-all duration-200 hover:bg-[#063d75] hover:shadow-md"
        >
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm shadow-gray-100/50">
      <div className="mb-7 space-y-2 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[.14em] text-black">
          Get started
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#08519A]">
          Create your account
        </h1>
        <p className="text-[14px] text-gray-500">
          Join thousands of users discovering their perfect property — it&apos;s completely free.
        </p>
      </div>

      {/* Google first */}
      <GoogleSignInButton
        redirectTo={authCallback}
        label="Sign up with Google"
      />

      <p className="mt-2 text-center text-[12px] text-gray-400">
        Google sign-up skips email verification
      </p>

      {/* Divider */}
      <div className="relative my-6 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-[12px] font-medium text-gray-400">or register with email</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField id="email" label="Email address">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
          />
        </FormField>

        <FormField id="password" label="Password">
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="h-11 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-[14px] transition-colors focus:bg-white focus:border-[#08519A]/30"
          />
          {/* Password strength bar */}
          {password && (
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

        <FormField id="confirm" label="Confirm password">
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

        {!passwordsMatch ? (
          <p className="flex items-center gap-1.5 text-[13px] text-red-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            Passwords do not match
          </p>
        ) : null}

        <div className="flex items-start gap-3 rounded-xl bg-gray-50/80 p-3 text-[13.5px] text-gray-500">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(Boolean(v))}
            className="mt-0.5"
          />
          <label htmlFor="consent" className="leading-relaxed">
            I agree to the{" "}
            <Link href="/legal/terms" className="font-medium text-[#08519A] underline">
              Terms of Service
            </Link>
            {" "}and understand the{" "}
            <Link href="/legal/privacy" className="font-medium text-[#08519A] underline">
              Privacy Policy
            </Link>
          </label>
        </div>

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
              Creating account...
            </span>
          ) : "Create account"}
        </button>

        <p className="text-center text-[13.5px] text-gray-500">
          Already have an account?{" "}
          <Link
            href={`/account/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-[#08519A] transition-colors hover:text-[#063d75]"
          >
            Sign in →
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full animate-pulse rounded-2xl border border-gray-200 bg-white" />
      }
    >
      <SignupForm />
    </Suspense>
  );
}
