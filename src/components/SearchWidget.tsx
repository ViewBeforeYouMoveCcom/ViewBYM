"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Tab = "buy" | "rent" | "new" | "sold";

const TABS: { id: Tab; label: string }[] = [
  { id: "buy",  label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "new",  label: "New homes" },
  { id: "sold", label: "Sold prices" },
];

const SALE_PRICES = [
  { label: "Any price", value: "" },
  { label: "Up to £200,000", value: "200000" },
  { label: "Up to £350,000", value: "350000" },
  { label: "Up to £500,000", value: "500000" },
  { label: "Up to £750,000", value: "750000" },
  { label: "Up to £1,000,000", value: "1000000" },
  { label: "£1m+", value: "1000001" },
];

const RENT_PRICES = [
  { label: "Any price", value: "" },
  { label: "Up to £500 pcm", value: "500" },
  { label: "Up to £800 pcm", value: "800" },
  { label: "Up to £1,200 pcm", value: "1200" },
  { label: "Up to £2,000 pcm", value: "2000" },
  { label: "£2,000+ pcm", value: "2001" },
];

const FOOTER_LINKS: Record<Tab, Array<{ href: string; label: string }>> = {
  buy: [
    { href: "/browse?listing_type=sale", label: "Latest listings" },
    { href: "/account/alerts", label: "Set an alert" },
    { href: "/guides", label: "Buyer guides" },
  ],
  rent: [
    { href: "/browse?listing_type=rent", label: "Latest rentals" },
    { href: "/account/alerts", label: "Set a rental alert" },
    { href: "/guides", label: "Renter guides" },
  ],
  new: [
    { href: "/browse?type=new", label: "New homes near me" },
    { href: "/account/alerts", label: "Set an alert" },
    { href: "/guides", label: "New homes guides" },
  ],
  sold: [
    { href: "/sold-prices", label: "Search sold prices" },
    { href: "/guides", label: "Valuation guides" },
    { href: "/contact", label: "Get a valuation" },
  ],
};

const CHEVRON_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<Tab>("buy");
  const router = useRouter();

  const handleTabClick = (tab: Tab) => {
    if (tab === "sold") {
      router.push("/sold-prices");
      return;
    }
    setActiveTab(tab);
  };

  const prices = activeTab === "rent" ? RENT_PRICES : SALE_PRICES;
  const footerLinks = FOOTER_LINKS[activeTab];

  return (
    <div className="max-w-[700px] overflow-hidden rounded-2xl bg-white shadow-2xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 border-b-2 px-4 py-3 text-[13.5px] font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-blue-700 bg-white text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form
        action={activeTab === "sold" ? "/sold-prices" : "/browse"}
        method="GET"
        className="flex items-stretch border-b border-gray-200"
      >
        {/* Hidden params */}
        {activeTab === "buy"  && <input type="hidden" name="listing_type" value="sale" />}
        {activeTab === "rent" && <input type="hidden" name="listing_type" value="rent" />}
        {activeTab === "new"  && <input type="hidden" name="listing_type" value="sale" />}
        {activeTab === "new"  && <input type="hidden" name="type" value="new" />}

        {/* Location */}
        <div className="relative flex-1 border-r border-gray-200">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            name="location"
            placeholder={
              activeTab === "sold"
                ? "Enter street, postcode or area…"
                : "City, postcode or area…"
            }
            className="h-[52px] w-full border-none bg-transparent pl-10 pr-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        {/* Price */}
        <select
          name="price_max"
          className="hidden h-[52px] border-r border-gray-200 bg-transparent px-3.5 pr-9 text-[14px] font-medium text-gray-800 outline-none md:block"
          style={{
            backgroundImage: CHEVRON_SVG,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            appearance: "none",
          }}
        >
          {prices.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Beds (hidden on sold-prices tab) */}
        {activeTab !== "sold" && (
          <select
            name="beds"
            className="hidden h-[52px] border-r border-gray-200 bg-transparent px-3.5 pr-9 text-[14px] font-medium text-gray-800 outline-none md:block"
            style={{
              backgroundImage: CHEVRON_SVG,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              appearance: "none",
            }}
          >
            <option value="">Any beds</option>
            <option value="1">1+ bed</option>
            <option value="2">2+ beds</option>
            <option value="3">3+ beds</option>
            <option value="4">4+ beds</option>
          </select>
        )}

        <button
          type="submit"
          className="whitespace-nowrap bg-blue-700 px-6 text-[15px] font-bold text-white transition-colors hover:bg-blue-800"
        >
          Search
        </button>
      </form>

      {/* Footer row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-4 py-2.5">
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[12.5px] font-medium text-gray-500 transition-colors hover:text-blue-700"
            >
              {l.label}
            </Link>
          ))}
        </div>
        {activeTab !== "sold" && (
          <Link
            href={`/browse?vr=1${activeTab === "rent" ? "&listing_type=rent" : activeTab === "new" ? "&listing_type=sale&type=new" : "&listing_type=sale"}`}
            className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12.5px] font-semibold text-blue-700 transition-colors hover:bg-blue-700 hover:text-white"
          >
            ◉ VR listings only
          </Link>
        )}
      </div>
    </div>
  );
}
