import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Building2,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  FileBadge,
  FileText,
  HandCoins,
  Headset,
  Keyboard,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { fullAddress, mapsLink, site, whatsappLink } from "@/lib/site";
import { company, obracompany } from "@/lib/policies";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/policies/RichText";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "About Us – Quality-Tested Laptops in Victoria Island, Lagos",
  description:
    "Learn about Obravision Limited, a Lagos laptop store offering carefully selected, tested pre-owned laptops from top brands, with quality checks, warranty coverage and nationwide delivery.",
  alternates: { canonical: "/about" },
};

const brandList = `${site.brands.slice(0, -1).join(", ")} and ${site.brands[site.brands.length - 1]}`;

const qualityChecks = [
  { icon: Keyboard, text: "Hardware functionality, including keyboard, trackpad, ports and display" },
  { icon: BatteryCharging, text: "Battery performance and charging stability" },
  { icon: Cpu, text: "Processor, RAM and storage performance" },
  { icon: RefreshCw, text: "System optimization and software updates" },
  { icon: Search, text: "Physical condition and durability checks" },
];

const trustPoints = [
  { icon: FileText, title: "Transparent product descriptions" },
  { icon: BadgeCheck, title: "Tested and verified devices" },
  { icon: HandCoins, title: "Fair pricing" },
  { icon: ShieldCheck, title: "Warranty coverage" },
  { icon: Headset, title: "Responsive customer support" },
  { icon: Truck, title: "Nationwide delivery" },
];

const commitments = [
  "Honest and transparent business practices",
  "Clear communication with our customers",
  "Reliable after-sales support",
  "Secure and convenient shopping experiences",
];

