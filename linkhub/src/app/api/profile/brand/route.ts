import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { getUserFromRequest } from '@/middleware/supabaseSession';
// import { ratelimit } from '@/lib/utils/rateLimit';
// import { AppError, handleApiError } from '@/lib/utils/error';

const BrandProfileSchema = z.object({
  display_name: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  business_category: z.string().min(2).max(50),
  established_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  logo: z.string().url().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  employee_count: z.string().optional(),
  hide_established: z.boolean().optional(),
});

// GET: Get brand profile (to be implemented)
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
  return NextResponse.json({ success: true, profile: data });
}

// PUT: Update brand profile (to be implemented)
export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Anda harus login.' }, { status: 401 });
  }
  const body = await req.json();
  const parsed = BrandProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updateData = { ...parsed.data, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', user.id);
  if (error) {
    return NextResponse.json({ error: 'Gagal memperbarui profil.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui.' });
} 