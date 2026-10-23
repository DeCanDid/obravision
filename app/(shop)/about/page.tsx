import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, ClipboardList, HandCoins, Headset, MapPin, ShieldCheck, ShoppingCart, Wallet } from "lucide-react";
import { fullAddress, site, whatsappLink } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "About Us – Laptop Store in Victoria Island, Lagos",
  description:
    "Obravision is a laptop store at Tele Plaza, Victoria Island, Lagos. We sell HP, Dell, ASUS, Apple, Microsoft and Samsung laptops to individuals, schools and businesses, at retail and wholesale prices.",
  alternates: { canonical: "/about" },
};

const brandNotes: Record<string, string> = {
  HP: "Reliable laptops for office work, school and business, from everyday models to professional ranges.",
  Dell: "Well-built laptops known for durability and steady performance in business settings.",
  ASUS: "Good-value laptops with modern designs, popular with students and home users.",
  Apple: "MacBooks with smooth performance, long battery life and a premium finish.",
  Microsoft: "Surface laptops with sharp touchscreens and a slim, premium design.",
  Samsung: "Stylish, lightweight laptops with vivid displays that pair well with other Samsung devices.",
};

const values = [
  {
    icon: ClipboardList,
    title: "Clear information",
    text: "Every laptop page lists its processor, memory, storage, display and condition, so you know exactly what you are buying before you pay.",
  },
  {
    icon: HandCoins,
    title: "Fair retail and wholesale pricing",
    text: "Prices are shown in naira. Buy one laptop at the retail price, or order the minimum quantity shown on a product to get the lower wholesale price per unit.",
  },
  {
    icon: Headset,
    title: "Real people on WhatsApp",
    text: "Not sure which laptop suits you? Message us with your budget and what you will use it for, and we will point you to the right options.",
  },
  {
    icon: ShieldCheck,
    title: "A store you can visit",
    text: "We are based at Tele Plaza on Saka Tinubu Street in Victoria Island, so you can see us in person instead of buying from a stranger online.",
  },
];

const steps = [
  { icon: ShoppingCart, title: "Choose your laptops", text: "Browse by brand, condition, memory or budget, then add the laptops you want to your cart." },
  { icon: ClipboardList, title: "Place your order", text: "Check out with your name and phone number. We are notified as soon as your order comes in." },
  { icon: Wallet, title: "Pay and send your receipt", text: "We share our payment details on WhatsApp. Pay, then send your receipt to the same chat." },
  { icon: HandCoins, title: "Collect or arrange delivery", text: "Pick up your laptops at our Victoria Island store, or ask us about delivery to your address." },
];