const places = [
  { icon: Store, title: "Lagos", text: `Our store at Tele Plaza, ${site.address.area}.` },
  { icon: MapPin, title: "Abuja", text: "Pickup centre for customers in Abuja." },
  { icon: MapPin, title: "Port Harcourt", text: "Pickup centre for customers in Port Harcourt." },
  { icon: Truck, title: "Everywhere else", text: "Safe delivery to customers across Nigeria." },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${site.name}`,
    url: `${site.url}/about`,
    about: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      telephone: site.phone.tel,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.area,
        addressRegion: site.address.city,
        addressCountry: site.address.country,
      },
    },
  };

  const link = "underline-offset-4 transition hover:text-gold hover:underline";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-brand-deep">
        <div className="absolute -left-20 top-0 h-72 w-72 animate-float rounded-full bg-brand/40 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-gold">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">About us</span>
          </nav>
          <h1 className="mt-4 max-w-3xl animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">{site.name}</span>
          </h1>
          <p
            className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-white/80 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Learn who we are, what we do, and our commitment to quality. We bring carefully selected, tested
            laptops to tech enthusiasts, professionals, students and everyday users across Nigeria.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Who we are</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Powerful laptops, without the new-device price
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink/70">
              <p>
                {company.name} is a registered Nigerian company <b> (CAC registration number:{" "}
                <RichText text={company.cac} />) </b> created to solve simple consumer problems. One such problem
                is that many people need powerful laptops, but new devices are becoming increasingly
                expensive. We bridge that gap by offering carefully selected pre-owned laptops from top global
                brands. Every device we sell is chosen for durability, performance and long-term value.
              </p>
              <p>
                Our team is made up of experienced technicians and technology enthusiasts who understand what
                makes a laptop dependable. We combine technical expertise with a commitment to customer
                satisfaction, ensuring every buyer receives a device they can trust.
              </p>
              <p>
                We are poised to sell products that combine reliable performance, great design, and practical
                functionality, serving tech enthusiasts, professionals, students, and everyday users across
                Nigeria.
              </p>
            </div>

            <p className="mt-6 rounded-2xl border border-line bg-paper p-5 text-sm leading-relaxed text-ink/65">
              Please note that {site.name} is an independent reseller and is not affiliated with{" "}
              {brandList}. All trademarks belong to their respective owners. {site.name} is a trading name of{" "}
              {company.name}.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-8 text-white sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">At a glance</p>
              <dl className="mt-6 space-y-5 text-sm">
                {[
                  ["Company", company.name],
                  ["CAC registration number", company.cac],
                  ["Store", `${fullAddress}, Nigeria`],
                  ["Service area", "Lagos store, pickup centres in Abuja and Port Harcourt, delivery across Nigeria"],
                  ["Business hours", company.hours],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <dt className="text-xs uppercase tracking-wider text-white/50">{label}</dt>
                    <dd className="mt-1 font-semibold leading-relaxed">
                      <RichText text={value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Our dedication to quality and customer trust"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 space-y-4 rounded-3xl border border-line bg-white p-6 leading-relaxed text-ink/70 sm:p-10">
              <p>
                {obracompany.name} operates as a direct-to-consumer (DTC) brand through both our online store and
                physical retail location, as well as through selected reseller partnerships. We carefully
                source products from trusted brands, with a strong focus on durability, usability, and value.
              </p>
              <p>
                We source, test and supply pre-owned laptops from brands such as {brandList}. Each laptop goes
                through a structured evaluation process that includes hardware checks, battery health
                assessment and software optimization. This ensures that every device is ready for work,
                school, business or everyday use the moment it reaches you.
              </p>
              <p>
                We are committed to providing customers with honest information, dependable service, and
                quality technology they can trust.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {site.brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/laptops?brand=${encodeURIComponent(brand)}`}
                    className="rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink/75 ring-1 ring-line transition hover:bg-brand hover:text-white hover:ring-brand"
                  >
                    {brand} laptops
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality assurance */}
      <section className="bg-gradient-to-br from-ink via-ink-soft to-brand-deep py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-gold">Quality assurance</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Our Quality Assurance Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-white/75">
              To maintain high standards, every laptop we offer passes through a detailed inspection that covers:
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {qualityChecks.map(({ icon: Icon, text }, i) => (
              <Reveal key={text} delay={i * 70} className="h-full">
                <li className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-ink">
                      <Icon size={22} />
                    </span>
                    <span className="font-display text-2xl font-semibold text-white/20">0{i + 1}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-relaxed">{text}</p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center leading-relaxed text-white/75">
              This process allows us to confidently provide reliable devices that meet the needs of modern users.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why customers trust us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Trust"
            title={`Why Customers Trust ${site.name}`}
            text={`Trust is at the center of everything we do. Customers choose ${site.name} because we provide:`}
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title }, i) => (
            <Reveal key={title} delay={i * 60} className="h-full">
              <li className="flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={24} />
                </span>
                <span className="text-base font-bold">{title}</span>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center leading-relaxed text-ink/70">
            <p>
              By choosing pre-owned laptops from us, customers also help reduce electronic waste, which is a
              growing global concern according to the{" "}
              <a
                href="https://www.unep.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                United Nations Environment Programme
              </a>
              .
            </p>
            <p>
              We believe in building long-term relationships with our customers by offering products and
              services that deliver real value.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Our mission</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              <span className="text-white">Connect.</span> <span className="text-gold">Upgrade.</span>{" "}
              <span className="text-sky-300">Thrive.</span>
            </h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-4 leading-relaxed text-white/75">
              <p>
                Our mission is to simplify digital life by delivering smart, stylish, and dependable
                technology products. We believe great technology should be accessible, intuitive, and
                empowering, enabling people to connect better, upgrade seamlessly, and thrive in every aspect
                of their digital journey.
              </p>
              <p>
                We are dedicated to making quality technology accessible and affordable for individuals,
                students, and businesses across Nigeria through transparent pricing, fast delivery, and
                consistent customer support.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location and service area */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Where we are"
            title="Our Location and Service Area"
            text={`${site.name} operates from Lagos, with pickup centres in Abuja and Port Harcourt, Nigeria, and we deliver pre-owned laptops to customers across the country. Whether you are in Lagos, Abuja, Port Harcourt or any other city, you can shop confidently knowing your device will be delivered safely and on time.`}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {places.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Our commitment</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What we promise every customer
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              Customer satisfaction and trust are at the core of everything we do. We are committed to
              providing a smooth and reliable shopping experience. From helping you choose the right laptop to
              offering after-sales support, our team is always ready to assist. Your satisfaction is our
              priority.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <p className="text-sm font-bold">At {company.name}, we are committed to:</p>
              <ul className="mt-4 space-y-3">
                {commitments.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/75">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/25 text-gold-deep">
                      <Check size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Registration and contact */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="h-full">
            <div className="h-full rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold">Business Registration</h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Building2 size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink/50">Registered business name</dt>
                    <dd className="mt-0.5 font-semibold">{obracompany.name}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <FileBadge size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink/50">CAC registration number</dt>
                    <dd className="mt-0.5 font-semibold">
                      <RichText text={obracompany.cac} />
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink/50">Registered address</dt>
                    <dd className="mt-0.5 font-semibold leading-relaxed">
                      <RichText text={obracompany.registeredAddress} />
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <div className="h-full rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-6 text-white sm:p-8">
              <h2 className="font-display text-2xl font-semibold">About {site.name} Contact Information</h2>
              <p className="mt-2 text-sm text-white/75">Customers can reach us through the following channels:</p>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                    <Phone size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/50">Telephone / WhatsApp</dt>
                    <dd className="mt-0.5 text-sm font-semibold">
                      <a href={`tel:${site.phone.tel}`} className={link}>{site.phone.display}</a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                    <Mail size={18} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-white/50">Email</dt>
                    <dd className="mt-0.5 break-words text-sm font-semibold">
                      <a href={`mailto:${site.email}`} className={link}>{site.email}</a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/50">Store location</dt>
                    <dd className="mt-0.5 text-sm font-semibold leading-relaxed">{fullAddress}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                    <Clock size={18} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/50">Business hours</dt>
                    <dd className="mt-0.5 text-sm font-semibold">
                      <RichText text={obracompany.hours} />
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/laptops"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Browse our laptops
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
                <a
                  href={whatsappLink("Hello Obravision, I would like to ask about your laptops.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1faa59] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#178a47]"
                >
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </a>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold transition hover:bg-white hover:text-ink"
                >
                  Visit our store <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}