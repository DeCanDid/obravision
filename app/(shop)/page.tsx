import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, Headset, Store, Tag } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { getProducts } from "@/lib/products";
import FindLaptop from "@/components/FindLaptop";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Obravision | Buy Laptops in Lagos – HP, Dell, ASUS, Apple, Microsoft & Samsung",
  },
  description: site.description,
  alternates: { canonical: "/" },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2000&q=80";

const why = [
  {
    icon: Tag,
    title: "Retail and wholesale pricing",
    text: "Pay the retail price for one laptop, or unlock lower per-unit wholesale prices when you buy the minimum quantity shown on the product.",
  },
  {
    icon: Headset,
    title: "Talk to us before you buy",
    text: "Every laptop has a WhatsApp button that sends us the exact model and specs, so you can ask questions and confirm availability in seconds.",
  },
  {
    icon: ClipboardCheck,
    title: "A simple ordering process",
    text: "Add laptops to your cart and place your order online. We get notified straight away and guide you through payment on WhatsApp.",
  },
  {
    icon: Store,
    title: "Visit us in Victoria Island",
    text: "See and compare laptops in person at Tele Plaza on Saka Tinubu Street, or have your order arranged for you.",
  },
];

export default async function HomePage() {
  const products = await getProducts({ limit: 16 });
  const featured = products.slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/laptops?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src={HERO_IMAGE}
          alt="Laptops for sale at Obravision, Victoria Island, Lagos"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-brand/50" />
        <div className="absolute -left-24 top-10 -z-10 h-72 w-72 animate-float rounded-full bg-brand/40 blur-3xl" />
        <div
          className="absolute -bottom-20 right-10 -z-10 h-80 w-80 animate-float rounded-full bg-gold/25 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />

        <div className="mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 sm:pb-44 sm:pt-24 lg:pb-52 lg:pt-28">
          <div className="max-w-2xl">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Retail &amp; wholesale &middot; Victoria Island, Lagos
            </span>

            <h1
              className="mt-6 animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "100ms" }}
            >
              Buy Quality Laptops in Lagos at{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                Retail &amp; Wholesale Prices
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ animationDelay: "200ms" }}
            >
              Shop HP, Dell, ASUS, Apple, Microsoft and Samsung laptops from Obravision. Order one
              unit for yourself or buy in bulk for your school, office or resale business, and chat
              with us on WhatsApp before you pay.
            </p>

            <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "300ms" }}>
              <Link
                href="/laptops"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-ink shadow-lg shadow-gold/25 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Shop All Laptops
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappLink("Hello Obravision, I need help choosing a laptop.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-ink"
              >
                <WhatsAppIcon size={18} />
                Chat on WhatsApp
              </a>
            </div>

            <ul
              className="mt-8 grid animate-fade-up gap-2.5 text-sm text-white/85 sm:grid-cols-2"
              style={{ animationDelay: "400ms" }}
            >
              {["Six leading laptop brands", "Single units and bulk orders", "Order online, pay via WhatsApp", "Store in Victoria Island, Lagos"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <div className="relative z-10 mx-auto -mt-28 max-w-7xl px-4 sm:-mt-32 sm:px-6">
        <FindLaptop />
      </div>

      {/* BRANDS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Laptop brands"
            title="Shop the Brands You Trust"
            text="Pick a brand to see every matching laptop we have in stock, from business ultrabooks to everyday student laptops."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {site.brands.map((brand, i) => (
            <Reveal key={brand} delay={i * 60}>
              <Link
                href={`/laptops?brand=${encodeURIComponent(brand)}`}
                className="flex h-20 items-center justify-center rounded-xl border border-line bg-white font-display text-xl font-semibold text-ink/70 transition duration-300 hover:-translate-y-1 hover:border-brand hover:text-brand hover:shadow-lg hover:shadow-brand/10"
              >
                {brand}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Featured laptops"
              title="Popular Laptops Ready to Order"
              text="Hand-picked laptops with the specs most Lagos buyers ask for: fast processors, plenty of RAM and quick SSD storage."
            />
          </Reveal>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 80} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-ink/60">Laptops are being added. Please check back shortly.</p>
          )}
        </div>
      </section>

      {/* RETAIL VS WHOLESALE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="How to buy"
            title="One Laptop or a Hundred, We Have You Covered"
            text="Choose the way that fits you. Both options use the same simple process: order online, then confirm payment with us on WhatsApp."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Retail</span>
              <h3 className="mt-3 font-display text-2xl font-semibold">Buy a single laptop</h3>
              <p className="mt-3 leading-relaxed text-ink/65">
                Perfect for students, freelancers and professionals. Pick the laptop that fits your
                budget, pay the listed price for one unit and ask us anything on WhatsApp first.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/80">
                {["Buy just one unit, no minimum", "Clear prices in naira", "Help choosing the right specs"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check size={16} className="text-brand" />{t}</li>
                ))}
              </ul>
              <Link href="/laptops" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:gap-3">
                Shop laptops <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/30">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Wholesale</span>
              <h3 className="mt-3 font-display text-2xl font-semibold">Buy laptops in bulk</h3>
              <p className="mt-3 leading-relaxed text-white/75">
                Built for offices, schools and resellers. Reach the minimum quantity on a product
                and the lower wholesale price per unit applies to your whole order.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                {["Lower price per unit on bulk orders", "Mix quantities across the same model", "Get a quote straight on WhatsApp"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check size={16} className="text-gold" />{t}</li>
                ))}
              </ul>
              <a
                href={whatsappLink("Hello Obravision, I would like a wholesale quote for laptops.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-white"
              >
                <WhatsAppIcon size={18} /> Request a wholesale quote
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Top categories"
              title="Browse Laptops by Brand"
              text="Switch between brands to compare models, prices and specs, then open any laptop for full details."
            />
          </Reveal>
          <div className="mt-10">
            <CategoryTabs products={products} />
          </div>
        </div>
      </section>

      {/* REQUEST A LAPTOP */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-deep via-brand to-ink-soft p-8 text-white sm:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/30 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Can&apos;t find your laptop?</p>
                <h2 className="mt-3 font-display text-3xl font-semibold">Tell us what you need and we will source it</h2>
                <p className="mt-3 leading-relaxed text-white/80">
                  Send us the brand, model, specs and quantity you are looking for. We will check
                  availability and reply with the best price.
                </p>
              </div>
              <a
                href={whatsappLink("Hello Obravision, I am looking for a laptop that is not on your website.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold"
              >
                <WhatsAppIcon size={18} /> Request a laptop
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHY */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow={`Why ${site.name}`}
              title="A Laptop Store That Makes Buying Easy"
              text="From picking a model to paying for it, we keep every step clear so you always know where your order stands."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}