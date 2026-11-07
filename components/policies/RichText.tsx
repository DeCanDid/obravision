import Link from "next/link";

const TOKEN = /(\[[^\]]+\]|\{\{[^}]+\}\})/g;

export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const [label, href] = part.slice(2, -2).split("|");
          return (
            <Link
              key={i}
              href={href}
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-deep"
            >
              {label}
            </Link>
          );
        }
        if (/^\[[^\]]+\]$/.test(part)) {
          return (
            <mark key={i} className="rounded bg-gold/30 px-1.5 py-0.5 font-semibold text-ink">
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}