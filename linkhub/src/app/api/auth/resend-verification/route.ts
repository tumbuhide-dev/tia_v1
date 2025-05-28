import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ratelimit } from '@/lib/utils/rateLimit';
import { AppError, handleApiError } from '@/lib/utils/error';
import { getUserByEmail } from '@/lib/supabase/admin';
import { Resend } from 'resend';

const ResendSchema = z.object({
  email: z.string().email(),
});

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

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
    const parsed = ResendSchema.safeParse(body);
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
      return NextResponse.json({ success: false, message: 'Email sudah diverifikasi.' });
    }
    // Resend verification email
    if (!resendApiKey || !resendFromEmail) {
      return NextResponse.json({
        error: 'Konfigurasi email belum lengkap. Tambahkan RESEND_API_KEY dan RESEND_FROM_EMAIL di .env.local',
      }, { status: 500 });
    }
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: 'Verifikasi Ulang Email LinkHub',
      html: `<p>Silakan klik link verifikasi yang dikirim oleh sistem kami ke email Anda.<br/>Jika tidak menerima email, cek folder spam atau gunakan fitur ini lagi setelah beberapa menit.</p>`
    });
    return NextResponse.json({ success: true, message: 'Email verifikasi ulang telah dikirim.' });
  } catch (error) {
    return handleApiError(error, req);
  }
} 