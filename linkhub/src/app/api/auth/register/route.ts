import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/utils/error';
import { Resend } from 'resend';

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

// Zod schema for registration (see PROMPT_ALL.txt)
const RegisterSchema = z.object({
  role: z.enum(['brand', 'creator']),
  email: z.string().email(),
  password: z.string().min(8).max(128)
    .regex(/[A-Z]/, 'Harus ada huruf besar')
    .regex(/[a-z]/, 'Harus ada huruf kecil')
    .regex(/[0-9]/, 'Harus ada angka')
    .regex(/[^A-Za-z0-9]/, 'Harus ada karakter spesial')
    .refine(val => !/123456|password|qwerty|admin|linkhub|12345678|password123/.test(val), {
      message: 'Password terlalu umum',
    }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
});

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(req: NextRequest) {
  try {
    // Manual rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit.' }, { status: 429 });
    }

    // Validate input
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }
    const { email, password, role } = parsed.data;

    // Register user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { account_type: role },
        emailRedirectTo: `${appUrl}/complete-profile`,
      },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send verification email (Resend)
    if (!resendApiKey || !resendFromEmail) {
      return NextResponse.json({
        error: 'Konfigurasi email belum lengkap. Tambahkan RESEND_API_KEY dan RESEND_FROM_EMAIL di .env.local',
      }, { status: 500 });
    }
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: resendFromEmail,
        to: email,
        subject: 'Verifikasi Email LinkHub',
        html: `<p>Terima kasih telah mendaftar di LinkHub.<br/>Klik link verifikasi yang dikirim oleh sistem kami ke email Anda.<br/>Jika tidak menerima email, cek folder spam atau gunakan fitur "Kirim Ulang" di halaman login.</p>`
      });
    } catch (err: any) {
      return NextResponse.json({ error: 'Gagal mengirim email verifikasi: ' + (err.message || 'Unknown error') }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.' });
  } catch (error: any) {
    // Tampilkan error asli ke frontend untuk debugging
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
} 