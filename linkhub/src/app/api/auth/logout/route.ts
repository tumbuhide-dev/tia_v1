import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Remove sb-access-token cookie
  const res = NextResponse.json({ success: true, message: 'Berhasil logout.' });
  res.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' });
  return res;
} 