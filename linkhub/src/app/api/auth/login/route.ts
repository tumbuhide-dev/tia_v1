import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

// Simple in-memory rate limiter (per process, for dev only)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };
  if (now - entry.last > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  rateLimitMap.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

// Zod schema for login (see PROMPT_ALL.txt)
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    // Manual rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.' }, { status: 429 });
    }

    // Validate input
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }
    const { email, password } = parsed.data;

    // Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
      }
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json({ error: 'Email Anda belum diverifikasi. Silakan cek email Anda.' }, { status: 403 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check email verification status
    const emailVerified = data.user?.email_confirmed_at ? true : false;

    // Check if user profile is complete (username exists in users table)
    let profileComplete = false;
    if (data.user?.id) {
      const { data: userRow } = await supabase
        .from('users')
        .select('username')
        .eq('id', data.user.id)
        .single();
      profileComplete = !!userRow?.username;
    }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      emailVerified,
      profileComplete,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
} 