const faqs = [
  {
    q: "Do you sell laptops wholesale?",
    a: "Yes. Many of our laptops have a wholesale price that applies when you order the minimum quantity shown on the product page. For larger orders, message us on WhatsApp for a quote.",
  },
  {
    q: "Where is the Obravision store located?",
    a: `We are at ${fullAddress}. Message us before you visit so we can confirm the laptop you want is ready.`,
  },
  {
    q: "Do I need an account to buy?",
    a: "You can browse every laptop and message us on WhatsApp without an account. To add laptops to a cart and place an order on the website, you need a free account so your cart is saved.",
  },
  {
    q: "How do I pay for my order?",
    a: "After you place your order, we share our payment details on WhatsApp. Once you have paid, send your receipt to the same chat so we can confirm your order.",
  },
  {
    q: "Which laptop brands do you sell?",
    a: `We sell ${site.brands.slice(0, -1).join(", ")} and ${site.brands[site.brands.length - 1]} laptops.`,
  },
  {
    q: "Can you deliver my order?",
    a: "You can choose delivery at checkout. We confirm the delivery cost and timing with you on WhatsApp before anything is sent.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-brand-deep">
        <div className="absolute -left-20 top-0 h-72 w-72 animate-float rounded-full bg-brand/40 blur-3xl" />
        <div className="absolute -bottom-16 right-10 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl" style={{ animationDelay: "-4s" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-gold">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">About us</span>
          </nav>
          <h1 className="mt-4 max-w-3xl animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Your Trusted Laptop Store in{" "}
            <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">Victoria Island, Lagos</span>
          </h1>
          <p className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-white/80 sm:text-lg" style={{ animationDelay: "120ms" }}>
            {site.name} sells laptops to individuals, students, professionals, schools and businesses.
            Whether you need one laptop for yourself or a batch for your team, we help you find the right
            machine at a fair price, with clear specs and honest advice.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Who we are</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A laptop store built around easy, honest buying
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink/70">
              <p>
                {site.name} is a laptop store at Tele Plaza, Unit A19, 5 Saka Tinubu Street, Victoria
                Island, Lagos. We stock laptops from {site.brands.slice(0, -1).join(", ")} and{" "}
                {site.brands[site.brands.length - 1]}, from dependable everyday machines to powerful
                business laptops.
              </p>
              <p>
                Buying a laptop is a big decision, and it should not be confusing. That is why every
                laptop on our website shows its full specifications and condition, why prices are listed
                openly in naira, and why you can message us on WhatsApp at any point to ask a question
                before you buy.
              </p>
              <p>
                We serve two kinds of customers. If you need a single laptop for work, school or home,
                you can buy one unit at the retail price. If you are equipping an office, a school or a
                resale business, our wholesale prices reward you for ordering in bulk.
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/laptops" className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep">
                Browse our laptops <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-ink px-7 py-3.5 text-sm font-bold transition hover:bg-ink hover:text-white">
                Contact us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-8 text-white sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">At a glance</p>
              <dl className="mt-6 space-y-5 text-sm">
                {[
                  ["Store", site.name],
                  ["Location", fullAddress],
                  ["Brands", site.brands.join(", ")],
                  ["Buy as", "A single unit (retail) or in bulk (wholesale)"],
                  ["Order support", `WhatsApp and phone: ${site.phone.display}`],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <dt className="text-xs uppercase tracking-wider text-white/50">{label}</dt>
                    <dd className="mt-1 font-semibold leading-relaxed">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What we sell"
              title="Laptops from Six Leading Brands"
              text="Pick a brand to see every matching laptop in our store, with full specs and prices."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.brands.map((brand, i) => (
              <Reveal key={brand} delay={i * 60} className="h-full">
                <Link
                  href={`/laptops?brand=${encodeURIComponent(brand)}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
                >
                  <h3 className="font-display text-2xl font-semibold transition group-hover:text-brand">{brand} laptops</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{brandNotes[brand] ?? `Shop ${brand} laptops at ${site.name}.`}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-brand">
                    Shop {brand} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow={`Why choose ${site.name}`}
            title="What You Can Expect When You Buy From Us"
            text="We keep the whole process simple, from choosing a laptop to collecting it."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="flex h-full gap-5 rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={24} />
                </span>
                <div>
                  <h3 className="text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How ordering works */}
      <section className="bg-gradient-to-br from-ink via-ink-soft to-brand-deep py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-gold">How it works</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Buying a Laptop From Us in Four Steps
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <li className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-ink">
                      <Icon size={22} />
                    </span>
                    <span className="font-display text-3xl font-semibold text-white/20">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions We Are Often Asked" />
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-line bg-white transition open:border-brand/40 open:shadow-md open:shadow-brand/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-lg leading-none text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-deep via-brand to-ink-soft p-8 text-white sm:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/30 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-semibold">Ready to find your next laptop?</h2>
                <p className="mt-3 flex items-start gap-2 leading-relaxed text-white/80">
                  <MapPin size={18} className="mt-1 shrink-0 text-gold" />
                  Browse our laptops online, or message us and visit the store at {site.address.area}, {site.address.city}.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/laptops" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold">
                  Shop laptops
                </Link>
                <a
                  href={whatsappLink("Hello Obravision, I would like to ask about your laptops.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-ink"
                >
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}