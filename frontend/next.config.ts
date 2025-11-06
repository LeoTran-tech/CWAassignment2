// assi2/frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',       // tells Next.js to create a static export (replaces `next export`)
  images: {
    unoptimized: true     // disable image optimization (needed for S3)
  },
  trailingSlash: true
};

export default nextConfig;
