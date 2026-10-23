"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearFailures, isLocked, recordFailure } from "@/lib/rate-limit";
import { createAdminSession, destroyAdminSession, isAdmin, safeEqual } from "@/lib/admin-auth";

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
  images: string[];
};

type CreateResult = { ok: true; slug: string } | { ok: false; error: string };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const optionalText = (v: unknown, max: number) => clean(v, max) || null;
const num = (v: string) => (v.trim() === "" ? null : Number(v));

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
  if (!(await isAdmin())) return { ok: false, error: NOT_ALLOWED };

  const name = clean(input.name, 200);
  const shortDescription = clean(input.shortDescription, 300);
  const description = clean(input.description, 5000);

  if (name.length < 10) return { ok: false, error: "Please enter the full product name (brand, model and key specs)." };
  if (!site.brands.includes(input.brand)) return { ok: false, error: "Please choose a valid brand." };
  if (!CONDITIONS.includes(input.condition)) return { ok: false, error: "Please choose a valid condition." };
  if (shortDescription.length < 20) return { ok: false, error: "The short description should be at least 20 characters." };
  if (description.length < 50) return { ok: false, error: "The full description should be at least 50 characters." };

  const retail = num(input.retailPrice);
  if (retail === null || !Number.isFinite(retail) || retail <= 0) return { ok: false, error: "Please enter a valid retail price." };

  const wholesale = num(input.wholesalePrice);
  if (wholesale !== null && (!Number.isFinite(wholesale) || wholesale <= 0 || wholesale > retail)) {
    return { ok: false, error: "The wholesale price must be a valid amount that is not higher than the retail price." };
  }
  const minQty = Math.floor(num(input.wholesaleMinQty) ?? 5);
  if (wholesale !== null && (minQty < 2 || minQty > 999)) {
    return { ok: false, error: "The wholesale minimum quantity must be between 2 and 999." };
  }

  const stock = Math.floor(num(input.stock) ?? 0);
  if (stock < 0 || stock > 100000) return { ok: false, error: "Please enter a valid stock quantity." };

  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const images = Array.isArray(input.images) ? input.images : [];
  if (images.length < 1 || images.length > MAX_IMAGES || !images.every((u) => typeof u === "string" && u.startsWith(prefix))) {
    return { ok: false, error: "Please upload between 1 and 6 product images." };
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
    ram_gb: num(input.ramGb),
    storage_gb: num(input.storageGb),
    storage_type: optionalText(input.storageType, 20),
    screen_size: num(input.screenSize),
    gpu: optionalText(input.gpu, 120),
    os: optionalText(input.os, 60),
    stock,
    images,
    featured: Boolean(input.featured),
    is_active: true,
  });

  if (error) {
    console.error("create product:", error.message);
    return { ok: false, error: "The product could not be saved. Please check the details and try again." };
  }

  revalidatePath("/");
  revalidatePath("/laptops");
  revalidatePath("/sitemap.xml");

  return { ok: true, slug };
}