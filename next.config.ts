import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    // This is a development-only option, it will not be included in production builds.
    // It allows requests from the specified origins to access the development server.
  },
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev',
    'https://*.firebase.studio',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
