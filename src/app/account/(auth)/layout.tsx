import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Body — vertically centered */}
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[840px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main — form */}
            <div>{children}</div>

            {/* Right rail — hidden on mobile */}
            <div className="hidden lg:block">
              {/* Benefits card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[17px] font-bold text-gray-900">
                  Why create an account?
                </h2>

                <ul className="space-y-4">
                  {[
                    {
                      text: "Save properties and revisit later",
                      accent: "from-blue-500 to-blue-700",
                      shadow: "shadow-blue-200",
                    },
                    {
                      text: "Save searches and receive alerts",
                      accent: "from-violet-500 to-indigo-700",
                      shadow: "shadow-violet-200",
                    },
                    {
                      text: "Compare listings after VR viewings",
                      accent: "from-emerald-500 to-teal-700",
                      shadow: "shadow-emerald-200",
                    },
                    {
                      text: "Keep your shortlist organised",
                      accent: "from-amber-500 to-orange-600",
                      shadow: "shadow-amber-200",
                    },
                  ].map((benefit) => (
                    <li key={benefit.text} className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.accent} text-[11px] font-bold text-white shadow-sm ${benefit.shadow}`}>
                        ✓
                      </span>
                      <span className="text-[14px] text-gray-600">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* VR promo */}
              <div className="mt-4 rounded-2xl bg-[#1A3A6C] p-5">
                <p className="text-[13px] font-bold text-white">
                  Explore with VR
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                  Tour every room from your sofa before committing to a viewing.
                </p>
                <Link
                  href="/how-vr-works"
                  className="mt-3 inline-flex text-[13px] font-semibold text-blue-300 transition-colors hover:text-white"
                >
                  How VR works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>



    </div>
  );
}
