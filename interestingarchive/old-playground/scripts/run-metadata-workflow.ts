#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { inferBookId, runBasicWorkflow } from '../src/lib/workflow/basicWorkflow';

interface CliArgs {
  pdf?: string;
  'book-id'?: string;
  output?: string;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {};
  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    if (current.startsWith('--')) {
      const key = current.slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : undefined;
      (result as Record<string, string | undefined>)[key] = value;
    }
  }
  return result;
}

function printUsage(): void {
  console.log(`\nBasic metadata workflow prototype\n\nUsage: npm run workflow:basic -- --pdf ./path/to/book.pdf [--book-id custom-id] [--output ./out/dir]\n`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.pdf) {
    printUsage();
    process.exit(1);
  }

  const pdfPath = path.resolve(args.pdf);
  if (!fs.existsSync(pdfPath)) {
    console.error(`\n✖ PDF not found: ${pdfPath}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(pdfPath);
  const bookId = args['book-id'] || inferBookId(pdfPath);
  const outputDir = args.output;

  console.log(`\n▶ Running metadata workflow`);
  console.log(`• PDF: ${pdfPath}`);
  console.log(`• Book ID: ${bookId}`);
  console.log(`• Output dir: ${outputDir ?? path.join('out', bookId)}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('• Page Intelligence agent: disabled (set ANTHROPIC_API_KEY to enable Claude metadata)');
  }

  try {
    const result = await runBasicWorkflow({
      pdfBuffer: buffer,
      pdfPath,
      bookId,
      outputDir,
      persist: true
    });

    const firstRecord = result.records[0];
    const jsonlPath = result.outputPaths?.metadataJsonl ?? 'unknown';

    console.log(`\n✔ Workflow complete. Wrote ${result.records.length} records to ${jsonlPath}`);
    console.log('Preview of first page:');
    console.log(JSON.stringify(firstRecord, null, 2));
  } catch (error) {
    console.error('\nUnexpected error running workflow:', error);
    process.exit(1);
  }
}

main();
