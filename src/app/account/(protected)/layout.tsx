"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";

const navItems = [
  { href: "/account/saved-properties", label: "Saved properties" },
  { href: "/account/saved-searches", label: "Saved searches" },
  { href: "/account/enquiries", label: "My enquiries" },
  { href: "/account/alerts", label: "Alerts" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-[1800px] px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <p className="mb-3 px-3 text-[12px] font-bold uppercase tracking-[.1em] text-gray-400">
              My account
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
