import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserFromRequest(req: NextRequest) {
  // Try to get token from Authorization header
  const authHeader = req.headers.get('authorization');
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '');
  } else {
    // Try to get from cookie (supabase-auth-token)
    const cookie = req.cookies.get('sb-access-token')?.value;
    if (cookie) token = cookie;
  }
  if (!token) return null;
  // Validate token with Supabase
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
} 