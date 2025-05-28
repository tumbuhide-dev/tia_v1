import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ratelimit } from '@/lib/utils/rateLimit';
import { AppError, handleApiError } from '@/lib/utils/error';
import { getUserByEmail } from '@/lib/supabase/admin';

const VerifySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      throw new AppError('Terlalu banyak percobaan. Coba lagi nanti.', 429);
    }
    // Validate input
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }
    const { email } = parsed.data;
    // Check user existence and verification status
    const user = await getUserByEmail(email);
    if (!user) {
      throw new AppError('Email tidak ditemukan.', 404);
    }
    if (user.email_confirmed_at) {
      return NextResponse.json({ success: true, verified: true, message: 'Email sudah diverifikasi.' });
    }
    return NextResponse.json({ success: true, verified: false, message: 'Email belum diverifikasi.' });
  } catch (error) {
    return handleApiError(error, req);
  }
} 