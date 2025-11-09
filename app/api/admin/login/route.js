export const runtime = 'nodejs' // IMPORTANT for jose stability

import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET_KEY;

    // Must exist in .env
    if (!adminPassword || !jwtSecret) {
      throw new Error('Server environment is not configured for auth.');
    }

    // Validate password
    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password.' }, { status: 401 });
    }

    // Payload
    const payload = { isAdmin: true, sub: 'admin' };

    // Generate token
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    // Set cookie
    cookies().set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'An error occurred.' }, { status: 500 });
  }
}
