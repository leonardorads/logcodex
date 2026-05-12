import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/logcodex',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/logcodex',
  },
};

export default nextConfig;
