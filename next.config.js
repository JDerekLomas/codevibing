/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['localhost', 'vercel.app'],
  },

  // Enable strict mode for better development practices
  reactStrictMode: true,

  // Static file serving configuration
  experimental: {
    // Enable static serving
    isrMemoryCacheSize: 0,
    // Ensure correct static paths
    appDir: true,
    serverActions: true,
  },

  // Source maps for better debugging
  productionBrowserSourceMaps: true,

  // Customize compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Static optimization
  poweredByHeader: false,
  compress: true,
}