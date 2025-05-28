import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  if (!username) {
    return NextResponse.json({ available: false, error: 'Username wajib diisi.' }, { status: 400 });
  }
  // Cek di table users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (userError) {
    console.error('Supabase userError:', userError);
    return NextResponse.json({ available: false, error: 'Gagal mengecek username: ' + userError.message }, { status: 500 });
  }
  if (userData) {
    return NextResponse.json({ available: false });
  }
  // Cek di table profiles
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (profileError) {
    console.error('Supabase profileError:', profileError);
    return NextResponse.json({ available: false, error: 'Gagal mengecek username: ' + profileError.message }, { status: 500 });
  }
  return NextResponse.json({ available: !profileData });
} 