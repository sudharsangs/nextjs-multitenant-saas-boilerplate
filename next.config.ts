import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for Docker
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
