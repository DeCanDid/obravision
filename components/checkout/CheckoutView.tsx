"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShoppingBag, Store, Truck } from "lucide-react";
import { fullAddress } from "@/lib/site";
import { formatNaira, isWholesaleQty, unitPrice } from "@/lib/product-utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import StateCard from "@/components/ui/StateCard";

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function CheckoutView() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading, subtotal, clear } = useCart();

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = nameInput ?? ((user?.user_metadata?.full_name as string | undefined) ?? "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, deliveryMethod: delivery, address, notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "We could not place your order. Please try again.");

      setPlaced(true);
      await clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not place your order. Please try again.");
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <StateCard
        icon={<CheckCircle2 size={30} />}
        title="Order placed"
        text="Taking you to your order confirmation…"
      />
    );
  }

  if (authLoading || (user && loading)) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <StateCard
        icon={<Lock size={28} />}
        title="Sign in to check out"
        text="Sign in or create a free account so we can save your order and your cart."
      >
        <Link
          href="/account?next=/checkout&reason=cart"
          className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          Sign in or create account
        </Link>
      </StateCard>
    );
  }

  if (items.length === 0) {
    return (
      <StateCard
        icon={<ShoppingBag size={28} />}
        title="Your cart is empty"
        text="Add a laptop to your cart before checking out."
      >
        <Link
          href="/laptops"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          Browse laptops <ArrowRight size={16} />
        </Link>
      </StateCard>
    );
  }

  const units = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="space-y-6">
        {/* Contact details */}
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">1. Your details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setNameInput(e.target.value)}
                autoComplete="name"
                placeholder="Your full name"
                className={`${field} h-12`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Phone / WhatsApp number</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="0803 000 0000"
                className={`${field} h-12`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold">Email address</span>
              <input
                readOnly
                value={user.email ?? ""}
                className={`${field} h-12 bg-paper text-ink/60`}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-ink/55">We will reach you on this number to confirm your order and payment.</p>
        </section>

        {/* Delivery */}
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">2. Pick-up or delivery</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { value: "pickup", icon: Store, title: "Pick up in store", text: fullAddress },
              { value: "delivery", icon: Truck, title: "Deliver to me", text: "We confirm the delivery cost with you on WhatsApp." },
            ].map(({ value, icon: Icon, title, text }) => {
              const active = delivery === value;
              return (
                <label
                  key={value}
                  className={clsx(
                    "flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition",
                    active ? "border-brand bg-brand/5" : "border-line hover:border-brand/40"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={value}
                    checked={active}
                    onChange={() => setDelivery(value as "pickup" | "delivery")}
                    className="sr-only"
                  />
                  <Icon size={20} className={active ? "text-brand" : "text-ink/50"} />
                  <span>
                    <span className="block text-sm font-bold">{title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink/60">{text}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {delivery === "delivery" && (
            <label className="mt-4 block animate-fade-in">
              <span className="mb-1.5 block text-sm font-semibold">Delivery address</span>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House number, street, area, city and state"
                className={`${field} py-3`}
              />
            </label>
          )}

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold">
              Order notes <span className="font-normal text-ink/50">(optional)</span>
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Anything we should know about your order?"
              className={`${field} py-3`}
            />
          </label>
        </section>
      </div>

      {/* Summary */}
      <aside className="rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-32">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>

        <ul className="mt-5 divide-y divide-line">
                  {items.map(({ id, quantity, product: p }) => {
                      const unit = unitPrice(p, quantity);
                      return (
                          <li key={id} className="flex justify-between gap-4 py-3 text-sm">
                              <div className="min-w-0">
                                  <p className="line-clamp-2 font-semibold">{p.name}</p>
                                  <p className="mt-0.5 text-xs text-ink/60">
                                      {quantity} × {formatNaira(unit)}
                                      {isWholesaleQty(p, quantity) && <span className="ml-1.5 font-semibold text-gold-deep">Wholesale</span>}
                                  </p>
                              </div>
                              <p className="shrink-0 font-bold">{formatNaira(unit * quantity)}</p>
                          </li>
                      );  
          })}
        </ul>

        <dl className="mt-3 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Total units</dt>
            <dd className="font-semibold">{units}</dd>
          </div>
          <div className="flex justify-between text-base">
            <dt className="font-bold">Subtotal</dt>
            <dd className="text-xl font-bold">{formatNaira(subtotal)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-ink/55">
          You will not be charged online. After you place your order we notify the shop, and you can pay and
          send your receipt on WhatsApp.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
          {busy ? "Placing your order…" : "Place order"}
        </button>
        <Link href="/cart" className="mt-4 block text-center text-sm font-semibold text-ink/60 transition hover:text-brand">
          Back to cart
        </Link>
      </aside>
    </form>
  );
}