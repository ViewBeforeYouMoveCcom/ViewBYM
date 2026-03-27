"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AgentBenefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const agentBenefits: AgentBenefit[] = [
  {
    title: "Reduce wasted viewings",
    description:
      "Buyers confirm layout and flow before booking in-person, so every viewing is already qualified.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3v18h18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 14l4-4 3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 7h3v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="17" r="3.5" stroke="white" strokeWidth="1.5"/>
        <path d="M15.5 17l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Premium presentation",
    description:
      "A consistent, calm listing experience that reflects your brand — not a generic portal page.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    title: "Faster shortlisting",
    description:
      "Serious buyers shortlist with confidence and clarity, cutting the time from listing to offer.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 3.5l2 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7.5 3.5l-2 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19.5 6l1-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4.5 6l-1-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Control distribution",
    description:
      "Full tours live on VBYM. Share links across channels without losing quality or presentation control.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" fill="white" fillOpacity="0.1"/>
        <circle cx="5" cy="5" r="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="19" cy="5" r="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="5" cy="19" r="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="19" cy="19" r="2" stroke="white" strokeWidth="1.5"/>
        <path d="M9.5 10l-3-3M14.5 10l3-3M9.5 14l-3 3M14.5 14l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Cleaner leads",
    description:
      "Encourage enquiries only after VR engagement — so every lead has genuine intent behind it.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
        <path d="M17 11l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Ready to scale",
    description:
      "A portal-grade foundation designed to grow across branches and regions without extra friction.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17l4-4 3 3 4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 16V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 11l3-3 3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 21h18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
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

export default function AgentBenefitsCarousel() {
  const [active, setActive] = useState(0);
  const visible = useVisibleCount();
  const total = agentBenefits.length;
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
        {agentBenefits.map((b, i) => (
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
