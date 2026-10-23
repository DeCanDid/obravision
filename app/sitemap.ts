import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await createPublicClient()
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true);

  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/laptops`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const brands: MetadataRoute.Sitemap = site.brands.map((b) => ({
    url: `${site.url}/laptops?brand=${encodeURIComponent(b)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const products: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
    url: `${site.url}/laptops/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...brands, ...products];
}