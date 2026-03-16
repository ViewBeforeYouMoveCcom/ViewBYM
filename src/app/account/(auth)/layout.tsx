import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header band */}
      <header className="border-b border-gray-200 bg-white py-5">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-gray-900">
              View Before You Move
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/"
                className="text-[13.5px] text-gray-500 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-[13.5px] text-gray-500 hover:text-gray-900"
              >
                Browse
              </Link>
              <Link
                href="/faq"
                className="text-[13.5px] text-gray-500 hover:text-gray-900"
              >
                Help
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="py-16">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_400px]">
            {/* Main — form */}
            <div>{children}</div>

            {/* Right rail — hidden on mobile */}
            <div className="hidden lg:block">
              <h2 className="mb-4 text-[18px] font-bold text-gray-900">
                Why create an account?
              </h2>

              <ul className="space-y-3">
                {[
                  "Save properties and revisit later",
                  "Save searches and receive alerts",
                  "Compare listings after VR viewings",
                  "Keep your shortlist organised",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-[12px] font-bold text-white">
                      ✓
                    </span>
                    <span className="text-[14px] text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-[14px] font-semibold text-gray-900">
                  Privacy note
                </p>
                <p className="mt-1 text-[13.5px] text-gray-500">
                  We only use your details to provide account features and
                  respond to support requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer micro */}
      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="mx-auto w-full max-w-[1200px] px-5 text-[12.5px] text-gray-400">
          By using VBYM you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-gray-600">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </div>
      </footer>
    </div>
  );
}
