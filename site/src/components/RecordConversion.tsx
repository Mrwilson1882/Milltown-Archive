"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

/**
 * Fires once when Stripe returns the customer to the success page, tagged with
 * the source that brought them.
 *
 * Stripe's metadata is the authoritative record of a sale and its source. This
 * event is the convenient one: it puts completed orders next to
 * `checkout_start` in Vercel Analytics, so the conversion rate of a campaign
 * can be read without cross-referencing the Stripe dashboard.
 *
 * A guard stops a refresh of the success page counting as a second sale.
 */
export function RecordConversion() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const attribution = getAttribution();
    trackEvent("checkout_complete", {
      source: attribution.last_source ?? attribution.first_source ?? "direct",
      campaign: attribution.last_campaign ?? attribution.first_campaign,
      ref: attribution.ref,
    });
  }, []);

  return null;
}
