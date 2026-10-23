"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Banknote, CheckCircle2, Receipt, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { site, whatsappLink } from "@/lib/site";
import { formatNaira } from "@/lib/product-utils";
import { useAuth } from "@/components/providers/AuthProvider";
import StateCard from "@/components/ui/StateCard";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  is_wholesale: boolean;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  total_units: number;
  subtotal: number;
  owner_notified: boolean;
  order_items: OrderItem[];
};

export default function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    createClient()
      .from("orders")
      .select("id, order_number, customer_name, total_units, subtotal, owner_notified, order_items(*)")
      .eq("order_number", orderNumber)
      .maybeSingle()
      .then(({ data }) => {
        setOrder((data as unknown as Order) ?? null);
        setLoading(false);
      });
  }, [authLoading, user, orderNumber]);

  if (loading || authLoading) {
    return <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl bg-white" />;
  }

  if (!order) {
    return (
      <StateCard
        icon={<SearchX size={28} />}
        title="We could not find that order"
        text="Please sign in with the account you used to place it, or message us on WhatsApp and we will help."
      >
        <Link href="/account?next=/laptops" className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep">
          Go to my account
        </Link>
      </StateCard>
    );
  }

  const total = formatNaira(order.subtotal);

  const receiptMessage = [
    `Hello ${site.name}, I have made payment for order ${order.order_number}.`,
    `Name: ${order.customer_name}`,
    `Amount paid: ${total}`,
    "",
    "I am attaching my payment receipt now.",
  ].join("\n");

  const enquiryMessage = [
    `Hello ${site.name}, I just placed order ${order.order_number} (${total}, ${order.total_units} units).`,
    "Please share the payment details so I can pay.",
  ].join("\n");

  const hasBank = Boolean(site.payment.accountNumber);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Confirmation */}
      <div className="rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-8 text-center text-white sm:p-10">
        <div className="mx-auto grid h-16 w-16 animate-fade-up place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
          <CheckCircle2 size={34} />
        </div>
        <h2 className="mt-5 font-display text-3xl font-semibold">Thank you, {order.customer_name.split(" ")[0]}!</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/75">
          Your order has been placed.{" "}
          {order.owner_notified
            ? "The shop has been notified and will contact you shortly."
            : "Please message us on WhatsApp below so we can confirm it quickly."}
        </p>
        <p className="mx-auto mt-5 inline-block rounded-full bg-white/10 px-5 py-2 text-sm">
          Order number: <span className="font-bold tracking-wider text-gold">{order.order_number}</span>
        </p>
      </div>

      {/* Payment steps */}
      <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold">What to do next</h2>

        <ol className="mt-6 space-y-5">
          {[
            { icon: BadgeCheck, title: "Order placed", text: "We have saved your order and your cart has been cleared." },
            {
              icon: Banknote,
              title: "Make your payment",
              text: hasBank
                ? "Pay the total below using our account details, or ask us on WhatsApp if you need help."
                : "Ask us for our payment details on WhatsApp and we will send them straight away.",
            },
            { icon: Receipt, title: "Send your receipt", text: "Share your payment receipt with us on WhatsApp so we can confirm your order." },
          ].map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold">
                  {i + 1}. {title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        {hasBank && (
          <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
            {[
              ["Bank", site.payment.bankName],
              ["Account name", site.payment.accountName],
              ["Account number", site.payment.accountNumber],
              ["Amount to pay", total],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3.5">
                <dt className="text-ink/60">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappLink(receiptMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1faa59] py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#178a47] hover:shadow-lg hover:shadow-[#1faa59]/30"
          >
            <WhatsAppIcon size={18} />
            Send payment receipt
          </a>
          <a
            href={whatsappLink(enquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#1faa59] py-3.5 text-sm font-bold text-[#1faa59] transition hover:bg-[#1faa59] hover:text-white"
          >
            <WhatsAppIcon size={18} />
            Ask about payment
          </a>
        </div>
        <p className="mt-3 text-xs text-ink/55">
          In WhatsApp, tap the attachment icon to add a photo or PDF of your receipt before sending.
        </p>
      </section>

      {/* Order details */}
      <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Your order</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.order_items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold">{i.product_name}</p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {i.quantity} × {formatNaira(i.unit_price)}
                  {i.is_wholesale && <span className="ml-1.5 font-semibold text-gold-deep">Wholesale</span>}
                </p>
              </div>
              <p className="shrink-0 font-bold">{formatNaira(i.line_total)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <p className="font-bold">Total</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
      </section>

      <div className="flex flex-col justify-center gap-3 pb-4 sm:flex-row">
        <Link href="/laptops" className="rounded-full bg-ink px-7 py-3.5 text-center text-sm font-bold text-white transition hover:bg-brand">
          Continue shopping
        </Link>
        <Link href="/" className="rounded-full border border-line px-7 py-3.5 text-center text-sm font-bold transition hover:border-ink">
          Back to home
        </Link>
      </div>
    </div>
  );
}