import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash expects the window as a string literal like '1 m', which is valid
const windowDuration = (process.env.RATE_LIMIT_WINDOW as '1 m' | '1 s' | '1 h' | '1 d') || '1 m';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_REQUESTS || '15', 10),
    windowDuration
  ),
}); 