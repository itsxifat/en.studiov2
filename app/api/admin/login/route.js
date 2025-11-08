import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!adminPassword || !jwtSecret) {
      throw new Error('Server environment is not configured for auth.');
    }

    // 1. Check if the password is correct
    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password.' }, { status: 401 });
    }

    // 2. Create a session payload
    const payload = { isAdmin: true, sub: 'admin' };
    
    // 3. Create a secure JWT (session token)
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Session lasts for 1 day
      .sign(secret);

    // 4. Set the token in a secure, HttpOnly cookie
    cookies().set('admin-session', token, {
      httpOnly: true, // Prevents client-side JS from reading it
      secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'An error occurred.' }, { status: 500 });
  }
}