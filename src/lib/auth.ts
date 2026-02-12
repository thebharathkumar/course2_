import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pace-course-equivalency-secret-key-2024';

export function createToken(payload: { username: string; id: number }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { username: string; id: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string; id: number };
  } catch {
    return null;
  }
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith('auth_token='));
  if (!authCookie) return null;
  return authCookie.split('=')[1];
}
