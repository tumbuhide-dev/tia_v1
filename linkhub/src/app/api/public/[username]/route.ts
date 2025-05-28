import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET: Get public profile by username
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  if (!username) {
    return NextResponse.json({ error: 'Username wajib diisi.' }, { status: 400 });
  }
  // Ambil profile publik berdasarkan username
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url, location, website, niche, tagline, business_category, established_date, logo, employee_count')
    .eq('username', username)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: 'Profil tidak ditemukan.' }, { status: 404 });
  }
  // Jangan expose data sensitif
  return NextResponse.json({ success: true, profile: data });
} 