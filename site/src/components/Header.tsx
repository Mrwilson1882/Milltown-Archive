"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/useCart";
import { navLinks, siteConfig } from "@/config/site";

function CartCount() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[0.65rem] font-bold text-paper">
      {itemCount}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  // The menu is remembered against the page it was opened on, so navigating
  // anywhere closes it without needing an effect to chase the route.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-ash bg-paper/95 backdrop-blur">
      <div className="bg-forest text-paper">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[0.7rem] font-semibold tracking-[0.14em] uppercase sm:px-6">
          <span className="sm:hidden">UK vintage clothing wholesale</span>
          <span className="hidden sm:inline">
            UK vintage clothing wholesale · Boxes, lots &amp; by the kilo · Shipped from{" "}
            {siteConfig.location}
          </span>
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Archive Wholesale — home">
          <Logo size="md" priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative py-1 text-sm font-bold tracking-wide uppercase transition-colors hover:text-forest ${
                isActive(link.href) ? "text-forest" : "text-ink"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-0.5 bg-forest transition-transform ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="inline-flex items-center border-2 border-ink px-4 py-2 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
          >
            Cart
            <CartCount />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center border-2 border-ink px-3 py-2 text-sm font-bold tracking-wide uppercase lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-ash lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-ash last:border-b-0">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block py-3.5 text-base font-bold tracking-wide uppercase ${
                    isActive(link.href) ? "text-forest" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
