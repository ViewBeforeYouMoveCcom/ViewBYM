"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AgentsAuthRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "no_access" | "rejected">("checking");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user || !user.email) {
        router.replace("/agents/login");
        return;
      }

      // If user already has an agency, let them through
      const { data: memberships } = await supabaseClient
        .from("agency_members")
        .select("agency_id")
        .eq("user_id", user.id)
        .limit(1);

      if (memberships && memberships.length > 0) {
        router.replace("/agent/dashboard");
        return;
      }

      // No agency — check application status
      const { data: application } = await supabaseClient
        .from("agent_applications")
        .select("status")
        .eq("business_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (application?.status === "approved") {
        router.replace("/agent/onboarding");
        return;
      }

      if (application?.status === "rejected") {
        setStatus("rejected");
        return;
      }

      // No application or pending
      setStatus("no_access");
    }

    check();
  }, [router]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-sm text-[#6B7280]">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-5 py-10">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {status === "rejected" ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Application not approved</h1>
              <p className="mt-2 text-sm text-gray-500">
                Your agent access request was not approved. Please contact our team.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: "#08519A" }}>
                Contact support
              </Link>
              <button onClick={async () => { await supabaseClient.auth.signOut(); router.push("/"); }} className="text-sm text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Agent access required</h1>
              <p className="mt-2 text-sm text-gray-500">
                Please contact our team to request agent access.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: "#08519A" }}>
                Contact us
              </Link>
              <button onClick={async () => { await supabaseClient.auth.signOut(); router.push("/"); }} className="text-sm text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
