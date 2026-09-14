"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/useCart";
import { cartCount } from "@/lib/cart";
import { primaryNav } from "@/config/site";

export type NavSection = { slug: string; name: string; count: number };

function BagIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 6.5h12l-1 10.5H5L4 6.5Z" strokeLinejoin="round" />
      <path d="M7.25 6.5V5a2.75 2.75 0 0 1 5.5 0v1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="9" cy="9" r="5.25" />
      <path d="m13 13 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Header({ types }: { types: NavSection[] }) {
  const pathname = usePathname();
  const { lines, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const shopMenu = useRef<HTMLDivElement>(null);

  // Any navigation closes everything — otherwise the mobile menu stays open
  // over the page it just moved to. Adjusted during render rather than in an
  // effect, so the new page never paints once with the old menu over it.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
  }

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  // Escape closes whichever layer is open, and a click outside closes the
  // shop panel — both are what a keyboard and a mouse expect respectively.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
      setShopOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!shopMenu.current?.contains(event.target as Node)) setShopOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const count = ready ? cartCount(lines) : 0;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b rule bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="-ml-2 p-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            {menuOpen ? (
              <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <Logo className="shrink-0" />

        <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div ref={shopMenu} className="relative">
            <button
              type="button"
              onClick={() => setShopOpen((open) => !open)}
              className={`flex items-center gap-1 py-2 text-sm transition-colors hover:text-brick ${
                isActive("/shop") ? "text-brick" : ""
              }`}
              aria-expanded={shopOpen}
            >
              Shop
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="m3 4.5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {shopOpen && (
              <div className="absolute left-0 top-full w-72 border rule bg-paper p-2 shadow-lg shadow-ink/5">
                <Link
                  href="/shop"
                  className="flex items-baseline justify-between px-3 py-2 text-sm hover:bg-paper-2"
                >
                  <span>Everything</span>
                </Link>
                <div className="my-1 border-t rule" />
                {types.map((type) => (
                  <Link
                    key={type.slug}
                    href={`/shop/${type.slug}`}
                    className="flex items-baseline justify-between px-3 py-2 text-sm hover:bg-paper-2"
                  >
                    <span>{type.name}</span>
                    <span className="numeric text-xs text-ink-3">{type.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {primaryNav
            .filter((link) => link.href !== "/shop")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-sm transition-colors hover:text-brick ${
                  isActive(link.href) ? "text-brick" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="p-2 transition-colors hover:text-brick"
            aria-expanded={searchOpen}
            aria-controls="header-search"
            aria-label="Search the archive"
          >
            <SearchIcon />
          </button>

          <Link
            href="/cart"
            className="relative p-2 transition-colors hover:text-brick"
            aria-label={count > 0 ? `Bag, ${count} item${count === 1 ? "" : "s"}` : "Bag, empty"}
          >
            <BagIcon />
            {count > 0 && (
              <span className="numeric absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-brick px-1 text-[0.625rem] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div id="header-search" className="border-t rule bg-paper">
          <form
            action="/search"
            className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-10"
            role="search"
          >
            <SearchIcon />
            <input
              ref={searchInput}
              type="search"
              name="q"
              placeholder="Lacoste polo, size 12, track jacket…"
              className="w-full bg-transparent py-1 text-base outline-none placeholder:text-ink-3"
              aria-label="Search the archive"
            />
            <button type="submit" className="eyebrow hover:text-brick">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav id="mobile-nav" className="border-t rule bg-paper lg:hidden" aria-label="Primary">
          <div className="max-h-[70vh] overflow-y-auto px-4 py-3 sm:px-6">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block border-b rule py-3 text-base last:border-b-0"
              >
                {link.label}
              </Link>
            ))}

            <p className="eyebrow pt-5">Categories</p>
            <div className="grid grid-cols-2 gap-x-4">
              {types.map((type) => (
                <Link key={type.slug} href={`/shop/${type.slug}`} className="py-2 text-sm">
                  {type.name}{" "}
                  <span className="numeric text-xs text-ink-3">{type.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
