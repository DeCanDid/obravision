import { site } from "@/lib/site";

export type Variant = {
  id: string;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  retail_price: number;
  wholesale_price: number | null;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  condition: "new" | "refurbished" | "uk-used";
  short_description: string;
  description: string;
  retail_price: number;
  wholesale_price: number | null;
  wholesale_min_qty: number | null;
  processor: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  screen_size: number | null;
  gpu: string | null;
  os: string | null;
  stock: number;
  images: string[];
  featured: boolean;
  is_active: boolean;
  created_at: string;
  variants: Variant[] | null;
  ram_options: number[];
};

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const conditionLabel = (c: Product["condition"]) =>
  ({ new: "Brand New", refurbished: "Refurbished", "uk-used": "UK Used" })[c];

const storageText = (gb: number | null, type: string | null) =>
  gb ? `${gb >= 1000 ? gb / 1000 + "TB" : gb + "GB"}${type ? " " + type : ""}` : null;

/* ---------- Variations ---------- */

export const hasVariants = (p: Product) => Boolean(p.variants && p.variants.length > 0);

export function variantLabel(v: Variant) {
  return (
    [v.ram_gb ? `${v.ram_gb}GB RAM` : null, storageText(v.storage_gb, v.storage_type)]
      .filter(Boolean)
      .join(" · ") || "Standard"
  );
}

export function findVariant(p: Product, id: string | null | undefined) {
  if (!id || !p.variants) return null;
  return p.variants.find((v) => v.id === id) ?? null;
}

export const totalStock = (p: Product) =>
  hasVariants(p) ? p.variants!.reduce((sum, v) => sum + v.stock, 0) : p.stock;

export function priceRange(p: Product) {
  if (!hasVariants(p)) return { min: p.retail_price, max: p.retail_price };
  const prices = p.variants!.map((v) => v.retail_price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatPriceRange(p: Product) {
  const { min, max } = priceRange(p);
  return min === max ? formatNaira(min) : `${formatNaira(min)} – ${formatNaira(max)}`;
}

/* ---------- Pricing (works with or without a variation) ---------- */

export function isWholesaleQty(p: Product, qty: number, v?: Variant | null) {
  const price = v ? v.wholesale_price : p.wholesale_price;
  return price !== null && price !== undefined && qty >= (p.wholesale_min_qty ?? 5);
}

export function unitPrice(p: Product, qty: number, v?: Variant | null) {
  const retail = v ? v.retail_price : p.retail_price;
  return isWholesaleQty(p, qty, v) ? (v ? v.wholesale_price! : p.wholesale_price!) : retail;
}

/* ---------- Text helpers ---------- */

export function productSpecLine(p: Product, v?: Variant | null) {
  const multi = !v && hasVariants(p);
  const ram = v ? v.ram_gb : multi ? null : p.ram_gb;
  const storage = v
    ? storageText(v.storage_gb, v.storage_type)
    : multi
    ? null
    : storageText(p.storage_gb, p.storage_type);

  return [
    p.processor,
    ram ? `${ram}GB RAM` : null,
    storage,
    p.screen_size ? `${p.screen_size}"` : null,
    multi ? `${p.variants!.length} configurations` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function specRows(p: Product): [string, string][] {
  const multi = hasVariants(p);
  const rams = multi
    ? Array.from(new Set(p.variants!.map((v) => v.ram_gb).filter((x): x is number => x !== null)))
    : p.ram_gb
    ? [p.ram_gb]
    : [];
  const storages = multi
    ? Array.from(new Set(p.variants!.map((v) => storageText(v.storage_gb, v.storage_type)).filter(Boolean)))
    : [storageText(p.storage_gb, p.storage_type)].filter(Boolean);

  const rows: [string, string | null][] = [
    ["Brand", p.brand],
    ["Condition", conditionLabel(p.condition)],
    ["Processor", p.processor],
    ["Memory (RAM)", rams.length ? rams.map((r) => `${r}GB`).join(" / ") : null],
    ["Storage", storages.length ? (storages as string[]).join(" / ") : null],
    ["Display", p.screen_size ? `${p.screen_size}-inch` : null],
    ["Graphics", p.gpu],
    ["Operating system", p.os],
  ];
  return rows.filter(([, v]) => v) as [string, string][];
}

export function productWhatsAppMessage(p: Product) {
  const lines = ["Hello Obravision, I'm interested in this laptop:", "", p.name];
  const specs = productSpecLine(p);
  if (specs) lines.push(specs);
  lines.push(`Price: ${formatPriceRange(p)}`, `Link: ${site.url}/laptops/${p.slug}`);
  return lines.join("\n");
}