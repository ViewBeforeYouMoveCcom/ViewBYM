"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { supabaseClient } from "@/lib/supabaseClient";

type Step = "validating" | "invalid" | "signup" | "agency" | "done";

export default function AgentJoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [step, setStep] = useState<Step>("validating");
  const [inviteId, setInviteId] = useState<string | null>(null);

  // Signup fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Agency fields
  const [agencyName, setAgencyName] = useState("");
  const [agencyCity, setAgencyCity] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate token on load
  useEffect(() => {
    async function validate() {
      const { data } = await supabaseClient
        .from("agency_invites")
        .select("id, used_at, expires_at")
        .eq("token", token)
        .maybeSingle();

      if (!data) { setStep("invalid"); return; }
      if (data.used_at) { setStep("invalid"); return; }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { setStep("invalid"); return; }

      setInviteId(data.id);
      setStep("signup");
    }
    validate();
  }, [token]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabaseClient.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Sign in immediately (some Supabase configs auto-confirm)
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      // Email confirmation may be required
      setError("Account created — please check your email to confirm your address, then return here to complete setup.");
      setLoading(false);
      return;
    }

    setStep("agency");
    setLoading(false);
  }

  async function handleAgency(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { setError("Session lost. Please refresh."); setLoading(false); return; }

    // Create agency as approved (invite bypasses review)
    const { data: agency, error: agencyError } = await supabaseClient
      .from("agencies")
      .insert({
        name: agencyName.trim(),
        city: agencyCity.trim() || null,
        phone: agencyPhone.trim() || null,
        status: "approved",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (agencyError || !agency) {
      setError("Failed to create agency. Please try again.");
      setLoading(false);
      return;
    }

    // Add user as owner
    await supabaseClient.from("agency_members").insert({
      agency_id: agency.id,
      user_id: user.id,
      member_role: "owner",
    });

    // Update profile name
    await supabaseClient
      .from("profiles")
      .update({ full_name: fullName.trim(), role: "agent" })
      .eq("id", user.id);

    // Mark invite as used
    await supabaseClient
      .from("agency_invites")
      .update({ used_at: new Date().toISOString(), used_by_agency_id: agency.id })
      .eq("id", inviteId);

    setStep("done");
    setLoading(false);

    setTimeout(() => router.push("/agent/dashboard"), 2500);
  }

  // ── Validating ──────────────────────────────────────────────────
  if (step === "validating") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#08519A]" />
          <p className="text-sm text-gray-500">Validating invite…</p>
        </div>
      </Shell>
    );
  }

  // ── Invalid ──────────────────────────────────────────────────────
  if (step === "invalid") {
    return (
      <Shell>
        <div className="space-y-3 text-center py-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-gray-900">Invalid or expired invite</h2>
          <p className="text-[13.5px] text-gray-500">
            This invite link has already been used, expired, or doesn&apos;t exist.<br />
            Please contact VBYM to request a new one.
          </p>
          <Link href="/contact" className="mt-2 inline-block text-[13.5px] font-medium text-[#08519A] hover:underline">
            Contact us →
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <Shell>
        <div className="space-y-3 text-center py-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-gray-900">You&apos;re all set!</h2>
          <p className="text-[13.5px] text-gray-500">Your agency account is ready. Redirecting to your dashboard…</p>
        </div>
      </Shell>
    );
  }

  // ── Signup ───────────────────────────────────────────────────────
  if (step === "signup") {
    return (
      <Shell>
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-green-600">Invited access</p>
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">Create your account</h1>
          <p className="text-[13.5px] text-gray-500">Step 1 of 2 — your personal login details</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Field label="Full name">
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith" className={inputCls} />
          </Field>
          <Field label="Email address">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@agency.co.uk" autoComplete="email" className={inputCls} />
          </Field>
          <Field label="Password">
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters" autoComplete="new-password" className={inputCls} />
          </Field>

          {error && <ErrorBox>{error}</ErrorBox>}

          <SubmitButton loading={loading}>Continue →</SubmitButton>
        </form>
      </Shell>
    );
  }

  // ── Agency ───────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="mb-6 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-green-600">Invited access</p>
        <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">Set up your agency</h1>
        <p className="text-[13.5px] text-gray-500">Step 2 of 2 — your agency details</p>
      </div>

      <form onSubmit={handleAgency} className="space-y-4">
        <Field label="Agency name">
          <input type="text" required value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
            placeholder="Jones & Partners" className={inputCls} />
        </Field>
        <Field label="City / branch location">
          <input type="text" value={agencyCity} onChange={(e) => setAgencyCity(e.target.value)}
            placeholder="Manchester" className={inputCls} />
        </Field>
        <Field label="Phone number">
          <input type="tel" value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)}
            placeholder="+44 7700 900000" className={inputCls} />
        </Field>

        {error && <ErrorBox>{error}</ErrorBox>}

        <SubmitButton loading={loading}>Create agency &amp; go to dashboard →</SubmitButton>
      </form>
    </Shell>
  );
}

// ── Small helper components ──────────────────────────────────────

const inputCls = "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/20 px-5 py-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image src="/images/vbym-logo.png" alt="VBYM" width={800} height={55} className="h-5 w-auto" priority />
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {children}
        </div>
        <p className="mt-6 text-center text-[12px] text-gray-400">
          Already have an account?{" "}
          <Link href="/agents/login" className="text-gray-600 underline hover:text-gray-900">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13.5px] text-red-700">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
      </svg>
      {children}
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full rounded-xl bg-[#08519A] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#063d75] disabled:opacity-60">
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Please wait…
        </span>
      ) : children}
    </button>
  );
}
