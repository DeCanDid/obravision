import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { fullAddress, mapsLink, site, whatsappLink } from "@/lib/site";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/Reveal";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Us – Call, WhatsApp or Visit Our Lagos Laptop Store",
  description:
    "Contact Obravision at Tele Plaza, Victoria Island, Lagos. Call 0903 083 2685, chat on WhatsApp, email us, or send a message to ask about laptops or request a wholesale quote.",
  alternates: { canonical: "/contact" },
};

const cards = [
  {
    icon: MapPin,
    title: "Visit our store",
    lines: [fullAddress],
    href: mapsLink,
    cta: "Get directions",
    external: true,
  },
  {
    icon: Phone,
    title: "Call us",
    lines: [site.phone.display],
    href: `tel:${site.phone.tel}`,
    cta: "Call now",
    external: false,
  },
  {
    icon: WhatsAppIcon,
    title: "Chat on WhatsApp",
    lines: [site.phone.display, "Fast answers about stock and prices"],
    href: whatsappLink("Hello Obravision, I have a question about your laptops."),
    cta: "Start a chat",
    external: true,
  },
  {
    icon: Mail,
    title: "Email us",
    lines: [site.email],
    href: `mailto:${site.email}`,
    cta: "Send an email",
    external: false,
  },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${site.name}`,
    url: `${site.url}/contact`,
    about: {
      "@type": "ElectronicsStore",
      name: site.name,
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

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${fullAddress}, Nigeria`)}&output=embed`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-soft to-brand-deep">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-gold">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="mt-4 animate-fade-up font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Contact Obravision
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            Questions about a laptop, a bulk order for your school or office, or help with an order you
            placed? Call us, chat on WhatsApp, send a message or visit our store in Victoria Island, Lagos.
          </p>
        </div>
      </section>

      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ icon: Icon, title, lines, href, cta, external }, i) => (
              <Reveal key={title} delay={i * 70} className="h-full">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={22} />
                  </span>
                  <h2 className="mt-4 text-base font-bold">{title}</h2>
                  <div className="mt-1.5 space-y-0.5 text-sm leading-relaxed text-ink/65">
                    {lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-brand">
                    {cta}
                    <ExternalLink size={14} className="transition group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-line bg-white">
                <iframe
                  title={`Map showing the ${site.name} store location`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full border-0 sm:h-96"
                />
                <div className="space-y-3 p-6">
                  <h2 className="font-display text-xl font-semibold">Find our store</h2>
                  <p className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                    {fullAddress}
                  </p>
                  <p className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <Clock size={18} className="mt-0.5 shrink-0 text-brand" />
                    Planning a visit? Message us on WhatsApp first so we can confirm the laptop you want is ready.
                  </p>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-brand"
                  >
                    Open in Google Maps <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}