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
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
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
