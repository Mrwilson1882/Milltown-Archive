import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lots used to carry their lot size in the address ("-25", "-20"). Every
  // counted lot now sells in 10 / 25 / 50, so the numbers came out of the
  // slugs. The old addresses live on in WhatsApp threads and Google's index,
  // so they redirect permanently rather than 404.
  async redirects() {
    return [
      { source: "/products/mixed-mens-lacoste-25", destination: "/products/mixed-mens-lacoste", permanent: true },
      { source: "/products/y2k-designer-female-mix-box-20", destination: "/products/y2k-designer-female-mix-box", permanent: true },
      { source: "/products/y2k-designer-male-mix-box-20", destination: "/products/designer-male-mix-box", permanent: true },
      // The men's box was briefly at this address before "Y2K" came out of its name.
      { source: "/products/y2k-designer-male-mix-box", destination: "/products/designer-male-mix-box", permanent: true },
    ];
  },
  images: {
    // Product photography is served from /public today. When bundle photos move
    // to a CDN or CMS, add its hostname here.
    remotePatterns: [],
  },
};

export default nextConfig;
