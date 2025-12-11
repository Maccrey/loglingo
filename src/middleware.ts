import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware({
  ...routing,
  // Respect the browser's Accept-Language on first visit and keep using it
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";

  // Redirect loglingo.com to www.loglingo.com
  if (process.env.NODE_ENV === "production" && hostname === "loglingo.com") {
    url.hostname = "www.loglingo.com";
    return NextResponse.redirect(url.toString(), 301);
  }

  // Enforce HTTPS in production environments (no-op locally)
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    url.protocol = "https:";
    return NextResponse.redirect(url.toString(), 301);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en|ja|zh|th|vi|id|es|pt|fr|de|tr|ar|hi)/:path*']
};
