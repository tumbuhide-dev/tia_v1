import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/auth/session
 * Returns user session info (safe for frontend):
 * { id, email, role, username, profile_completed }
 * Does NOT expose any sensitive data or URLs.
 */
export async function GET(req: NextRequest) {
  // Get access token from cookies (Next.js App Router)
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return NextResponse.json({ user: null });
  }
  // Validate session with Supabase
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json({ user: null });
  }
  // Extract safe user info
  const { id, email, user_metadata } = data.user;
  return NextResponse.json({
    user: {
      id,
      email,
      role: user_metadata?.account_type || null,
      username: user_metadata?.username || null,
      profile_completed: user_metadata?.profile_completed || false,
    },
  });
} 