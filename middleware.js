import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAdmin = request.cookies.get('isAdmin')?.value || '';

  if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
