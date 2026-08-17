"use client";

import { useEffect } from "react";
import { useCart } from "@/components/useCart";

/** Empties the basket once Stripe has bounced the customer back paid. */
export function ClearCartOnMount() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
