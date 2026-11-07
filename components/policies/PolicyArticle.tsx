import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { company, policies, sectionId, type Block, type Policy } from "@/lib/policies";
import { policyIcon } from "@/components/policies/policyIcons";
import PolicyContact from "@/components/policies/PolicyContact";
import RichText from "@/components/policies/RichText";

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-[15px] leading-7 text-ink/75">
                <RichText text={block.text} />
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-2 text-base font-bold text-ink">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="relative pl-6 text-[15px] leading-7 text-ink/75 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold"
                  >
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            );
            case "ol":
            return (
              <ol key={i} className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-brand">
                {block.items.map((item) => {
                  const text = typeof item === "string" ? item : item.text;
                  const sub = typeof item === "string" ? [] : item.sub;
                  return (
                    <li key={text} className="pl-1 text-[15px] leading-7 text-ink/75">
                      <RichText text={text} />
                      {sub.length > 0 && (
                        <ul className="mt-2 space-y-2">
                          {sub.map((s) => (
                            <li
                              key={s}
                              className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold"
                            >
                              <RichText text={s} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ol>
            );
        }
      })}
    </div>
  );
}

export default function PolicyArticle({ policy }: { policy: Policy }) {
  const Icon = policyIcon(policy.slug);
  const index = policies.findIndex((x) => x.slug === policy.slug);
  const prev = policies[index - 1];
  const next = policies[index + 1];

  return (
    <article className="rounded-3xl border border-line bg-white p-6 sm:p-10">
      <header className="border-b border-line pb-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Icon size={26} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{policy.title}</h1>
        <p className="mt-3 text-sm text-ink/55">
          {company.name} &middot; Last updated: <RichText text={policy.updated} />
        </p>
        {policy.intro.length > 0 && (
          <div className="mt-6 space-y-4">
            {policy.intro.map((text) => (
              <p key={text} className="text-base leading-7 text-ink/75">
                {text}
              </p>
            ))}
          </div>
        )}
      </header>

      <div className="space-y-10 py-10">
        {policy.sections.map((section, i) => (
          <section key={section.heading} id={sectionId(section.heading)} className="scroll-mt-32">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold sm:text-2xl">
              {policy.numbered && (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/25 text-sm font-bold text-gold-deep">
                  {i + 1}
                </span>
              )}
              {section.heading}
            </h2>
            <div className="mt-4">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>

      <PolicyContact
        note={policy.contactNote}
        title={policy.contactTitle ?? "Contact us"}
        number={policy.numbered ? policy.sections.length + 1 : undefined}
      />

      <nav aria-label="More policies" className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/policies/${prev.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-line p-4 transition hover:border-brand/40 hover:bg-paper"
          >
            <ArrowLeft size={18} className="shrink-0 text-brand transition group-hover:-translate-x-1" />
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wider text-ink/50">Previous</span>
              <span className="block truncate text-sm font-bold">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/policies/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-line p-4 text-right transition hover:border-brand/40 hover:bg-paper"
          >
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wider text-ink/50">Next</span>
              <span className="block truncate text-sm font-bold">{next.title}</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-brand transition group-hover:translate-x-1" />
          </Link>
        )}
      </nav>
    </article>
  );
}