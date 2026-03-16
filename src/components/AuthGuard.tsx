"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(`/account/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setAuthed(true);
      }
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace(`/account/login?redirect=${encodeURIComponent(pathname)}`);
        setAuthed(false);
      } else {
        setAuthed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (!checked || !authed) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
