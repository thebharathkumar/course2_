import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, username: payload.username });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
