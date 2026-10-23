"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatNaira } from "@/lib/product-utils";
import { CONDITIONS, SORTS } from "@/lib/shop-filters";
import { useQueryUpdater } from "@/components/shop/useQueryUpdater";
import FilterPanel from "@/components/shop/FilterPanel";

const toList = (v: string | null) => (v ?? "").split(",").filter(Boolean);

export default function ShopControls({
  total,
  from,
  to,
}: {
  total: number;
  from: number;
  to: number;
}) {
  const { sp, update, toggle } = useQueryUpdater();
  const [open, setOpen] = useState(false);

  const q = sp.get("q") ?? "";
  const sort = sp.get("sort") ?? "featured";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Active filter chips
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (q) chips.push({ key: "q", label: `“${q}”`, remove: () => update({ q: null }) });
  toList(sp.get("brand")).forEach((b) =>
    chips.push({ key: `b-${b}`, label: b, remove: () => toggle("brand", b) })
  );
  toList(sp.get("condition")).forEach((c) =>
    chips.push({
      key: `c-${c}`,
      label: CONDITIONS.find((x) => x.value === c)?.label ?? c,
      remove: () => toggle("condition", c),
    })
  );
  if (sp.get("max"))
    chips.push({
      key: "max",
      label: `Under ${formatNaira(Number(sp.get("max")))}`,
      remove: () => update({ max: null }),
    });
  toList(sp.get("ram")).forEach((r) =>
    chips.push({ key: `r-${r}`, label: `${r}GB RAM`, remove: () => toggle("ram", r) })
  );
  if (sp.get("wholesale") === "1")
    chips.push({ key: "w", label: "Wholesale available", remove: () => update({ wholesale: null }) });

  return (
    <div>
      {/* Search */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
          update({ q: value || null });
        }}
        className="relative"
      >
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          key={q}
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search by brand, model or processor, e.g. HP i7"
          aria-label="Search laptops"
          className="h-13 w-full rounded-2xl border border-line bg-white py-3.5 pl-11 pr-28 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
        >
          Search
        </button>
      </form>

      {/* Count, filter button, sort */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-brand hover:text-brand lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters{chips.length > 0 && ` (${chips.length})`}
          </button>
          <p className="text-sm text-ink/60" aria-live="polite">
            {total === 0 ? "No laptops found" : `Showing ${from}–${to} of ${total} laptops`}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink/60">Sort by</span>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
            className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none transition focus:border-brand"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Active filters */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.remove}
              className="group inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              {chip.label}
              <X size={13} />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile filter drawer */}
      <div
        className={clsx("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}
        inert={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={clsx(
            "absolute inset-0 bg-ink/50 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={clsx(
            "absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-paper transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-line bg-white px-4 py-4">
            <p className="font-display text-lg font-semibold">Filter laptops</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid h-10 w-10 place-items-center rounded-full bg-paper"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterPanel />
          </div>
          <div className="border-t border-line bg-white p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
            >
              Show {total} {total === 1 ? "laptop" : "laptops"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}