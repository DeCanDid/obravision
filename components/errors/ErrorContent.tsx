"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function ErrorContent({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="bg-paper">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <div className="grid h-20 w-20 animate-fade-up place-items-center rounded-full bg-gold/20 text-gold-deep">
          <AlertTriangle size={38} />
        </div>
        <h1
          className="mt-6 animate-fade-up font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ animationDelay: "100ms" }}
        >
          Something went wrong
        </h1>
        <p
          className="mt-4 animate-fade-up leading-relaxed text-ink/65"
          style={{ animationDelay: "200ms" }}
        >
          Sorry, this page could not load properly. This is usually temporary, so please try again. If
          it keeps happening, message us on WhatsApp or call {site.phone.display} and we will help you
          straight away.
        </p>

        <div
          className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "300ms" }}
        >
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-ink px-7 py-3.5 text-sm font-bold transition hover:bg-ink hover:text-white"
          >
            Back to home
          </Link>
          <a
            href={whatsappLink("Hello Obravision, something went wrong on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1faa59] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#178a47]"
          >
            <WhatsAppIcon size={18} />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}