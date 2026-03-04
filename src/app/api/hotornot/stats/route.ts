import { NextRequest, NextResponse } from 'next/server';
import { getProjectStats } from '@/lib/supabase';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sort = (req.nextUrl.searchParams.get('sort') || 'hot') as 'hot' | 'new' | 'controversial';
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20', 10);

  const stats = await getProjectStats(sort, Math.min(limit, 50));
  return NextResponse.json({ projects: stats });
}
