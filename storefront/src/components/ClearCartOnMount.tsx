"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

/** Empties the bag once the payment has gone through. */
export function ClearCartOnMount() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
