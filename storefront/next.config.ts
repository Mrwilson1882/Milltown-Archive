import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Listing photography is served from /public/images/products, dropped in
    // from the same zip Crosslist uploads. Add a hostname here if photos ever
    // move to a CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
