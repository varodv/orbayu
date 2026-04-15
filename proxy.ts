import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          },
        );
      }
    }
    catch (error) {
      console.error('Rate limit error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
