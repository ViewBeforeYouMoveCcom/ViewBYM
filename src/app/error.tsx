"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative isolate overflow-hidden bg-[#08111F] px-5 py-20 text-white sm:py-28">
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[#2DD4BF]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-[#F59E0B]/20 blur-3xl" />

      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 text-5xl shadow-2xl shadow-black/20 backdrop-blur">
          !
        </div>

        <p className="mb-3 text-[12px] font-bold uppercase tracking-[.24em] text-cyan-200">
          Something went wrong
        </p>
        <h1 className="text-[clamp(30px,5vw,56px)] font-black leading-[0.95] tracking-tight">
          This wasn&apos;t something you did.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-7 text-white/70">
          You haven&apos;t lost your place or left the site — a page just had trouble loading. Try again, or head back to the homepage and give it another go in a moment.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="rounded-full bg-white px-7 py-3 text-[14px] font-bold text-[#08111F] transition-transform hover:-translate-y-0.5 hover:bg-cyan-50"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-7 py-3 text-[14px] font-bold text-white/90 transition-transform hover:-translate-y-0.5 hover:bg-white/10"
          >
            Go to home page
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-7 py-3 text-[14px] font-bold text-white/90 transition-transform hover:-translate-y-0.5 hover:bg-white/10"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
