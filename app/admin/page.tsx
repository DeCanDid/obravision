import Link from "next/link";
import { ExternalLink, Laptop, LogOut } from "lucide-react";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import { logoutAction } from "@/app/admin/actions";
import LoginForm from "@/components/admin/LoginForm";
import AddProductForm from "@/components/admin/AddProductForm";
import ProductList, { type AdminProduct } from "@/components/admin/ProductList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const { data } = await createAdminClient()
    .from("products")
    .select("id, slug, name, brand, retail_price, stock, images")
    .order("created_at", { ascending: false })
    .limit(300);

  const products: AdminProduct[] = (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    retail_price: Number(p.retail_price),
    stock: p.stock,
    image: (p.images as string[] | null)?.[0] ?? null,
  }));

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-gold">
              <Laptop size={20} />
            </span>
            <span className="font-display text-lg font-semibold">{site.name} Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink sm:inline-flex"
            >
              View website <ExternalLink size={14} />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <LogOut size={14} /> Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Add a new laptop</h1>
          <p className="mt-2 text-sm text-ink/60">
            Fill in the details and upload photos. The laptop goes live on the store as soon as you save it.
          </p>
        </div>

        <AddProductForm />

        <ProductList products={products} />
      </main>
    </>
  );
}