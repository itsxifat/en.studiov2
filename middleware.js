import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// This function checks if the user's cookie is valid
async function verifySession(token) {
  if (!token || !JWT_SECRET_KEY) return false;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    // This verifies the cookie's signature and expiration
    await jwtVerify(token, secret);
    return true; // Token is valid
  } catch (e) {
    console.error("JWT Verification failed:", e.message);
    return false; // Token is invalid or expired
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Define all paths that need protection
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  
  // 2. Define paths that are *always* public (to prevent redirect loops)
  const isPublicAuthPath = 
    pathname.startsWith('/admin/login') || 
    pathname.startsWith('/api/admin/login');

  // If it's a protected path but NOT the public login page...
  if (isAdminPath && !isPublicAuthPath) {
    // 3. Get the session cookie
    const sessionCookie = request.cookies.get('admin-session')?.value;

    // 4. Verify the session
    const isValidSession = await verifySession(sessionCookie);

    // 5. If session is invalid, block the request
    if (!isValidSession) {
      // If it's an API call, return 401 Unauthorized
      if (pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized: Access is denied.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // If it's a page, redirect to the login page
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 6. If session is valid OR it's not a protected path, let the request continue
  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*', // Protects all admin pages
    '/api/admin/:path*', // Protects all admin APIs
  ],
};