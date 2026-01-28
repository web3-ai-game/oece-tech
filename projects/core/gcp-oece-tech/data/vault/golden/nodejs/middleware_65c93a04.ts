import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  const response = NextResponse.next();

  // Always ensure cookie is set
  if (locale !== request.cookies.get('NEXT_LOCALE')?.value) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.).*)',
  ],
};
