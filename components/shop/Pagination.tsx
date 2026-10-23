import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams(params);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/laptops${qs ? `?${qs}` : ""}`;
  };

  const nums = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  const items: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push("gap");
    items.push(n);
  });

  const base = "grid h-11 min-w-11 place-items-center rounded-xl border px-3 text-sm font-semibold transition";

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" aria-label="Previous page" className={clsx(base, "border-line bg-white hover:border-brand hover:text-brand")}>
          <ChevronLeft size={18} />
        </Link>
      )}
      {items.map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-ink/40">…</span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={clsx(
              base,
              item === page
                ? "border-brand bg-brand text-white"
                : "border-line bg-white hover:border-brand hover:text-brand"
            )}
          >
            {item}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" aria-label="Next page" className={clsx(base, "border-line bg-white hover:border-brand hover:text-brand")}>
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}