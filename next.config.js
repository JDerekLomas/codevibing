/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.app'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore pdf-parse test files during build
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'commonjs canvas',
      });
    }
    return config;
  },
};

module.exports = nextConfig;