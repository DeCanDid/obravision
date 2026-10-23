import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OrderSuccess from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = {
  title: "Order Placed",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ order?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  if (!order || !/^OBV-\d{6}-[A-Z0-9]{5}$/.test(order)) redirect("/laptops");

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <OrderSuccess orderNumber={order} />
      </div>
    </section>
  );
}