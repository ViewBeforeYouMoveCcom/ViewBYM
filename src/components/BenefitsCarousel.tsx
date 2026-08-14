"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    title: "Clean, simple listings",
    description:
      "No banner ads, no noise. Just photos, floor plans, and the details that actually matter to a buyer.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    title: "VR on any device",
    description:
      "Full VR on a headset, 360° on desktop, guided walkthrough on mobile. Nothing locked behind hardware.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="10" rx="3" />
        <circle cx="8.5" cy="12" r="2.5" strokeWidth="1.5" />
        <circle cx="15.5" cy="12" r="2.5" strokeWidth="1.5" />
        <path d="M1 10v4" /><path d="M23 10v4" />
      </svg>
    ),
  },
  {
    title: "Detailed floor plans",
    description:
      "Review the property layout and room dimensions alongside the immersive tour.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M3 21h8V11h10" /><path d="M11 11V7h10v14" />
        <circle cx="7" cy="16" r="1.2" fill="white" stroke="none" />
        <circle cx="16" cy="14" r="1.2" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Instant price alerts",
    description:
      "Get notified the moment a match is listed or a saved property drops in price.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9z" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
        <circle cx="18" cy="4" r="3" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Contact on your terms",
    description:
      "Agents only hear from you when you choose to reach out. No unsolicited follow-up calls.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        <path d="M8 9.5h8M8 12.5h5" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Your data stays yours",
    description:
      "We never sell your browsing history or VR viewing data to agents or advertisers.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="white" stroke="none" />
        <path d="M12 17.5V19" />
      </svg>
    ),
  },
];

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    function update() {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function BenefitsCarousel() {
  const [active, setActive] = useState(0);
  const visible = useVisibleCount();
  const total = benefits.length;
  const maxSlide = Math.max(total - visible, 0);

  // Reset active if it exceeds maxSlide after resize
  useEffect(() => {
    if (active > maxSlide) setActive(maxSlide);
  }, [active, maxSlide]);

  const next = useCallback(() => {
    setActive((prev) => (prev >= maxSlide ? 0 : prev + 1));
  }, [maxSlide]);

  // Auto-advance every 2 seconds
  useEffect(() => {
    const timer = setInterval(next, 2000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden">
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * (100 / visible)}%)` }}
      >
        {benefits.map((b, i) => (
          <div
            key={i}
            className={`flex-shrink-0 px-2 ${visible === 1 ? 'w-full' : visible === 2 ? 'w-1/2' : 'w-1/3'}`}
          >
            <Card
              className="h-full rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#08519A]">
                  {b.icon}
                </div>
                <p className="mb-1.5 text-[15px] font-bold text-gray-900">
                  {b.title}
                </p>
                <p className="text-[13.5px] leading-relaxed text-gray-500">
                  {b.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i
                ? "w-6 bg-[#08519A]"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
