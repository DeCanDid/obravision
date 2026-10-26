"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearFailures, isLocked, recordFailure } from "@/lib/rate-limit";
import { createAdminSession, destroyAdminSession, isAdmin, safeEqual } from "@/lib/admin-auth";
import type { Variant } from "@/lib/product-utils";

const BUCKET = "product-images";
const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const CONDITIONS = ["new", "refurbished", "uk-used"];
const NOT_ALLOWED = "Your admin session has expired. Please refresh the page and sign in again.";

/* ---------- Login and logout ---------- */

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  const forwarded = (await headers()).get("x-forwarded-for");
  const key = `admin-login:${forwarded?.split(",")[0].trim() ?? "unknown"}`;

  if (isLocked(key)) {
    return { error: "Too many failed attempts. Please wait 15 minutes and try again." };
  }

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) return { error: "Admin login is not configured on the server." };

  const okUser = safeEqual(String(formData.get("username") ?? ""), adminUser);
  const okPass = safeEqual(String(formData.get("password") ?? ""), adminPass);

  if (!(okUser && okPass)) {
    recordFailure(key);
    return { error: "Incorrect username or password." };
  }

  clearFailures(key);
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin");
}

/* ---------- Image upload (signed URLs, files go straight to Supabase) ---------- */

type UploadTargets =
  | { ok: true; targets: { path: string; token: string }[] }
  | { ok: false; error: string };

export async function getUploadTargets(
  files: { name: string; type: string; size: number }[]
): Promise<UploadTargets> {
  if (!(await isAdmin())) return { ok: false, error: NOT_ALLOWED };
  if (files.length < 1 || files.length > MAX_IMAGES) {
    return { ok: false, error: `Please add between 1 and ${MAX_IMAGES} images.` };
  }

  const admin = createAdminClient();
  const targets: { path: string; token: string }[] = [];

  for (const file of files) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { ok: false, error: "Only JPG, PNG or WebP images are allowed." };
    if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: `"${file.name}" is larger than 5MB.` };

    const path = `products/${Date.now()}-${randomUUID()}.${ext}`;
    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("signed upload url:", error?.message);
      return { ok: false, error: "Could not prepare the image upload. Please try again." };
    }
    targets.push({ path: data.path, token: data.token });
  }

  return { ok: true, targets };
}

/* ---------- Save product ---------- */

export type VariantInput = {
  ramGb: string;
  storageGb: string;
  storageType: string;
  retailPrice: string;
  wholesalePrice: string;
  stock: string;
};

export type ProductInput = {
  name: string;
  brand: string;
  condition: string;
  shortDescription: string;
  description: string;
  retailPrice: string;
  wholesalePrice: string;
  wholesaleMinQty: string;
  processor: string;
  ramGb: string;
  storageGb: string;
  storageType: string;
  screenSize: string;
  gpu: string;
  os: string;
  stock: string;
  featured: boolean;
  variants: VariantInput[];
  images: string[];
};

type CreateResult = { ok: true; slug: string } | { ok: false; error: string };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const optionalText = (v: unknown, max: number) => clean(v, max) || null;
const num = (v: string) => (String(v ?? "").trim() === "" ? null : Number(v));
const bad = (error: string): CreateResult => ({ ok: false, error });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90)
    .replace(/-$/, "");

