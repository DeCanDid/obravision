import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { policies } from "@/lib/policies";
import { policyIcon } from "@/components/policies/policyIcons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Store Policies – Privacy, Shipping, Returns, Warranty and Terms",
  description:
    "Read the Obravision store policies: privacy policy, shipping policy, return and refund policy, warranty policy, and terms and conditions.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesIndexPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Our policies</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink/65">
        We want buying from {site.name} to be clear and fair. Choose a policy below to read it, or use the
        menu to move between them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {policies.map((policy) => {
          const Icon = policyIcon(policy.slug);
          return (
            <Link
              key={policy.slug}
              href={`/policies/${policy.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{policy.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{policy.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-brand">
                Read policy <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-ink/60">
        Questions about any of these policies? <Link href="/contact" className="font-semibold text-brand hover:underline">Contact us</Link> and we will gladly help.
      </p>
    </div>
  );
}