"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

import { getCookieConsent, onCookieConsentChange } from "@/lib/cookieConsent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getCookieConsent() === "accepted");
    return onCookieConsentChange((value) => setConsented(value === "accepted"));
  }, []);

  if (!id || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