export async function createProduct(input: ProductInput): Promise<CreateResult> {
  if (!(await isAdmin())) return bad(NOT_ALLOWED);

  const name = clean(input.name, 200);
  const shortDescription = clean(input.shortDescription, 300);
  const description = clean(input.description, 5000);

  if (name.length < 10) return bad("Please enter the full product name (brand, model and key specs).");
  if (!site.brands.includes(input.brand)) return bad("Please choose a valid brand.");
  if (!CONDITIONS.includes(input.condition)) return bad("Please choose a valid condition.");
  if (shortDescription.length < 20) return bad("The short description should be at least 20 characters.");
  if (description.length < 50) return bad("The full description should be at least 50 characters.");

  /* ----- Variations (optional) ----- */
  let variants: Variant[] | null = null;
  const rawVariants = Array.isArray(input.variants) ? input.variants : [];

  if (rawVariants.length > 0) {
    if (rawVariants.length > 8) return bad("You can add up to 8 configurations.");
    const seen = new Set<string>();
    const list: Variant[] = [];

    for (const v of rawVariants) {
      const price = num(v.retailPrice);
      if (price === null || !Number.isFinite(price) || price <= 0) {
        return bad("Each configuration needs a valid retail price.");
      }
      const wholesalePrice = num(v.wholesalePrice);
      if (wholesalePrice !== null && (!Number.isFinite(wholesalePrice) || wholesalePrice <= 0 || wholesalePrice > price)) {
        return bad("A configuration's wholesale price must be a valid amount that is not higher than its retail price.");
      }
      const ram = num(v.ramGb);
      const gb = num(v.storageGb);
      if (ram === null && gb === null) return bad("Each configuration needs a RAM size or a storage size.");
      const stock = Math.floor(num(v.stock) ?? 0);
      if (stock < 0 || stock > 100000) return bad("Please enter a valid stock quantity for each configuration.");

      const type = gb !== null ? optionalText(v.storageType, 20) : null;
      const key = `${ram}-${gb}-${type}`;
      if (seen.has(key)) return bad("Two configurations are identical. Please change or remove one.");
      seen.add(key);

      list.push({
        id: randomUUID().slice(0, 8),
        ram_gb: ram,
        storage_gb: gb,
        storage_type: type,
        retail_price: price,
        wholesale_price: wholesalePrice,
        stock,
      });
    }
    variants = list;
  }

  /* ----- Price, stock and RAM options ----- */
  let retail: number;
  let wholesale: number | null;
  let stock: number;
  let ramOptions: number[];
  const minQty = Math.floor(num(input.wholesaleMinQty) ?? 5);

  if (variants) {
    retail = Math.min(...variants.map((v) => v.retail_price));
    const wholesalePrices = variants.map((v) => v.wholesale_price).filter((x): x is number => x !== null);
    wholesale = wholesalePrices.length ? Math.min(...wholesalePrices) : null;
    stock = variants.reduce((sum, v) => sum + v.stock, 0);
    ramOptions = Array.from(new Set(variants.map((v) => v.ram_gb).filter((x): x is number => x !== null)));
  } else {
    const price = num(input.retailPrice);
    if (price === null || !Number.isFinite(price) || price <= 0) return bad("Please enter a valid retail price.");
    retail = price;

    const w = num(input.wholesalePrice);
    if (w !== null && (!Number.isFinite(w) || w <= 0 || w > retail)) {
      return bad("The wholesale price must be a valid amount that is not higher than the retail price.");
    }
    wholesale = w;

    stock = Math.floor(num(input.stock) ?? 0);
    if (stock < 0 || stock > 100000) return bad("Please enter a valid stock quantity.");

    const ram = num(input.ramGb);
    ramOptions = ram !== null ? [ram] : [];
  }

  if (wholesale !== null && (minQty < 2 || minQty > 999)) {
    return bad("The wholesale minimum quantity must be between 2 and 999.");
  }

  /* ----- Images ----- */
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const images = Array.isArray(input.images) ? input.images : [];
  if (images.length < 1 || images.length > MAX_IMAGES || !images.every((u) => typeof u === "string" && u.startsWith(prefix))) {
    return bad("Please upload between 1 and 6 product images.");
  }

  const admin = createAdminClient();

  // Make the page address unique: name, name-2, name-3...
  const base = slugify(name) || "laptop";
  let slug = base;
  for (let n = 2; n < 50; n++) {
    const { data } = await admin.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${n}`;
  }

  const { error } = await admin.from("products").insert({
    slug,
    name,
    brand: input.brand,
    condition: input.condition,
    short_description: shortDescription,
    description,
    retail_price: retail,
    wholesale_price: wholesale,
    wholesale_min_qty: wholesale !== null ? minQty : null,
    processor: optionalText(input.processor, 120),
    ram_gb: variants ? null : num(input.ramGb),
    storage_gb: variants ? null : num(input.storageGb),
    storage_type: variants ? null : optionalText(input.storageType, 20),
    screen_size: num(input.screenSize),
    gpu: optionalText(input.gpu, 120),
    os: optionalText(input.os, 60),
    stock,
    images,
    featured: Boolean(input.featured),
    is_active: true,
    variants,
    ram_options: ramOptions,
  });

  if (error) {
    console.error("create product:", error.message);
    return bad("The product could not be saved. Please check the details and try again.");
  }

  revalidatePath("/");
  revalidatePath("/laptops");
  revalidatePath("/sitemap.xml");

  return { ok: true, slug };
}