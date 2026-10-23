"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { site } from "@/lib/site";

const budgets = [
  { label: "Any budget", value: "" },
  { label: "Under ₦400,000", value: "400000" },
  { label: "Under ₦700,000", value: "700000" },
  { label: "Under ₦1,000,000", value: "1000000" },
  { label: "Under ₦1,500,000", value: "1500000" },
];

const conditions = [
  { label: "Any condition", value: "" },
  { label: "Brand New", value: "new" },
  { label: "Refurbished", value: "refurbished" },
  { label: "UK Used", value: "uk-used" },
];

const popular = ["HP EliteBook", "MacBook Air", "Dell Latitude", "Surface Laptop", "Core i7"];

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function FindLaptop() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [max, setMax] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (brand) params.set("brand", brand);
    if (condition) params.set("condition", condition);
    if (max) params.set("max", max);
    const qs = params.toString();
    router.push(`/laptops${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-2xl shadow-ink/10 sm:p-7">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
          Find your next laptop
        </h2>
        <p className="text-sm text-ink/60">Search by name, then narrow it down by brand, condition or budget.</p>
      </div>

      <form onSubmit={onSubmit} role="search" className="grid gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search HP, Dell, MacBook, i7…"
            aria-label="Search laptops"
            className={`${field} pl-10`}
          />
        </div>

        <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand" className={`${field} lg:col-span-2`}>
          <option value="">All brands</option>
          {site.brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select value={condition} onChange={(e) => setCondition(e.target.value)} aria-label="Condition" className={`${field} lg:col-span-2`}>
          {conditions.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select value={max} onChange={(e) => setMax(e.target.value)} aria-label="Budget" className={`${field} lg:col-span-2`}>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="h-12 rounded-xl bg-gold px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-lg hover:shadow-gold/30 lg:col-span-2"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-ink/50">Popular:</span>
        {popular.map((term) => (
          <Link
            key={term}
            href={`/laptops?q=${encodeURIComponent(term)}`}
            className="rounded-full bg-paper px-3 py-1.5 font-medium text-ink/70 transition hover:bg-brand hover:text-white"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}