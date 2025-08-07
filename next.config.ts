// next.config.ts
import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Cho phép production builds chạy tiếp dù có ESLint errors
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Cho phép production build kể cả khi TS errors
    ignoreBuildErrors: true,
  },

  experimental: {
    inlineCss: true,
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
