"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface AddressResult {
  line1: string;
  city: string;
  postcode: string;
}

interface Suggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (raw: string) => void;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export default function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address…",
  required = false,
  className,
  autoFocus = false,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [dropdownRect, setDropdownRect] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const json = await res.json() as { suggestions?: Suggestion[] };
        setSuggestions(json.suggestions ?? []);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownRect({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, value]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  async function choose(suggestion: Suggestion) {
    onChange(suggestion.description);
    setOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/address-details?place_id=${encodeURIComponent(suggestion.place_id)}`);
      const result = await res.json() as AddressResult;
      onSelect({
        line1: result.line1 || suggestion.description,
        city: result.city,
        postcode: result.postcode,
      });
    } catch {
      onSelect({ line1: suggestion.description, city: "", postcode: "" });
    }
  }

  const inputClass =
    className ??
    "h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const dropdown =
    open && suggestions.length > 0 ? (
      <div
        ref={dropdownRef}
        id={listId}
        role="listbox"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        style={{
          position: "fixed",
          top: dropdownRect.top,
          left: dropdownRect.left,
          width: dropdownRect.width,
          maxHeight: "280px",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        {suggestions.map((s, index) => (
          <button
            key={s.place_id}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(s)}
            className={`flex w-full flex-col px-4 py-3 text-left text-sm ${
              index === activeIndex ? "bg-blue-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="truncate font-medium">{s.main_text}</span>
            {s.secondary_text && (
              <span className="truncate text-xs text-gray-400">{s.secondary_text}</span>
            )}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        autoFocus={autoFocus}
        required={required}
        autoComplete="off"
        placeholder={loading ? "Searching…" : placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        className={inputClass}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
            e.preventDefault();
            void choose(suggestions[activeIndex]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {typeof document !== "undefined" && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
