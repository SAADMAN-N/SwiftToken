import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  // Allow requests from your domains
  const allowedOrigins = [
    'https://swifttoken.xyz',
    'https://www.swifttoken.xyz',
    // Add any other domains you want to allow
  ];

  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Get the response
  const response = NextResponse.next();

  // Add the CORS headers
  response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
