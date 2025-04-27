import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAdmin = request.cookies.get('isAdmin')?.value || '';

  const { pathname } = request.nextUrl;

  // Biar /admin/login boleh diakses tanpa harus login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
