"use client";

import { useSyncExternalStore } from "react";
import {
  CART_CHANGED_EVENT,
  CART_STORAGE_KEY,
  parseCart,
  type CartLine,
} from "@/lib/cart";

/**
 * The bag, as an external store.
 *
 * localStorage genuinely is external state — another component, another tab or
 * the user's own devtools can change it underneath React — so it is subscribed
 * to rather than copied into state in an effect.
 *
 * The snapshot has to be referentially stable or React re-renders forever, so
 * the parsed bag is cached against the raw string it came from and only
 * rebuilt when that string actually changes.
 */

const EMPTY: CartLine[] = [];

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function getSnapshot(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    // Private browsing or blocked site data: an empty bag is the right answer.
    return EMPTY;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parseCart(raw);
  }
  return cachedLines;
}

/** Nothing is in the bag on the server, so the first paint matches the markup. */
function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) onChange();
  };

  window.addEventListener(CART_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CART_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** No-op store whose only job is to say whether we are past hydration. */
const noopSubscribe = () => () => {};

export function useCart(): { lines: CartLine[]; ready: boolean; refresh: () => void } {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Every mutation in lib/cart fires the change event, so a manual refresh is
  // only kept for callers that want to be explicit about it.
  const refresh = () => window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));

  return { lines, ready, refresh };
}
