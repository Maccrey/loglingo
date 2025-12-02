import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing, {
  // Respect the browser's Accept-Language on first visit and keep using it
  localeDetection: true
});

export default function middleware(request: Request) {
  // Enforce HTTPS in production environments (no-op locally)
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = new URL(request.url);
    url.protocol = "https:";
    return NextResponse.redirect(url.toString(), 301);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en|ja|zh|th|vi|id|es|pt|fr|de|tr|ar|hi)/:path*']
};
