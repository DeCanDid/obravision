import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Your cart</h1>
        <CartView />
      </div>
    </section>
  );
}