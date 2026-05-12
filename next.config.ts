import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/logcodex',
  images: { unoptimized: true },
};

export default nextConfig;
