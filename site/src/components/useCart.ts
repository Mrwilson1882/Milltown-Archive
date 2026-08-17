"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CART_STORAGE_KEY, cartTotals, parseStoredCart, resolveLines, type CartLine } from "@/lib/cart";

/**
 * The basket lives in localStorage and is read through useSyncExternalStore, so
 * every component sees the same cart, a second tab stays in step, and the
 * server render has a defined empty snapshot to hydrate from.
 */

const EMPTY = "[]";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY;
  } catch {
    // Private browsing, or storage disabled. An empty basket beats a crash.
    return EMPTY;
  }
}

function write(lines: CartLine[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Nothing useful to do — the in-memory render below still updates.
  }
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // Fires for writes made in other tabs.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useCart() {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const lines = useMemo(() => parseStoredCart(raw), [raw]);

  const add = useCallback(
    (slug: string, qty = 1) => {
      const current = parseStoredCart(read());
      const existing = current.find((l) => l.slug === slug);
      write(
        existing
          ? current.map((l) =>
              l.slug === slug ? { ...l, qty: Math.min(99, l.qty + Math.max(1, qty)) } : l,
            )
          : [...current, { slug, qty: Math.max(1, Math.min(99, qty)) }],
      );
    },
    [],
  );

  const setQty = useCallback((slug: string, qty: number) => {
    const current = parseStoredCart(read());
    write(
      qty <= 0
        ? current.filter((l) => l.slug !== slug)
        : current.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    write(parseStoredCart(read()).filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  const itemCount = useMemo(() => cartTotals(resolveLines(lines)).itemCount, [lines]);

  return { lines, itemCount, add, setQty, remove, clear };
}
