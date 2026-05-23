"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

/**
 * Transient page — agents land here after Google OAuth.
 * Never shows meaningful UI; spinner only.
 */
export default function AgentAuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      const { data: sessionData } = await supabaseClient.auth.getSession();

      if (!sessionData.session) {
        router.replace("/agents/login");
        return;
      }

      router.replace("/agent/dashboard");
    }

    redirect();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-blue-700" />
        <p className="text-sm text-[#6B7280]">Signing you in…</p>
      </div>
    </div>
  );
}
