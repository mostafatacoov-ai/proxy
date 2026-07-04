import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip public files and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/videos') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Handle preview bypass
  const isPreview = searchParams.get('preview') === 'proxy2026';
  const hasPreviewCookie = request.cookies.get('preview_access')?.value === 'true';

  if (isPreview) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('preview');
    const response = NextResponse.redirect(url);
    response.cookies.set('preview_access', 'true', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return response;
  }

  // Determine the locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const locale = pathnameHasLocale
    ? pathname.split('/')[1]
    : defaultLocale;

  // Coming Soon logic: if no preview cookie and not already on coming-soon page, rewrite to coming-soon
  const isComingSoonPage = pathname.endsWith('/coming-soon');
  if (!hasPreviewCookie && !isComingSoonPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/coming-soon`;
    return NextResponse.rewrite(url);
  }

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};

