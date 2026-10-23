"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LogOut, ShoppingCart } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import UserAvatar, { displayName } from "@/components/UserAvatar";
import AuthForm from "@/components/account/AuthForm";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function AccountView({
  next,
  reason,
  authError,
  startForgot
}: {
  next: string;
  reason?: string;
  authError: boolean;
  startForgot: boolean;
}) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { itemCount } = useCart();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-stretch">
        {/* Left: benefits */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-8 text-white sm:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Your {site.name} account</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Save your cart and order laptops faster
            </h1>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              {[
                "Your cart is saved, so it is still there when you log back in",
                "Order single laptops or bulk batches in a few clicks",
                "Get your order confirmed directly with us on WhatsApp",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold">Just browsing?</p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                You do not need an account to look around or ask questions. Message us on WhatsApp any time.
              </p>
              <a
                href={whatsappLink("Hello Obravision, I have a question about your laptops.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1faa59] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#178a47]"
              >
                <WhatsAppIcon size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right: form or profile */}
        <div className="flex flex-col justify-center">
          {authError && (
            <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              That confirmation link is invalid or has expired. Please sign in, or create your account again.
            </p>
          )}

          {loading ? (
            <div className="h-96 animate-pulse rounded-3xl bg-white" />
          ) : user ? (
            <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
              <div className="flex items-center gap-4">
                <UserAvatar user={user} size={72} />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand">Signed in</p>
                  <h2 className="truncate font-display text-2xl font-semibold">{displayName(user)}</h2>
                  <p className="truncate text-sm text-ink/60">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper p-4">
                <p className="text-sm text-ink/70">
                  {itemCount === 0
                    ? "Your cart is empty."
                    : `You have ${itemCount} ${itemCount === 1 ? "laptop" : "laptops"} in your cart.`}
                </p>
                <ShoppingCart size={20} className="text-brand" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/cart"
                  className="rounded-xl bg-brand py-3.5 text-center text-sm font-bold text-white transition hover:bg-brand-deep"
                >
                  View my cart
                </Link>
                <Link
                  href="/laptops"
                  className="rounded-xl border border-ink py-3.5 text-center text-sm font-bold text-ink transition hover:bg-ink hover:text-white"
                >
                  Browse laptops
                </Link>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          ) : (
            <AuthForm next={next} reason={reason} initialMode={startForgot ? "forgot" : "signin"} />
          )}
        </div>
      </div>
    </section>
  );
}