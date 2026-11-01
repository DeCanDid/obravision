"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Laptop, Loader2, Search, Trash2 } from "lucide-react";
import { formatNaira } from "@/lib/product-utils";
import { deleteProduct } from "@/app/admin/actions";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  retail_price: number;
  stock: number;
  image: string | null;
};

export default function ProductList({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [items, setItems] = useState(products);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Keep the list in sync after the page refreshes (for example after adding a laptop)
  useEffect(() => setItems(products), [products]);

  const q = query.trim().toLowerCase();
  const visible = q
    ? items.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    : items;

  async function remove(id: string) {
    setBusyId(id);
    setError(null);
    setNotice(null);

    const result = await deleteProduct(id);
    setBusyId(null);
    setConfirmId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
    setNotice("The laptop was deleted from the store.");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Your laptops ({items.length})</h2>
          <p className="mt-1 text-sm text-ink/60">Delete a laptop when it is no longer in store. This cannot be undone.</p>
        </div>
        {items.length > 5 && (
          <div className="relative w-full sm:w-64">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your laptops"
              aria-label="Search your laptops"
              className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink/60">
          {items.length === 0 ? "You have no laptops in the store yet." : "No laptops match your search."}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-line">
          {visible.map((p) => {
            const confirming = confirmId === p.id;
            const busy = busyId === p.id;

            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 py-4">
                <div className="relative grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-paper">
                  <Laptop size={24} className="text-line" />
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </div>

                <div className="min-w-0 flex-1 basis-48">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{p.name}</p>
                  <p className="mt-1 text-xs text-ink/55">
                    {p.brand} &middot; from {formatNaira(Number(p.retail_price))} &middot;{" "}
                    {p.stock > 0 ? `${p.stock} in stock` : <span className="font-semibold text-red-600">Out of stock</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {confirming ? (
                    <>
                      <span className="hidden text-xs font-semibold text-red-600 sm:inline">Delete for good?</span>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {busy && <Loader2 size={14} className="animate-spin" />}
                        Yes, delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        disabled={busy}
                        className="rounded-lg border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/laptops/${p.slug}`}
                        target="_blank"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmId(p.id);
                          setNotice(null);
                        }}
                        aria-label={`Delete ${p.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}