import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, ClipboardCheck, Headset, Store } from "lucide-react";
import { site } from "@/lib/site";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { conditionLabel, specRows } from "@/lib/product-utils";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Laptop not found" };

  const title = `${product.name} – Buy in Lagos`;
  const description = product.short_description.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/laptops/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

const perks = [
  { icon: BadgeCheck, title: "Clear specifications", text: "Every detail is listed so you know exactly what you are buying." },
  { icon: ClipboardCheck, title: "Retail or wholesale", text: "Single units at retail price, bulk orders at wholesale price." },
  { icon: Headset, title: "WhatsApp support", text: "Ask questions or confirm payment directly with our team." },
  { icon: Store, title: "Lagos store", text: "Visit us at Tele Plaza, Victoria Island." },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.brand, product.slug);
  const inStock = product.stock > 0;
  const rows = specRows(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    itemCondition:
      product.condition === "new"
        ? "https://schema.org/NewCondition"
        : product.condition === "refurbished"
        ? "https://schema.org/RefurbishedCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: `${site.url}/laptops/${product.slug}`,
      priceCurrency: "NGN",
      price: product.retail_price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.name },
    },
  };

  const tiles = [
    { label: "Availability", value: inStock ? "In Stock" : "Out of Stock" },
    { label: "Condition", value: conditionLabel(product.condition) },
    {
      label: "Wholesale minimum",
      value: product.wholesale_price ? `${product.wholesale_min_qty ?? 5} units` : "Not available",
    },
    { label: "Pick-up location", value: "Victoria Island, Lagos" },
  ];

  return (
    <div className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink/60">
          <Link href="/" className="transition hover:text-brand">Home</Link>
          <ChevronRight size={14} />
          <Link href="/laptops" className="transition hover:text-brand">Laptops</Link>
          <ChevronRight size={14} />
          <span className="line-clamp-1 font-medium text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl bg-white p-4 sm:p-6 lg:sticky lg:top-32">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className={`rounded-full px-3 py-1.5 ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {inStock ? "Ready stock" : "Out of stock"}
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1.5 text-brand">{conditionLabel(product.condition)}</span>
              {product.wholesale_price && (
                <span className="rounded-full bg-gold/20 px-3 py-1.5 text-gold-deep">Wholesale available</span>
              )}
            </div>

            <h1 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand">{product.brand}</p>
            <p className="mt-4 leading-relaxed text-ink/65">{product.short_description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {tiles.map((t) => (
                <div key={t.label} className="rounded-xl border border-line bg-paper/60 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45">{t.label}</p>
                  <p className="mt-1 text-sm font-bold text-ink sm:text-base">{t.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <ProductPurchase product={product} />
            </div>
          </div>
        </div>

        {/* Specs and description */}
        <section className="mt-6 rounded-3xl bg-white p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Product details</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Specifications &amp; Description</h2>

          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <dl className="divide-y divide-line rounded-2xl border border-line">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-5 gap-4 px-5 py-3.5 text-sm">
                  <dt className="col-span-2 font-semibold text-ink/60">{label}</dt>
                  <dd className="col-span-3 font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-4 leading-relaxed text-ink/70">
              {product.description.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="mt-6 rounded-3xl bg-white p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Why {site.name}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Built for Easy Laptop Buying</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10">
                <Icon size={22} className="text-brand" />
                <h3 className="mt-3 text-sm font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12 pb-6">
            <SectionHeading eyebrow="You may also like" title={`More ${product.brand} laptops`} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}