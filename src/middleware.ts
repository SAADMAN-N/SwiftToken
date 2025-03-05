import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REQUESTS_PER_MINUTE = 60;
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  // Skip rate limiting for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window

  const currentLimit = rateLimit.get(ip);
  if (currentLimit) {
    if (currentLimit.timestamp < windowStart) {
      // Reset if window has passed
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else if (currentLimit.count >= REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    } else {
      currentLimit.count++;
    }
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};