import Link from "next/link";
import { ExternalLink, Laptop, LogOut } from "lucide-react";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/product-utils";
import { site } from "@/lib/site";
import { logoutAction } from "@/app/admin/actions";
import LoginForm from "@/components/admin/LoginForm";
import AddProductForm from "@/components/admin/AddProductForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const { data: recent } = await createAdminClient()
    .from("products")
    .select("id, slug, name, brand, retail_price, stock, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

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

        {recent && recent.length > 0 && (
          <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Recently added</h2>
            <ul className="mt-4 divide-y divide-line">
              {recent.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-semibold">{p.name}</p>
                    <p className="text-xs text-ink/55">
                      {p.brand} &middot; {formatNaira(Number(p.retail_price))} &middot; {p.stock} in stock
                    </p>
                  </div>
                  <Link href={`/laptops/${p.slug}`} target="_blank" className="font-semibold text-brand hover:underline">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}