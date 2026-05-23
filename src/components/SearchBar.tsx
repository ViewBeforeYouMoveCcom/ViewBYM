"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          id="search-location"
          placeholder="Search by location, postcode, or area"
          aria-label="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Button
        className="h-11 rounded-[10px] bg-[#08519A] px-5 text-sm font-semibold text-white hover:bg-[#063d75]"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
}
