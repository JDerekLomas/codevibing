import { NextRequest, NextResponse } from 'next/server';
import { getUnratedProjects } from '@/lib/supabase';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const voterId = req.nextUrl.searchParams.get('voter_id');
  const count = parseInt(req.nextUrl.searchParams.get('count') || '5', 10);

  if (!voterId) {
    return NextResponse.json({ error: 'voter_id required' }, { status: 400 });
  }

  const projects = await getUnratedProjects(voterId, Math.min(count, 20));
  return NextResponse.json({ projects });
}
