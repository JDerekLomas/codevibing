/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization and domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
    loader: 'default',
    minimumCacheTTL: 60,
  },

  // Enable strict mode for better development practices
  reactStrictMode: true,

  // Customize webpack config
  webpack: (config) => {
    return config;
  },

  // Disable image optimization in development
  env: {
    optimizeImages: process.env.NODE_ENV === 'production',
  },
}