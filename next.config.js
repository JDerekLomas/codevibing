/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,

  // Static optimization
  poweredByHeader: false,
  compress: true,

  // Ensure proper static asset handling
  assetPrefix: undefined,
  
  // Customize webpack for production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        default: false,
        vendors: false,
      };
    }
    return config;
  },
}