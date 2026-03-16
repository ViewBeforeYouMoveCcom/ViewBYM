import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px]">


          {/* Form card */}
          {children}

          {/* Bottom trust indicators */}
          <div className="mt-8 space-y-4">
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-[12px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure &amp; encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                GDPR compliant
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Free forever
              </span>
            </div>

            {/* Helpful links */}
            <p className="text-center text-[12px] text-gray-400">
              Need help?{" "}
              <Link href="/contact" className="text-gray-500 underline transition-colors hover:text-[#08519A]">
                Contact support
              </Link>
              {" · "}
              <Link href="/faq" className="text-gray-500 underline transition-colors hover:text-[#08519A]">
                FAQ
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
