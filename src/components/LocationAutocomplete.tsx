"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEventHandler } from "react";
import { createPortal } from "react-dom";

type Suggestion = {
  label: string;
  type: "Town" | "Postcode" | "Area" | "County" | "District" | "Region";
};

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function LocationAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  onKeyDown,
  placeholder = "Town, postcode or area",
  required = false,
  autoFocus = false,
  className,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const visibleSuggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (query.length < 1) return [];
    return suggestions.filter((item) => item.label.toLowerCase().includes(query));
  }, [suggestions, value]);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 1) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/location-suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const json = (await res.json()) as { suggestions?: Suggestion[] };
        setSuggestions(json.suggestions ?? []);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      }
    }, 160);

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

      setDropdownRect({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
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
      if (
        !rootRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(label: string) {
    onChange(label);
    onSelect?.(label);
    setOpen(false);
    setActiveIndex(-1);
  }

  const inputClass =
    className ??
    "h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const dropdown =
    open && visibleSuggestions.length > 0 ? (
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
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.label}`}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(suggestion.label)}
            className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm ${
              index === activeIndex
                ? "bg-blue-50 text-gray-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="truncate">{suggestion.label}</span>
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {suggestion.type}
            </span>
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
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) =>
              Math.min(index + 1, visibleSuggestions.length - 1)
            );
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
            return;
          }

          if (event.key === "Enter" && activeIndex >= 0 && visibleSuggestions[activeIndex]) {
            event.preventDefault();
            choose(visibleSuggestions[activeIndex].label);
            return;
          }

          if (event.key === "Escape") {
            setOpen(false);
            return;
          }

          onKeyDown?.(event);
        }}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        className={inputClass}
      />

      {typeof document !== "undefined" && dropdown
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
}
