"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCodeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const hash = window.location.hash;

    if (code) {
      // PKCE flow — forward to auth-callback
      router.replace(`/account/auth-callback?${searchParams.toString()}`);
      return;
    }

    if (hash && hash.includes("access_token")) {
      // Implicit flow — forward hash to auth-callback
      router.replace(`/account/auth-callback${hash}`);
      return;
    }
  }, [router, searchParams]);

  return null;
}
