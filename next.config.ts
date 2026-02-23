import createNextIntlPlugin from 'next-intl/plugin';
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "firebasestorage.googleapis.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "logling-34fc9.firebasestorage.app",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  outputFileTracingRoot: __dirname,

  // firebase-admin은 Node.js 전용 패키지이므로 번들링에서 제외
  // Cloud Functions 환경에서 직접 node_modules에서 resolve 됨
  serverExternalPackages: ['firebase-admin', 'firebase-functions'],
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, immutable" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
