"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/product-utils";

export default function CategoryTabs({ products }: { products: Product[] }) {
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
  const tabs = ["All", ...brands];
  const [active, setActive] = useState("All");

  const visible = (active === "All" ? products : products.filter((p) => p.brand === active)).slice(0, 8);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter laptops by brand"
        className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={clsx(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
              active === tab
                ? "bg-brand text-white shadow-lg shadow-brand/30"
                : "bg-white text-ink/70 ring-1 ring-line hover:text-brand hover:ring-brand/40"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div key={active} className="mt-8 grid animate-fade-in gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-ink/60">Laptops are being added. Please check back shortly.</p>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/laptops"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand hover:shadow-xl hover:shadow-brand/30"
        >
          View All Laptops
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}