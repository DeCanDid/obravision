"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Laptop, LogOut, MapPin, Menu, Phone, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import UserAvatar, { displayName } from "@/components/UserAvatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { itemCount } = useCart();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const waHref = whatsappLink("Hello Obravision, I would like to enquire about your laptops.");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      {/* Row 1: contact bar */}
      <div className="hidden bg-ink text-white/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="text-gold" />
            Retail &amp; wholesale laptops &middot; Victoria Island, Lagos
          </p>
          <a href={`tel:${site.phone.tel}`} className="flex items-center gap-2 transition-colors hover:text-gold">
            <Phone size={14} className="text-gold" />
            Call us: {site.phone.display}
          </a>
        </div>
      </div>

      {/* Row 2: main navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20">
        <Link href="/" className="flex items-center" aria-label={`${site.name} home`}>
  <Image
    src="/obra-logo.png"
    alt={site.name}
    width={171}
    height={40}
    priority
    className="h-9 w-auto lg:h-10"
  />
</Link>

        

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-ink after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold"
                      : "text-ink/70 hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Obravision on WhatsApp"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1faa59] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a47] xl:px-5"
          >
            <WhatsAppIcon size={18} />
            <span className="hidden xl:inline">Chat on WhatsApp</span>
          </a>

          {/* Account (desktop) */}
          {authLoading ? (
            <span className="hidden h-10 w-28 animate-pulse rounded-full bg-paper lg:block" />
          ) : user ? (
            <div ref={menuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="flex h-10 items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-medium transition hover:border-ink"
              >
                <UserAvatar user={user} size={32} />
                <span className="max-w-[7rem] truncate">{displayName(user)}</span>
                <ChevronDown size={15} className={clsx("transition-transform", menuOpen && "rotate-180")} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-64 animate-fade-in overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-ink/10"
                >
                  <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-4">
                    <UserAvatar user={user} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{displayName(user)}</p>
                      <p className="truncate text-xs text-ink/60">{user.email}</p>
                    </div>
                  </div>
                  <Link role="menuitem" href="/account" className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-paper">
                    <UserIcon size={16} /> My account
                  </Link>
                  <Link role="menuitem" href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-paper">
                    <ShoppingCart size={16} /> My cart
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/account"
              className={clsx(
                "hidden h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors lg:inline-flex",
                isActive("/account") ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"
              )}
            >
              <UserIcon size={17} />
              Account
            </Link>
          )}

          <Link
            href="/cart"
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile and tablet menu */}
      <div
        id="mobile-menu"
        className={clsx(
          "max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden",
          !open && "hidden"
        )}
      >
        <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-paper p-4">
              <UserAvatar user={user} size={44} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName(user)}</p>
                <p className="truncate text-xs text-ink/60">{user.email}</p>
              </div>
            </div>
          )}

          <ul className="divide-y divide-line">
            {[
              ...site.nav,
              { label: "My Account", href: "/account" },
              { label: "My Cart", href: "/cart" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "flex items-center justify-between py-3.5 text-base font-medium",
                    isActive(item.href) ? "text-gold-deep" : "text-ink"
                  )}
                >
                  {item.label}
                  {item.href === "/cart" && itemCount > 0 && (
                    <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-ink">{itemCount}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600"
            >
              <LogOut size={16} /> Sign out
            </button>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${site.phone.tel}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-ink py-3 text-sm font-semibold text-ink"
            >
              <Phone size={17} />
              Call {site.phone.display}
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1faa59] py-3 text-sm font-semibold text-white"
            >
              <WhatsAppIcon size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}