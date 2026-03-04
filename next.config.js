/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.app', 'codevibinggallery.vercel.app'],
  },
  async redirects() {
    return [
      {
        source: '/physics',
        destination: 'https://learnvibecoding.vercel.app/physicsdemo',
        permanent: false,
      },
      {
        source: '/physics/:path*',
        destination: 'https://learnvibecoding.vercel.app/physicsdemo/:path*',
        permanent: false,
      },
      {
        source: '/learnvibecoding',
        destination: 'https://learnvibecoding.vercel.app',
        permanent: false,
      },
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