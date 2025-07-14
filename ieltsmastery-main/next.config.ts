import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "standalone", // Required for SSR/ISR on Vercel
  distDir: '.next',    // Explicitly set (Vercel sometimes ignores defaults)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
