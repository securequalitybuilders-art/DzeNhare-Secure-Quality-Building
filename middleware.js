import { NextResponse } from 'next/server';

export function middleware(request) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const hasSupabaseAuthCookie = request.cookies.get('sb-nuojygteaorcuskoazap-auth-token');

  if (!hasSupabaseAuthCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
