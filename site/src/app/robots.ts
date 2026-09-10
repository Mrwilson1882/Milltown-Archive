import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing to index in a basket or a payment return page.
        disallow: ["/cart", "/checkout/", "/api/"],
      },
      // AI search and answer engines, named so nobody can mistake the default
      // for an oversight. ChatGPT search is built on OAI-SearchBot and Bing's
      // index; Perplexity, Claude, Google's AI features and Apple's each have
      // their own. Same allow as everyone else — this is the shop window.
      ...[
        "OAI-SearchBot",
        "ChatGPT-User",
        "GPTBot",
        "PerplexityBot",
        "Perplexity-User",
        "ClaudeBot",
        "Claude-SearchBot",
        "Claude-User",
        "anthropic-ai",
        "Google-Extended",
        "Googlebot",
        "Bingbot",
        "Applebot",
        "Applebot-Extended",
        "DuckAssistBot",
        "CCBot",
      ].map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/cart", "/checkout/", "/api/"],
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
