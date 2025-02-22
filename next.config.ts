import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', '@heroicons/react'],
  },
  
  // Configure compression and performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Configure headers for better security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
