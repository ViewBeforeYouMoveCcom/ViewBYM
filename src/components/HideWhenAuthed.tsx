"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function HideWhenAuthed({ children }: { children: React.ReactNode }) {
  const [resolved, setResolved] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session?.user);
      setResolved(true);
    });
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session?.user);
      setResolved(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!resolved || authed) return null;
  return <>{children}</>;
}
