"use client";

import clsx from "clsx";
import { BRANDS, BUDGETS, CONDITIONS, RAM_OPTIONS } from "@/lib/shop-filters";
import { useQueryUpdater } from "@/components/shop/useQueryUpdater";

const toList = (v: string | null) => (v ?? "").split(",").filter(Boolean);

function Option({
  type,
  label,
  checked,
  onChange,
}: {
  type: "checkbox" | "radio";
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-paper">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-brand"
      />
      <span className={clsx(checked ? "font-semibold text-ink" : "text-ink/70")}>{label}</span>
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">{title}</h3>
      {children}
    </section>
  );
}

export default function FilterPanel() {
  const { sp, pending, update, toggle } = useQueryUpdater();

  const brands = toList(sp.get("brand")).map((b) => b.toLowerCase());
  const conditions = toList(sp.get("condition"));
  const ram = toList(sp.get("ram"));
  const max = sp.get("max");
  const wholesale = sp.get("wholesale") === "1";
  const hasFilters = ["q", "brand", "condition", "ram", "max", "wholesale"].some((k) => sp.get(k));

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          Filters {pending && <span className="ml-1 text-xs font-normal text-brand">Updating…</span>}
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              update({ q: null, brand: null, condition: null, ram: null, max: null, wholesale: null })
            }
            className="text-xs font-semibold text-brand transition hover:text-brand-deep"
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Brand">
        {BRANDS.map((b) => (
          <Option
            key={b}
            type="checkbox"
            label={b}
            checked={brands.includes(b.toLowerCase())}
            onChange={() => toggle("brand", b)}
          />
        ))}
      </Group>

      <Group title="Condition">
        {CONDITIONS.map((c) => (
          <Option
            key={c.value}
            type="checkbox"
            label={c.label}
            checked={conditions.includes(c.value)}
            onChange={() => toggle("condition", c.value)}
          />
        ))}
      </Group>

      <Group title="Budget">
        <Option type="radio" label="Any budget" checked={!max} onChange={() => update({ max: null })} />
        {BUDGETS.map((b) => (
          <Option
            key={b.value}
            type="radio"
            label={b.label}
            checked={max === b.value}
            onChange={() => update({ max: b.value })}
          />
        ))}
      </Group>

      <Group title="Memory (RAM)">
        {RAM_OPTIONS.map((r) => (
          <Option
            key={r}
            type="checkbox"
            label={`${r}GB RAM`}
            checked={ram.includes(String(r))}
            onChange={() => toggle("ram", String(r))}
          />
        ))}
      </Group>

      <Group title="Buying type">
        <Option
          type="checkbox"
          label="Wholesale price available"
          checked={wholesale}
          onChange={() => update({ wholesale: wholesale ? null : "1" })}
        />
      </Group>
    </div>
  );
}