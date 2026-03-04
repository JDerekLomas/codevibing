/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.app', 'codevibinggallery.vercel.app'],
  },
  async redirects() {
    return [
      { source: '/physics', destination: '/c/physics', permanent: false },
      { source: '/learnvibecoding', destination: '/c/learnvibecoding', permanent: false },
    ];
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