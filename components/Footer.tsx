import Link from "next/link";
import { BadgeCheck, Boxes, Headset, Laptop, Mail, MapPin, Phone, Store } from "lucide-react";
import { fullAddress, mapsLink, site, whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import Image from "next/image";

const trust = [
  { icon: BadgeCheck, title: "Trusted brands", text: "HP, Dell, ASUS, Apple, Microsoft and Samsung" },
  { icon: Boxes, title: "Retail & wholesale", text: "Buy one unit or order in bulk" },
  { icon: Headset, title: "Direct WhatsApp support", text: "Talk to us before you buy" },
  { icon: Store, title: "Visit our store", text: "Victoria Island, Lagos" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      {/* Wholesale call to action */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Buying laptops in bulk?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed">
              Schools, offices and resellers can order several laptops at wholesale prices.
              Tell us the brand, specs and quantity you need on WhatsApp and we will send you a quote.
            </p>
          </div>
          <a
            href={whatsappLink("Hello Obravision, I would like a wholesale quote for laptops.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            <WhatsAppIcon size={18} />
            Get a wholesale quote
          </a>
        </div>
      </div>

      {/* Trust points */}
      <div className="border-b border-white/10">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {trust.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-gold">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center" aria-label={`${site.name} home`}>
  <Image
    src="/logo-full-on-dark.svg"
    alt={site.name}
    width={171}
    height={40}
    className="h-10 w-auto"
  />
</Link>

          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Obravision is a laptop store in Victoria Island, Lagos. We supply quality laptops to
            individuals, students, schools and businesses, whether you need a single unit or a
            full office set-up.
          </p>
        </div>

        <nav aria-label="Shop by brand" className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Shop by brand</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.brands.map((brand) => (
              <li key={brand}>
                <Link
                  href={`/laptops?brand=${encodeURIComponent(brand)}`}
                  className="transition-colors hover:text-gold"
                >
                  {brand} laptops
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/account" className="transition-colors hover:text-gold">My Account</Link>
            </li>
            <li>
              <Link href="/cart" className="transition-colors hover:text-gold">Cart</Link>
            </li>
          </ul>
        </nav>

        <address className="not-italic lg:col-span-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact us</h3>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-gold">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>{fullAddress}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.tel}`} className="flex gap-3 transition-colors hover:text-gold">
                <Phone size={18} className="shrink-0 text-gold" />
                <span>{site.phone.display}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hello Obravision, I have an enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <WhatsAppIcon size={18} className="shrink-0 text-gold" />
                <span>WhatsApp: {site.phone.display}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 transition-colors hover:text-gold">
                <Mail size={18} className="shrink-0 text-gold" />
                <span>{site.email}</span>
              </a>
            </li>
          </ul>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} {site.name}. All rights reserved.</p>
          <p>Designed and built by: <a href="tel:+2349033179950" style={{color:'orange'}}>CanDid Tech</a></p>
          <p>Laptops in Lagos, Nigeria &middot; Retail and wholesale</p>
        </div>
      </div>
    </footer>
  );
}