"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

const clamp = (n: number) => Math.max(1, Math.min(999, n));

export default function QtyStepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  size?: "sm" | "md";
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const h = size === "sm" ? "h-10" : "h-12";
  const w = size === "sm" ? "w-10" : "w-12";

  return (
    <div className="inline-flex items-center rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={`grid ${h} ${w} place-items-center text-ink/70 transition hover:text-brand disabled:opacity-30`}
      >
        <Minus size={16} />
      </button>
      <input
        inputMode="numeric"
        value={draft}
        aria-label="Quantity"
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
          setDraft(raw);
          const n = parseInt(raw, 10);
          if (Number.isFinite(n) && n >= 1) onChange(clamp(n));
        }}
        onBlur={() => setDraft(String(value))}
        className={`${h} w-14 border-x border-line text-center text-sm font-semibold outline-none`}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= 999}
        aria-label="Increase quantity"
        className={`grid ${h} ${w} place-items-center text-ink/70 transition hover:text-brand disabled:opacity-30`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}