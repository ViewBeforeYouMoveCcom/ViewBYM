"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCookieConsent, setCookieConsent, onCookieConsentChange } from "@/lib/cookieConsent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
    return onCookieConsentChange((value) => setVisible(value === null));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-[1800px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] leading-relaxed text-gray-600">
          We use strictly necessary cookies to run this site securely — these can&apos;t be switched off. We don&apos;t currently use analytics or tracking cookies; if that ever changes, we&apos;ll ask first. See our{" "}
          <Link href="/legal/cookies" className="font-medium text-[#08519A] underline">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={() => setCookieConsent("rejected")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-[13.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={() => setCookieConsent("accepted")}
            className="rounded-lg bg-[#08519A] px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#063d75]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
