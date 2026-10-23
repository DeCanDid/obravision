"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ImagePlus, Loader2, Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";
import { createProduct, getUploadTargets } from "@/app/admin/actions";

type Pic = { id: string; file: File; preview: string };

const initial = {
  name: "",
  brand: "HP",
  condition: "new",
  shortDescription: "",
  description: "",
  retailPrice: "",
  wholesalePrice: "",
  wholesaleMinQty: "5",
  processor: "",
  ramGb: "",
  storageGb: "",
  storageType: "SSD",
  screenSize: "",
  gpu: "",
  os: "",
  stock: "1",
  featured: false,
};

const MAX_IMAGES = 6;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function imageWidth(file: File): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img.naturalWidth);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function AddProductForm() {
  const [form, setForm] = useState(initial);
  const [pics, setPics] = useState<Pic[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<{ slug: string; name: string } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const update = <K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function addFiles(list: FileList | null) {
  if (!list) return;
  setError(null);
  setWarning(null);
  const next: Pic[] = [];

  for (const file of Array.from(list)) {
    if (!TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WebP images are allowed.");
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`"${file.name}" is larger than 5MB. Please choose a smaller photo.`);
      continue;
    }

    const width = await imageWidth(file);
    if (width === 0) {
      setError(`"${file.name}" could not be read. Please try a JPG or PNG photo.`);
      continue;
    }
    if (width < 800) {
      setError(`"${file.name}" is only ${width}px wide and would look blurry. Please use a photo at least 1200px wide.`);
      continue;
    }
    if (width < 1200) {
      setWarning(`"${file.name}" is ${width}px wide. For the sharpest result, use photos at least 1200px wide.`);
    }

    next.push({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) });
  }

  setPics((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
}

  function removePic(id: string) {
    setPics((prev) => {
      const pic = prev.find((p) => p.id === id);
      if (pic) URL.revokeObjectURL(pic.preview);
      return prev.filter((p) => p.id !== id);
    });
  }

  function makeMain(id: string) {
    setPics((prev) => {
      const pic = prev.find((p) => p.id === id);
      return pic ? [pic, ...prev.filter((p) => p.id !== id)] : prev;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAdded(null);

    if (pics.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    setBusy(true);
    try {
      setStatus("Preparing upload…");
      const prep = await getUploadTargets(
        pics.map((p) => ({ name: p.file.name, type: p.file.type, size: p.file.size }))
      );
      if (!prep.ok) throw new Error(prep.error);

      const supabase = createClient();
      const urls: string[] = [];
      for (let i = 0; i < pics.length; i++) {
        setStatus(`Uploading image ${i + 1} of ${pics.length}…`);
        const target = prep.targets[i];
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .uploadToSignedUrl(target.path, target.token, pics[i].file, { contentType: pics[i].file.type });
        if (uploadError) throw new Error("An image failed to upload. Please try again.");
        urls.push(supabase.storage.from("product-images").getPublicUrl(target.path).data.publicUrl);
      }

      setStatus("Saving product…");
      const result = await createProduct({ ...form, images: urls });
      if (!result.ok) throw new Error(result.error);

      setAdded({ slug: result.slug, name: form.name });
      pics.forEach((p) => URL.revokeObjectURL(p.preview));
      setPics([]);
      setForm(initial);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {added && (
        <div role="status" className="flex animate-fade-in flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={20} /> “{added.name}” is now live on the store.
          </span>
          <Link href={`/laptops/${added.slug}`} target="_blank" className="font-bold underline underline-offset-4">
            View product
          </Link>
        </div>
      )}

      <Section title="1. Basic information">
        <Field
          label="Product name"
          className="sm:col-span-2"
          hint="Include the brand, model, processor, RAM and storage. This is the page title Google shows, so a detailed name helps sales."
        >
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder='HP EliteBook 840 G8 | Intel Core i7 11th Gen | 16GB RAM | 512GB SSD | 14"'
            className={`${field} h-12`}
          />
        </Field>
        <Field label="Brand">
          <select value={form.brand} onChange={(e) => update("brand", e.target.value)} className={`${field} h-12`}>
            {site.brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field label="Condition">
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={`${field} h-12`}>
            <option value="new">Brand New</option>
            <option value="refurbished">Refurbished</option>
            <option value="uk-used">UK Used</option>
          </select>
        </Field>
        <Field label="Short description" className="sm:col-span-2" hint="One or two sentences shown on product cards and in Google results.">
          <textarea
            required
            rows={2}
            maxLength={300}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className={`${field} py-3`}
          />
        </Field>
        <Field label="Full description" className="sm:col-span-2" hint="Explain who the laptop is for and what makes it a good buy. Start a new paragraph by pressing Enter.">
          <textarea
            required
            rows={6}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${field} py-3`}
          />
        </Field>
      </Section>

      <Section title="2. Pricing and stock">
        <Field label="Retail price (₦)" hint="Price for a single unit.">
          <input required type="number" min={1} step="any" value={form.retailPrice} onChange={(e) => update("retailPrice", e.target.value)} className={`${field} h-12`} />
        </Field>
        <Field label="Quantity in stock">
          <input required type="number" min={0} step={1} value={form.stock} onChange={(e) => update("stock", e.target.value)} className={`${field} h-12`} />
        </Field>
        <Field label="Wholesale price per unit (₦)" hint="Optional. Leave empty if this laptop is not sold wholesale.">
          <input type="number" min={1} step="any" value={form.wholesalePrice} onChange={(e) => update("wholesalePrice", e.target.value)} className={`${field} h-12`} />
        </Field>
        <Field label="Wholesale minimum quantity" hint="Units a customer must order to get the wholesale price.">
          <input type="number" min={2} step={1} value={form.wholesaleMinQty} onChange={(e) => update("wholesaleMinQty", e.target.value)} className={`${field} h-12`} />
        </Field>
        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-5 w-5 accent-brand" />
          <span className="text-sm font-semibold">Feature this laptop on the home page</span>
        </label>
      </Section>

      <Section title="3. Specifications">
        <Field label="Processor">
          <input value={form.processor} onChange={(e) => update("processor", e.target.value)} placeholder="Intel Core i7 11th Gen" className={`${field} h-12`} />
        </Field>
        <Field label="Memory (RAM)">
          <select value={form.ramGb} onChange={(e) => update("ramGb", e.target.value)} className={`${field} h-12`}>
            <option value="">Not specified</option>
            {[4, 8, 16, 32, 64].map((n) => (
              <option key={n} value={n}>{n}GB</option>
            ))}
          </select>
        </Field>
        <Field label="Storage size">
          <select value={form.storageGb} onChange={(e) => update("storageGb", e.target.value)} className={`${field} h-12`}>
            <option value="">Not specified</option>
            {[128, 256, 512, 1000, 2000].map((n) => (
              <option key={n} value={n}>{n >= 1000 ? `${n / 1000}TB` : `${n}GB`}</option>
            ))}
          </select>
        </Field>
        <Field label="Storage type">
          <select value={form.storageType} onChange={(e) => update("storageType", e.target.value)} className={`${field} h-12`}>
            <option>SSD</option>
            <option>HDD</option>
            <option>eMMC</option>
          </select>
        </Field>
        <Field label="Screen size (inches)">
          <input type="number" min={9} max={21} step="0.1" value={form.screenSize} onChange={(e) => update("screenSize", e.target.value)} placeholder="14" className={`${field} h-12`} />
        </Field>
        <Field label="Graphics">
          <input value={form.gpu} onChange={(e) => update("gpu", e.target.value)} placeholder="Intel Iris Xe Graphics" className={`${field} h-12`} />
        </Field>
        <Field label="Operating system" className="sm:col-span-2">
          <input
            list="os-options"
            value={form.os}
            onChange={(e) => update("os", e.target.value)}
            placeholder="Windows 11 Pro"
            className={`${field} h-12`}
          />
          <datalist id="os-options">
            {["Windows 11 Pro", "Windows 11 Home", "Windows 10 Pro", "macOS", "ChromeOS", "No operating system"].map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </Field>
      </Section>

      <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">4. Product images</h2>
        <p className="mt-1.5 text-sm text-ink/60">
          Add up to {MAX_IMAGES} photos (JPG, PNG or WebP, 5MB each). The first photo is the main image shown on cards.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pics.map((pic, i) => (
            <div key={pic.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pic.preview} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink">Main</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-ink/70 to-transparent p-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                {i !== 0 ? (
                  <button type="button" onClick={() => makeMain(pic.id)} className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold">
                    <Star size={12} /> Make main
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" onClick={() => removePic(pic.id)} aria-label="Remove image" className="grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-red-600">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}

          {pics.length < MAX_IMAGES && (
            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-sm font-semibold text-ink/60 transition hover:border-brand hover:text-brand">
              <ImagePlus size={26} />
              Add photos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
    </section>
          
          {warning && (
            <p className="rounded-xl bg-amber-50 px-5 py-4 text-sm text-amber-800">{warning}</p>
          )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {busy && <Loader2 size={20} className="animate-spin" />}
        {busy ? status || "Working…" : "Add laptop to store"}
      </button>
    </form>
  );
}