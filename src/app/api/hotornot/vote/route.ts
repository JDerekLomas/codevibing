import { NextRequest, NextResponse } from 'next/server';
import { submitRating } from '@/lib/supabase';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { project_id, voter_id, score } = body;

    if (!project_id || !voter_id || (score !== 0 && score !== 1)) {
      return NextResponse.json({ error: 'project_id, voter_id, and score (0 or 1) required' }, { status: 400 });
    }

    const stats = await submitRating(project_id, voter_id, score as 0 | 1);
    return NextResponse.json({ success: true, ...stats });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
