import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en|ja|zh|th|vi|id|es|pt|fr|de|tr|ar|hi|ru|bn|ur|ne)/:path*']
};
