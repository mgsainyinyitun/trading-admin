import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export async function validateToken(token: string) {
  // Here you would:
  // 1. Verify JWT token
  // 2. Return decoded user data
  // For demo, we'll return mock data
  return {
    id: '1',
    email: 'john@example.com',
  };
}

export async function authenticateRequest(req: NextRequest) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return null;
  }
  return validateToken(token);
}