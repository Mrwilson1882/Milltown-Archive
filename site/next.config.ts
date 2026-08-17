import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Product photography is served from /public today. When bundle photos move
    // to a CDN or CMS, add its hostname here.
    remotePatterns: [],
  },
};

export default nextConfig;
