import { NextResponse } from 'next/server';
import { inferBookId, runBasicWorkflow } from '@/lib/workflow/basicWorkflow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing PDF file (form field: pdf).' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const suppliedBookId = formData.get('bookId');
    const bookId = typeof suppliedBookId === 'string' && suppliedBookId.trim().length > 0
      ? suppliedBookId.trim()
      : inferBookId(file.name || 'uploaded.pdf');

    const result = await runBasicWorkflow({
      pdfBuffer,
      bookId,
      pdfPath: file.name,
      persist: false
    });

    return NextResponse.json({
      bookId: result.summary.bookId,
      totalPages: result.summary.totalPages,
      generatedAt: result.summary.generatedAt,
      sourceChecksum: result.summary.sourceChecksum,
      records: result.records,
      preview: result.records.slice(0, 5)
    });
  } catch (error) {
    console.error('Workflow API error', error);
    return NextResponse.json({ error: 'Failed to run workflow', details: `${error}` }, { status: 500 });
  }
}
