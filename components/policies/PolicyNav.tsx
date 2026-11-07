"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutGrid } from "lucide-react";
import { policies, sectionId } from "@/lib/policies";
import { policyIcon } from "@/components/policies/policyIcons";

export default function PolicyNav() {
  const pathname = usePathname();
  const onOverview = pathname === "/policies";

  return (
    <>
      {/* Phones and tablets: scrollable tabs */}
      <nav aria-label="Policies" className="-mx-4 mb-6 overflow-x-auto px-4 lg:hidden">
        <ul className="flex w-max gap-2 pb-2">
          <li>
            <Link
              href="/policies"
              aria-current={onOverview ? "page" : undefined}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                onOverview ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-line hover:text-brand"
              )}
            >
              <LayoutGrid size={15} /> All policies
            </Link>
          </li>
          {policies.map((policy) => {
            const active = pathname === `/policies/${policy.slug}`;
            return (
              <li key={policy.slug}>
                <Link
                  href={`/policies/${policy.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "inline-block whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition",
                    active ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-line hover:text-brand"
                  )}
                >
                  {policy.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop: sticky side navigation */}
      <aside className="hidden lg:block">
        <nav aria-label="Policies" className="sticky top-32 rounded-2xl border border-line bg-white p-3">
          <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Our policies</p>

          <Link
            href="/policies"
            aria-current={onOverview ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              onOverview ? "bg-ink text-white" : "text-ink/70 hover:bg-paper hover:text-ink"
            )}
          >
            <LayoutGrid size={17} /> All policies
          </Link>

          <ul className="mt-1 space-y-1">
            {policies.map((policy) => {
              const active = pathname === `/policies/${policy.slug}`;
              const Icon = policyIcon(policy.slug);

              return (
                <li key={policy.slug}>
                  <Link
                    href={`/policies/${policy.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active ? "bg-ink text-white" : "text-ink/70 hover:bg-paper hover:text-ink"
                    )}
                  >
                    <Icon size={17} className={active ? "text-gold" : ""} />
                    {policy.title}
                  </Link>

                  {active && (
                    <ul className="mb-2 ml-6 mt-1 animate-fade-in space-y-0.5 border-l-2 border-gold/50 pl-4">
                      {policy.sections.map((section) => (
                        <li key={section.heading}>
                          <a
                            href={`#${sectionId(section.heading)}`}
                            className="block py-1.5 text-[13px] leading-snug text-ink/60 transition hover:text-brand"
                          >
                            {section.heading}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a href="#contact" className="block py-1.5 text-[13px] font-semibold text-brand">
                          {policy.contactTitle ?? "Contact us"}
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}