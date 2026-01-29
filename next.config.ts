import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Proxy runs in Edge runtime
  },
  // Exclude problematic dependencies from Edge runtime
  serverExternalPackages: ['firebase-admin'],
  // Suppress performance measurement warnings in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
