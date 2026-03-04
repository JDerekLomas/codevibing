import { NextResponse } from 'next/server';
import { syncProjectsFromSources } from '@/lib/supabase';

export async function GET(): Promise<NextResponse> {
  try {
    const count = await syncProjectsFromSources();
    return NextResponse.json({ success: true, synced: count });
  } catch (error) {
    console.error('sync-projects cron error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
