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
];

/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  turbopack: {
    // Force workspace root to avoid picking up sibling lockfiles (e.g. /Users/maccrey/package-lock.json)
    root: __dirname,
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
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
