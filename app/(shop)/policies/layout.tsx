import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PolicyNav from "@/components/policies/PolicyNav";

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-brand-deep">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-gold">Home</Link>
            <ChevronRight size={14} />
            <Link href="/policies" className="transition hover:text-gold">Policies</Link>
          </nav>
          <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Store policies and legal information
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Everything you need to know about how we handle your data, deliver your order, and look after
            you if something goes wrong.
          </p>
        </div>
      </section>

      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-10">
          <PolicyNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </>
  );
}