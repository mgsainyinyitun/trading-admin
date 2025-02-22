import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateRequest } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Redirect root /login to /admin/login
  // if (request.nextUrl.pathname === '/login') {
  //   return NextResponse.redirect(new URL('/admin/login', request.url));
  // }

  // Redirect /admin/customer to /admin/customers
  if (request.nextUrl.pathname === '/admin/customer') {
    return NextResponse.redirect(new URL('/admin/customers', request.url));
  }

  // Protected routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/customer')) {
    const user = await authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/customer', '/api/customer/:path*'],
}