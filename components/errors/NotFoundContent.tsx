import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function NotFoundContent() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute -left-24 top-10 h-72 w-72 animate-float rounded-full bg-brand/15 blur-3xl" />
      <div
        className="absolute -right-16 bottom-0 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl"
        style={{ animationDelay: "-4s" }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <p className="animate-fade-up bg-gradient-to-r from-brand to-gold bg-clip-text font-display text-8xl font-semibold leading-none text-transparent sm:text-9xl">
          404
        </p>
        <h1
          className="mt-6 animate-fade-up font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ animationDelay: "100ms" }}
        >
          We couldn&apos;t find that page
        </h1>
        <p
          className="mt-4 max-w-md animate-fade-up leading-relaxed text-ink/65"
          style={{ animationDelay: "200ms" }}
        >
          The link may be broken, or the laptop you are looking for may no longer be available. Try
          browsing our laptops, or message us and we will help you find what you need.
        </p>

        <div
          className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/laptops"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30"
          >
            Browse laptops
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-7 py-3.5 text-sm font-bold transition hover:bg-ink hover:text-white"
          >
            <Home size={16} />
            Back to home
          </Link>
          <a
            href={whatsappLink("Hello Obravision, I could not find a page on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1faa59] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#178a47]"
          >
            <WhatsAppIcon size={18} />
            Ask on WhatsApp
          </a>
        </div>

        <div className="mt-10 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Or shop by brand</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {site.brands.map((brand) => (
              <Link
                key={brand}
                href={`/laptops?brand=${encodeURIComponent(brand)}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-line transition hover:bg-brand hover:text-white hover:ring-brand"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}