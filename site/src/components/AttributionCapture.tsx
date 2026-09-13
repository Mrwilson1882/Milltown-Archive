"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records where the visitor came from, once, on the first paint of the first
 * page they land on. Mounted in the root layout so it runs whichever page the
 * ad points at.
 *
 * It reads `window.location.search` directly rather than `useSearchParams`,
 * which would opt every page into client-side rendering for the sake of a
 * value we only need after hydration anyway.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
