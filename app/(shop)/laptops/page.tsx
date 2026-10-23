import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SearchX } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { searchProducts } from "@/lib/products";
import { PAGE_SIZE, filtersToParams, parseFilters, type RawParams } from "@/lib/shop-filters";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";
import ShopControls from "@/components/shop/ShopControls";
import Pagination from "@/components/shop/Pagination";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const brand = f.brands.length === 1 ? f.brands[0] : null;

  const title = brand
    ? `${brand} Laptops for Sale in Lagos`
    : "Laptops for Sale in Lagos – Retail & Wholesale";
  const description = brand
    ? `Shop ${brand} laptops at ${site.name} in Victoria Island, Lagos. Compare specs and naira prices, then buy one unit or order in bulk at wholesale prices.`
    : `Browse HP, Dell, ASUS, Apple, Microsoft and Samsung laptops at ${site.name}, Lagos. Filter by brand, condition, RAM and budget, and buy one unit or in bulk.`;

  // Only clean listing and single-brand pages should be indexed
  const indexable =
    !f.q && !f.conditions.length && !f.max && !f.ram.length && !f.wholesale &&
    f.sort === "featured" && f.brands.length <= 1;

  const canonical = new URLSearchParams();
  if (brand) canonical.set("brand", brand);
  if (f.page > 1) canonical.set("page", String(f.page));
  const qs = canonical.toString();

  return {
    title,
    description,
    alternates: { canonical: `/laptops${qs ? `?${qs}` : ""}` },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function LaptopsPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);
  const { products, total } = await searchProducts(filters);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, filters.page * PAGE_SIZE);
  const params = filtersToParams(filters);

  const heading =
    filters.brands.length === 1
      ? `${filters.brands[0]} Laptops for Sale in Lagos`
      : "Laptops for Sale in Lagos";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: from + i,
      url: `${site.url}/laptops/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-brand-deep">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-gold">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Laptops</span>
          </nav>
          <h1 className="mt-4 animate-fade-up font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Compare specs and naira prices, filter by brand, condition, RAM and budget, and order
            one laptop or a bulk batch. Every laptop has a WhatsApp button, so you can ask us about
            the exact model before you buy.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <FilterPanel />
            </div>
          </aside>

          <div>
            <ShopControls total={total} from={from} to={to} />

            {products.length > 0 ? (
              <div
                key={`${params.toString()}-${filters.page}`}
                className="mt-6 grid animate-fade-in gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-line bg-paper px-6 py-16 text-center">
                <SearchX size={40} className="mx-auto text-brand" />
                <h2 className="mt-4 font-display text-2xl font-semibold">No laptops match your search</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">
                  Try removing a filter or searching with fewer words. If you are looking for a
                  specific model, message us and we will check availability for you.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/laptops"
                    className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-brand"
                  >
                    Clear all filters
                  </Link>
                  <a
                    href={whatsappLink("Hello Obravision, I am looking for a laptop I could not find on your website.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1faa59] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#178a47]"
                  >
                    <WhatsAppIcon size={18} />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            )}

            <Pagination page={filters.page} totalPages={totalPages} params={params.toString()} />
          </div>
        </div>
      </div>
    </>
  );
}