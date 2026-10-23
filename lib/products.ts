import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/product-utils";
import { PAGE_SIZE, type ShopFilters } from "@/lib/shop-filters";

export async function getProducts({ limit = 24 }: { limit?: number } = {}) {
  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as Product | null) ?? null;
}

export async function getRelatedProducts(brand: string, excludeSlug: string, limit = 4) {
  const { data } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("brand", brand)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function searchProducts(f: ShopFilters) {
  let query = createPublicClient()
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  // Every word must match the name, brand or processor, so "HP i7" works
  for (const word of f.q.split(/\s+/)) {
    const w = word.replace(/[,()%*\\"'_]/g, "").trim();
    if (!w) continue;
    query = query.or(`name.ilike.%${w}%,brand.ilike.%${w}%,processor.ilike.%${w}%`);
  }

  if (f.brands.length) query = query.in("brand", f.brands);
  if (f.conditions.length) query = query.in("condition", f.conditions);
  if (f.ram.length) query = query.in("ram_gb", f.ram);
  if (f.max) query = query.lte("retail_price", f.max);
  if (f.wholesale) query = query.not("wholesale_price", "is", null);

  switch (f.sort) {
    case "price-asc":
      query = query.order("retail_price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("retail_price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const from = (f.page - 1) * PAGE_SIZE;
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("searchProducts:", error.message);
    return { products: [] as Product[], total: 0 };
  }
  return { products: (data ?? []) as Product[], total: count ?? 0 };
}