import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'tangry_sid';

export async function middleware(request: NextRequest) {
  // Protect /admin: require session cookie (full validation in admin layout)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
