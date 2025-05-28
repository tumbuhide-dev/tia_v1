import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getUserFromRequest } from '@/middleware/supabaseSession';

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

// Reserved usernames (see PROMPT_ALL.txt)
const reserved = ['admin', 'api', 'www', 'app'];

const CompleteProfileSchema = z.object({
  username: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Hanya huruf, angka, dan underscore')
    .refine(val => !reserved.includes(val.toLowerCase()), {
      message: 'Username tidak tersedia',
    }),
  fullName: z.string().min(2).max(50),
  birthDate: z.string().regex(/^(\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2})$/, 'Format DD-MM-YYYY atau YYYY-MM-DD'),
});

export async function POST(req: NextRequest) {
  try {
    // Manual rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit.' }, { status: 429 });
    }
    // Get user from session
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Anda harus login untuk melengkapi profil.' }, { status: 401 });
    }
    // Validate input
    const body = await req.json();
    const parsed = CompleteProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }
    const { username, fullName, birthDate } = parsed.data;
    // Parse and validate birth date
    let birthDateISO = birthDate;
    let year, month, day;
    if (/^\d{2}-\d{2}-\d{4}$/.test(birthDate)) {
      // DD-MM-YYYY
      [day, month, year] = birthDate.split('-').map(Number);
      birthDateISO = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      // YYYY-MM-DD
      [year, month, day] = birthDate.split('-').map(Number);
    } else {
      return NextResponse.json({ error: 'Format tanggal lahir tidak valid.' }, { status: 400 });
    }
    // Hitung umur manual
    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age--;
    }
    if (age < 17) {
      return NextResponse.json({ error: 'Anda harus berusia minimal 17 tahun.' }, { status: 400 });
    }
    // Cek username di table users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (existingUser && existingUser.id && existingUser.id !== user.id) {
      return NextResponse.json({ error: 'Username sudah digunakan.' }, { status: 409 });
    }
    // Cek username di table profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('username', username)
      .maybeSingle();
    if (existingProfile && existingProfile.user_id && existingProfile.user_id !== user.id) {
      return NextResponse.json({ error: 'Username sudah digunakan.' }, { status: 409 });
    }
    // Update username di table users
    const { error: updateUserErr } = await supabase
      .from('users')
      .update({
        username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    if (updateUserErr) {
      return NextResponse.json({ error: 'Gagal menyimpan username.', detail: updateUserErr.message }, { status: 500 });
    }
    // Generate default avatar Dicebear
    const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(username)}`;
    // Upsert profile with avatar_url always set
    const upsertProfileData = {
      user_id: user.id,
      username,
      display_name: fullName,
      birth_date: birthDateISO,
      updated_at: new Date().toISOString(),
      avatar_url: avatarUrl,
    };
    const { error: updateProfileErr } = await supabase
      .from('profiles')
      .upsert(upsertProfileData, { onConflict: 'user_id' });
    if (updateProfileErr) {
      return NextResponse.json({ error: 'Gagal menyimpan profil.', detail: updateProfileErr.message }, { status: 500 });
    }
    // Optionally, update user metadata (username) in auth
    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { username, fullName, birthDate: birthDateISO, profile_completed: true },
      });
    } catch (err: any) {
      // Tidak fatal, hanya log
      console.error('Gagal update metadata auth:', err);
    }
    // Fetch updated profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id, username, display_name, birth_date, updated_at, avatar_url')
      .eq('user_id', user.id)
      .single();
    return NextResponse.json({ success: true, message: 'Profil berhasil dilengkapi.', profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
} 