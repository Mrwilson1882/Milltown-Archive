"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { SearchBox, SearchIcon } from "@/components/SearchBox";
import { useCart } from "@/components/useCart";
import { navLinks, siteConfig } from "@/config/site";

function BagIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

/** Count badge pinned to the corner of the bag. Hidden while the basket is empty. */
function CartCount() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[0.65rem] font-bold text-paper">
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
  // Search follows the same rule, and the two panels never show together.
  const [searchOpenedOn, setSearchOpenedOn] = useState<string | null>(null);
  const searchOpen = searchOpenedOn === pathname;
  const setSearchOpen = (next: boolean) => {
    setSearchOpenedOn(next ? pathname : null);
    if (next) setOpenedOn(null);
  };

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

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            aria-label={searchOpen ? "Close search" : "Search"}
            className={`inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-forest ${
              searchOpen ? "text-forest" : "text-ink"
            }`}
          >
            <SearchIcon className="h-6 w-6" />
          </button>

          <Link
            href="/cart"
            aria-label="Basket"
            className={`relative inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-forest ${
              isActive("/cart") ? "text-forest" : "text-ink"
            }`}
          >
            <BagIcon />
            <CartCount />
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(!open);
              setSearchOpenedOn(null);
            }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="ml-1 inline-flex items-center border-2 border-ink px-3 py-2 text-sm font-bold tracking-wide uppercase lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div id="site-search" className="border-t border-ash">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="mx-auto max-w-2xl">
              <SearchBox autoFocus onNavigate={() => setSearchOpenedOn(null)} />
            </div>
          </div>
        </div>
      )}

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
