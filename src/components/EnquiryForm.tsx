"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import FormField from "@/components/FormField";
import LoginPromptModal from "@/components/LoginPromptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/lib/supabaseClient";

interface Props {
  propertyId: string;
  agencyId: string;  // required: real schema has agency_id NOT NULL on enquiries
  agentEmail?: string;
  propertyTitle?: string;
}

export default function EnquiryForm({ propertyId, agencyId, agentEmail, propertyTitle }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const redirectParam = encodeURIComponent(pathname);

  const loadUser = useCallback(async () => {
    const {
      data: { user: currentUser },
    } = await supabaseClient.auth.getUser();

    setUser(currentUser);
    setAuthChecked(true);

    if (!currentUser) return;

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", currentUser.id)
      .maybeSingle();

    const metadata = currentUser.user_metadata as Record<string, unknown>;
    const metadataName =
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
          ? metadata.name
          : "";

    setForm((prev) => ({
      ...prev,
      name: prev.name || profile?.full_name || metadataName || "",
      email: currentUser.email ?? prev.email,
      phone: prev.phone || profile?.phone || "",
    }));
  }, []);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setForm((prev) => ({ ...prev, email: session.user.email ?? prev.email }));
      }
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.access_token) {
        setError("Please sign in before sending an enquiry.");
        setLoading(false);
        await loadUser();
        return;
      }

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          propertyId,
          agencyId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          agentEmail,
          propertyTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Could not send enquiry. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Could not send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-gray-900">Enquiry sent</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          The agent will be in touch shortly.
          {agentEmail && (
            <>
              {" "}You can also email them directly at{" "}
              <a href={`mailto:${agentEmail}`} className="underline">
                {agentEmail}
              </a>
              .
            </>
          )}
        </p>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
        <p className="text-sm text-[#6B7280]">Checking your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-gray-900">Sign in to send an enquiry</p>
        <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
          Create a free account or sign in before contacting the agent. Your enquiries will be saved in your account.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="rounded-[10px] bg-[#08519A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#063d75]"
          >
            Sign in
          </button>
          <Link
            href={`/account/signup?redirect=${redirectParam}`}
            className="rounded-[10px] border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#08519A] hover:bg-blue-50"
          >
            Create free account
          </Link>
        </div>
        <LoginPromptModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={loadUser}
          heading="Sign in to enquire"
          subheading="Sign in to contact the agent and keep your enquiries in one place."
          ctaLabel="Sign in to continue"
          signupHref={`/account/signup?redirect=${redirectParam}`}
          dialogLabel="Sign in to send enquiry"
        />
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormField id="enq-name" label="Your name">
        <Input
          id="enq-name"
          placeholder="Sophie Reeves"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </FormField>

      <FormField id="enq-email" label="Email">
        <Input
          id="enq-email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          readOnly
          className="bg-gray-50 text-gray-500"
          required
        />
      </FormField>

      <FormField id="enq-phone" label="Phone (optional)">
        <Input
          id="enq-phone"
          placeholder="+44 7700 900000"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </FormField>

      <FormField id="enq-message" label="Message">
        <textarea
          id="enq-message"
          rows={3}
          placeholder="I'd like to arrange a viewing…"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
          className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-[10px] bg-[#08519A] text-sm font-semibold text-white hover:bg-[#063d75]"
      >
        {loading ? "Sending…" : "Send enquiry"}
      </Button>

      <p className="text-xs text-[#6B7280]">
        View Before You Move is not an estate agency. Enquiries go directly to the agent.
      </p>
    </form>
  );
}
