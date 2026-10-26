"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, Info, Loader2, ShoppingCart } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import QtyStepper from "@/components/QtyStepper";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { site, whatsappLink } from "@/lib/site";
import {
  type Product,
  findVariant,
  formatNaira,
  isWholesaleQty,
  productSpecLine,
  unitPrice,
  variantLabel,
} from "@/lib/product-utils";

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { addItem } = useCart();

  const variants = product.variants ?? [];
  const hasConfigs = variants.length > 0;
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const selected = hasConfigs ? findVariant(product, variantId) : null;

  const wholesalePrice = selected ? selected.wholesale_price : product.wholesale_price;
  const hasWholesale = wholesalePrice !== null;
  const minWholesale = product.wholesale_min_qty ?? 5;
  const stock = selected ? selected.stock : product.stock;
  const inStock = stock > 0;

  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const wholesale = isWholesaleQty(product, qty, selected);
  const unit = unitPrice(product, qty, selected);
  const total = unit * qty;

  function changeQty(n: number) {
    setQty(n);
    setStatus("idle");
  }

  function chooseVariant(id: string) {
    setVariantId(id);
    setStatus("idle");
  }

  async function handleAdd() {
    if (!user) {
      router.push(`/account?next=${encodeURIComponent(pathname)}&reason=cart`);
      return;
    }
    setStatus("adding");
    setError(null);
    const result = await addItem(product, qty, selected?.id ?? "");
    if (result.ok) {
      setStatus("added");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }

  const specs = productSpecLine(product, selected);
  const message = [
    "Hello Obravision, I'm interested in this laptop:",
    "",
    product.name,
    ...(selected ? [`Configuration: ${variantLabel(selected)}`] : []),
    ...(specs ? [specs] : []),
    `Buying type: ${wholesale ? "Wholesale" : "Retail"}`,
    `Quantity: ${qty}`,
    `Price per unit: ${formatNaira(unit)}`,
    `Total: ${formatNaira(total)}`,
    `Link: ${site.url}/laptops/${product.slug}`,
  ].join("\n");

  return (
    <div>
      {hasConfigs && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-bold text-ink">Choose configuration</p>
          <div role="radiogroup" aria-label="Laptop configuration" className="grid gap-3 sm:grid-cols-2">
            {variants.map((v) => {
              const active = v.id === variantId;
              return (
                <label
                  key={v.id}
                  className={clsx(
                    "cursor-pointer rounded-xl border-2 p-4 transition",
                    active ? "border-brand bg-brand/5 shadow-md shadow-brand/10" : "border-line hover:border-brand/40",
                    v.stock <= 0 && "opacity-60"
                  )}
                >
                  <input
                    type="radio"
                    name="configuration"
                    value={v.id}
                    checked={active}
                    onChange={() => chooseVariant(v.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-bold">{variantLabel(v)}</span>
                  <span className="mt-1 block text-lg font-bold text-brand">{formatNaira(v.retail_price)}</span>
                  <span className="mt-0.5 block text-xs text-ink/55">
                    {v.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">
          {wholesale ? "Wholesale price per unit" : "Price per unit"}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <p key={`${variantId}-${unit}`} className="animate-fade-in text-4xl font-bold">
            {formatNaira(unit)}
          </p>
          {qty > 1 && (
            <p className="text-sm text-white/70">
              Total for {qty}: <span className="font-bold text-gold">{formatNaira(total)}</span>
            </p>
          )}
        </div>
      </div>

      {hasWholesale && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold text-ink">Buying type</p>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-paper p-1">
            {(["retail", "wholesale"] as const).map((m) => {
              const active = (m === "wholesale") === wholesale;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => changeQty(m === "wholesale" ? minWholesale : 1)}
                  aria-pressed={active}
                  className={clsx(
                    "rounded-lg py-2.5 text-sm font-semibold transition-all duration-300",
                    active ? "bg-white text-brand shadow" : "text-ink/60 hover:text-ink"
                  )}
                >
                  {m === "retail" ? "Retail (1 unit)" : `Wholesale (${minWholesale}+ units)`}
                </button>
              );
            })}
          </div>
          {!wholesale && (
            <p className="mt-2 text-xs text-brand">
              Order {minWholesale} or more to unlock the wholesale price of {formatNaira(wholesalePrice!)} per unit.
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-ink">Quantity</p>
        <QtyStepper value={qty} onChange={changeQty} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1faa59] py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#178a47] hover:shadow-lg hover:shadow-[#1faa59]/30"
        >
          <WhatsAppIcon size={18} />
          WhatsApp Inquiry
        </a>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock || status === "adding"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "adding" ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
          {!inStock ? "Out of Stock" : status === "adding" ? "Adding…" : "Add To Cart"}
        </button>
      </div>

      {status === "added" && (
        <div role="status" className="mt-4 flex animate-fade-in flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="flex items-center gap-2 font-semibold">
            <Check size={18} /> Added to your cart
          </span>
          <Link href="/cart" className="font-bold underline underline-offset-4 hover:text-emerald-950">
            View cart
          </Link>
        </div>
      )}
      {status === "error" && error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!user && inStock && (
        <p className="mt-3 text-xs leading-relaxed text-ink/55">
          Create a free account to save your cart. You can also message us on WhatsApp without signing up.
        </p>
      )}

      <div className="mt-5 flex gap-3 rounded-xl bg-brand/5 p-4 text-sm leading-relaxed text-ink/75">
        <Info size={18} className="mt-0.5 shrink-0 text-brand" />
        <p>
          {hasWholesale
            ? `Wholesale pricing applies automatically when you order ${minWholesale} or more units of this laptop. For larger orders, message us on WhatsApp for the best quote.`
            : "Retail pricing applies to this laptop. Message us on WhatsApp if you need several units."}
        </p>
      </div>
    </div>
  );
}