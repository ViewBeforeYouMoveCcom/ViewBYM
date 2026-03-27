"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next") ?? "/account/saved-properties";

    // supabaseClient has detectSessionInUrl: true, so it automatically:
    // • reads #access_token hash (Supabase implicit flow) → creates session
    // • reads ?code= query param (PKCE flow) → exchanges for session
    // onAuthStateChange fires as soon as either path establishes a session.
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        subscription.unsubscribe();
        router.replace(next);
      }
    });

    // Handle the case where the session is already present before the
    // listener fires (e.g. very fast implicit-flow token parse).
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        router.replace(next);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-blue-700" />
        <p className="text-sm text-[#6B7280]">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-blue-700" />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
