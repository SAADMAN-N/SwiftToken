import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

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
  
  // Log the current state for debugging
  logger.debug('Rate limit check:', {
    ip,
    path: request.nextUrl.pathname,
    currentCount: currentLimit?.count ?? 0,
    timestamp: currentLimit?.timestamp,
    windowStart
  });

  if (currentLimit) {
    if (currentLimit.timestamp < windowStart) {
      // Reset if window has passed
      logger.info('Rate limit window reset for IP:', ip);
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else if (currentLimit.count >= REQUESTS_PER_MINUTE) {
      // Log rate limit exceeded
      logger.warn('Rate limit exceeded:', {
        ip,
        path: request.nextUrl.pathname,
        requestCount: currentLimit.count,
        limit: REQUESTS_PER_MINUTE,
        windowStart: new Date(windowStart).toISOString(),
        windowEnd: new Date(now).toISOString()
      });

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': REQUESTS_PER_MINUTE.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(windowStart / 1000).toString()
          }
        }
      );
    } else {
      currentLimit.count++;
      logger.debug('Request count incremented:', {
        ip,
        newCount: currentLimit.count
      });
    }
  } else {
    logger.debug('New rate limit entry created for IP:', ip);
    rateLimit.set(ip, { count: 1, timestamp: now });
  }

  // Add rate limit headers to all responses
  const response = NextResponse.next();
  const remaining = currentLimit 
    ? Math.max(0, REQUESTS_PER_MINUTE - currentLimit.count) 
    : REQUESTS_PER_MINUTE - 1;

  response.headers.set('X-RateLimit-Limit', REQUESTS_PER_MINUTE.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(windowStart / 1000).toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
