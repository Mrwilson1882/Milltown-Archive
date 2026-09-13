"use client";

import { useSyncExternalStore } from "react";
import { getRefSnapshot, getServerRefSnapshot, subscribeRef } from "@/lib/attribution";

/**
 * The visitor's reference code, available after hydration.
 *
 * It starts empty on purpose: the code lives in localStorage, which the server
 * cannot see, so returning it on the first render would mean the server and
 * the browser disagree about the markup. The links it feeds are correct from
 * the moment they can be tapped.
 */
export function useAttributionRef(): string {
  return useSyncExternalStore(subscribeRef, getRefSnapshot, getServerRefSnapshot);
}

/**
 * Sign a pre-filled enquiry with the reference code, so a WhatsApp chat that
 * closes weeks later can still be traced back to the ad that started it.
 */
export function withRef(message: string, ref: string): string {
  return ref ? `${message}\n\nRef: ${ref}` : message;
}
