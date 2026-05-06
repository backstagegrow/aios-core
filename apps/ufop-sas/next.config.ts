import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CF_PAGES=1 is set automatically by Cloudflare Pages during build
  output: process.env.CF_PAGES ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
