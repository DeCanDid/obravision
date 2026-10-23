import { site } from "@/lib/site";

export const PAGE_SIZE = 12;
export const BRANDS = site.brands;

export const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "refurbished", label: "Refurbished" },
  { value: "uk-used", label: "UK Used" },
] as const;

export const BUDGETS = [
  { value: "400000", label: "Under ₦400,000" },
  { value: "700000", label: "Under ₦700,000" },
  { value: "1000000", label: "Under ₦1,000,000" },
  { value: "1500000", label: "Under ₦1,500,000" },
] as const;

export const RAM_OPTIONS = [4, 8, 16, 32];

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

export type ShopFilters = {
  q: string;
  brands: string[];
  conditions: string[];
  max: number | null;
  ram: number[];
  wholesale: boolean;
  sort: SortValue;
  page: number;
};

export type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const toList = (v: string | string[] | undefined) =>
  (one(v) ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export function parseFilters(sp: RawParams): ShopFilters {
  const max = Number(one(sp.max));
  const page = parseInt(one(sp.page) ?? "1", 10);
  const sort = one(sp.sort);

  return {
    q: (one(sp.q) ?? "").trim().slice(0, 80),
    brands: toList(sp.brand)
      .map((b) => BRANDS.find((x) => x.toLowerCase() === b.toLowerCase()))
      .filter((b): b is string => Boolean(b)),
    conditions: toList(sp.condition).filter((c) => CONDITIONS.some((x) => x.value === c)),
    max: Number.isFinite(max) && max > 0 ? max : null,
    ram: toList(sp.ram).map(Number).filter((n) => RAM_OPTIONS.includes(n)),
    wholesale: one(sp.wholesale) === "1",
    sort: SORTS.some((s) => s.value === sort) ? (sort as SortValue) : "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function filtersToParams(f: ShopFilters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.brands.length) p.set("brand", f.brands.join(","));
  if (f.conditions.length) p.set("condition", f.conditions.join(","));
  if (f.max) p.set("max", String(f.max));
  if (f.ram.length) p.set("ram", f.ram.join(","));
  if (f.wholesale) p.set("wholesale", "1");
  if (f.sort !== "featured") p.set("sort", f.sort);
  return p;
}