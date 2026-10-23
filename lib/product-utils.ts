import { site } from "@/lib/site";

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
};

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const conditionLabel = (c: Product["condition"]) =>
  ({ new: "Brand New", refurbished: "Refurbished", "uk-used": "UK Used" })[c];

const storageText = (p: Product) =>
  p.storage_gb
    ? `${p.storage_gb >= 1000 ? p.storage_gb / 1000 + "TB" : p.storage_gb + "GB"}${
        p.storage_type ? " " + p.storage_type : ""
      }`
    : null;

export function productSpecLine(p: Product) {
  return [
    p.processor,
    p.ram_gb ? `${p.ram_gb}GB RAM` : null,
    storageText(p),
    p.screen_size ? `${p.screen_size}"` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function specRows(p: Product): [string, string][] {
  const rows: [string, string | null][] = [
    ["Brand", p.brand],
    ["Condition", conditionLabel(p.condition)],
    ["Processor", p.processor],
    ["Memory (RAM)", p.ram_gb ? `${p.ram_gb}GB` : null],
    ["Storage", storageText(p)],
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
  lines.push(`Price: ${formatNaira(p.retail_price)}`, `Link: ${site.url}/laptops/${p.slug}`);
  return lines.join("\n");
}

export function isWholesaleQty(p: Product, qty: number) {
  return p.wholesale_price !== null && qty >= (p.wholesale_min_qty ?? 5);
}

export function unitPrice(p: Product, qty: number) {
  return isWholesaleQty(p, qty) ? p.wholesale_price! : p.retail_price;
}