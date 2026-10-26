"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Laptop, ShoppingBag, Trash2 } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { formatNaira, isWholesaleQty, unitPrice, variantLabel } from "@/lib/product-utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import QtyStepper from "@/components/QtyStepper";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

function Message({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">{icon}</div>
      <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function CartView() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, subtotal, setQuantity, removeItem } = useCart();

  if (authLoading || (user && loading)) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <Message
        icon={<ShoppingBag size={28} />}
        title="Sign in to see your cart"
        text="Your cart is saved to your account, so you can pick up where you left off on any device."
      >
        <Link
          href="/account?next=/cart&reason=cart"
          className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          Sign in or create account
        </Link>
      </Message>
    );
  }

  if (items.length === 0) {
    return (
      <Message
        icon={<ShoppingBag size={28} />}
        title="Your cart is empty"
        text="Browse our laptops and add the ones you like. They will be saved here for you."
      >
        <Link
          href="/laptops"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          Browse laptops <ArrowRight size={16} />
        </Link>
      </Message>
    );
  }

  const units = items.reduce((s, i) => s + i.quantity, 0);
  const savings = items.reduce((s, i) => {
    const retail = i.variant ? i.variant.retail_price : i.product.retail_price;
    return s + (retail - unitPrice(i.product, i.quantity, i.variant)) * i.quantity;
  }, 0);

  const waMessage = [
    "Hello Obravision, I would like to order these laptops:",
    "",
    ...items.map((i) => {
      const unit = unitPrice(i.product, i.quantity, i.variant);
      const name = i.variant ? `${i.product.name} (${variantLabel(i.variant)})` : i.product.name;
      return `• ${name} x ${i.quantity} @ ${formatNaira(unit)} = ${formatNaira(unit * i.quantity)}`;
    }),
    "",
    `Total: ${formatNaira(subtotal)}`,
  ].join("\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <ul className="space-y-4">
        {items.map(({ id, quantity, product: p, variant }) => {
          const unit = unitPrice(p, quantity, variant);
          const wholesale = isWholesaleQty(p, quantity, variant);
          const wholesalePrice = variant ? variant.wholesale_price : p.wholesale_price;
          const min = p.wholesale_min_qty ?? 5;
          const image = p.images[0];
          const variantKey = variant?.id ?? "";

          return (
            <li key={id} className="flex gap-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
              <Link
                href={`/laptops/${p.slug}`}
                className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-paper sm:h-28 sm:w-36"
              >
                <Laptop size={36} className="absolute inset-0 m-auto text-line" />
                {image && <Image src={image} alt="" fill sizes="144px" className="object-cover" />}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">{p.brand}</p>
                <Link
                  href={`/laptops/${p.slug}`}
                  className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug transition hover:text-brand sm:text-base"
                >
                  {p.name}
                </Link>
                {variant && (
                  <p className="mt-1 inline-flex w-fit rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-ink/70">
                    {variantLabel(variant)}
                  </p>
                )}

                <p className="mt-1.5 text-sm text-ink/70">
                  {formatNaira(unit)} each
                  {wholesale && (
                    <span className="ml-2 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold-deep">
                      Wholesale price
                    </span>
                  )}
                </p>
                {!wholesale && wholesalePrice !== null && (
                  <p className="mt-1 text-xs text-brand">
                    Add {min - quantity} more to get the wholesale price of {formatNaira(wholesalePrice)} each
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <QtyStepper size="sm" value={quantity} onChange={(n) => setQuantity(p.id, variantKey, n)} />
                  <p className="text-base font-bold sm:text-lg">{formatNaira(unit * quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(p.id, variantKey)}
                    aria-label={`Remove ${p.name} from cart`}
                    className="grid h-10 w-10 place-items-center rounded-xl text-ink/50 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-32">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Laptops</dt>
            <dd className="font-semibold">{items.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Total units</dt>
            <dd className="font-semibold">{units}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-emerald-700">
              <dt>Wholesale savings</dt>
              <dd className="font-semibold">-{formatNaira(savings)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-4 text-base">
            <dt className="font-bold">Subtotal</dt>
            <dd className="text-xl font-bold">{formatNaira(subtotal)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-ink/55">
          Prices are in naira. After you place your order, we confirm availability and arrange payment
          and delivery with you on WhatsApp.
        </p>

        <Link
          href="/checkout"
          className="group mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30"
        >
          Proceed to checkout
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#1faa59] py-3.5 text-sm font-bold text-[#1faa59] transition hover:bg-[#1faa59] hover:text-white"
        >
          <WhatsAppIcon size={18} />
          Ask about this order
        </a>
        <Link href="/laptops" className="mt-4 block text-center text-sm font-semibold text-ink/60 transition hover:text-brand">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}