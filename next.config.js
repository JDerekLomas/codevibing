const LEARN_DEST = 'https://learnvibecoding.vercel.app';

// All learnvibecoding page routes to proxy
const LEARN_PAGE_ROUTES = [
  '/curriculum/:path*',
  '/concepts/:path*',
  '/quiz/:path*',
  '/quiz-chat/:path*',
  '/discover',
  '/voice/:path*',
  '/skill-map',
  '/claude-code/:path*',
  '/journey/:path*',
  '/connect',
  '/physicsdemo/:path*',
  '/teams/:path*',
  '/dashboard/:path*',
  '/sessions/:path*',
  '/know-yourself/:path*',
  '/workflow/:path*',
  '/build/:path*',
  '/debugging/:path*',
  '/shipping/:path*',
  '/enlightenment/:path*',
  '/first-build',
  '/for-developers',
  '/for-your-role',
  '/strategy',
  '/level-up',
  '/join/:slug',
];

// All learnvibecoding API routes to proxy
const LEARN_API_ROUTES = [
  '/api/chat/:path*',
  '/api/quiz-chat/:path*',
  '/api/physics-chat/:path*',
  '/api/physics-quiz-chat/:path*',
  '/api/physics-sessions/:path*',
  '/api/teams/:path*',
  '/api/cv-auth/:path*',
];

// Static assets
const LEARN_STATIC_ROUTES = [
  '/textures/:path*',
];

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
  async rewrites() {
    const learnRewrites = [
      ...LEARN_PAGE_ROUTES,
      ...LEARN_API_ROUTES,
      ...LEARN_STATIC_ROUTES,
    ].map((source) => ({
      source,
      destination: `${LEARN_DEST}${source}`,
    }));

    return {
      afterFiles: learnRewrites,
    };
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