import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { getUserFromRequest } from '@/middleware/supabaseSession';
// import { ratelimit } from '@/lib/utils/rateLimit';
// import { AppError, handleApiError } from '@/lib/utils/error';

const CommonProfileSchema = z.object({
  display_name: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
});

// GET: Get current user's profile
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Anda harus login.' }, { status: 401 });
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error) {
    return NextResponse.json({ error: 'Gagal mengambil profil.' }, { status: 500 });
  }
  // Jangan expose data sensitif
  return NextResponse.json({ success: true, profile: data });
}

// PUT: Update current user's profile
export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Anda harus login.' }, { status: 401 });
  }
  const body = await req.json();
  const parsed = CommonProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  // Only update avatar_url if provided
  const updateData = { ...parsed.data, updated_at: new Date().toISOString() };
  if (!('avatar_url' in body)) {
    delete updateData.avatar_url;
  }
  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', user.id);
  if (error) {
    return NextResponse.json({ error: 'Gagal memperbarui profil.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui.' });
} 