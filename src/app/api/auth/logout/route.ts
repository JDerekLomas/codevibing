import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(origin);
}

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
