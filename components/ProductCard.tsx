import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Laptop } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  type Product,
  conditionLabel,
  formatNaira,
  productSpecLine,
  productWhatsAppMessage,
} from "@/lib/product-utils";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/laptops/${product.slug}`;
  const image = product.images[0];
  const specs = productSpecLine(product);
  const inStock = product.stock > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden bg-white"
      >
        <Laptop size={56} className="absolute inset-0 m-auto text-line" />
        {image && (
          <Image
            src={image}
            alt=""
            fill
            quality={90}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          {conditionLabel(product.condition)}
        </span>
        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-brand">
            {product.name}
          </Link>
        </h3>
        {specs && <p className="mt-2 line-clamp-1 text-xs text-ink/60">{specs}</p>}

        <div className="mt-4">
          <p className="text-xl font-bold text-ink">{formatNaira(product.retail_price)}</p>
          {product.wholesale_price && (
            <p className="mt-0.5 text-xs text-ink/60">
              Wholesale from{" "}
              <span className="font-semibold text-brand">
                {formatNaira(product.wholesale_price)}
              </span>{" "}
              &middot; min {product.wholesale_min_qty ?? 5} units
            </p>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            href={href}
            className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            View Options
            <ArrowRight size={16} className="transition group-hover/btn:translate-x-1" />
          </Link>
          <a
            href={whatsappLink(productWhatsAppMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1faa59] text-white transition hover:-translate-y-0.5 hover:bg-[#178a47]"
          >
            <WhatsAppIcon size={20} />
          </a>
        </div>
      </div>
    </article>
  );
}