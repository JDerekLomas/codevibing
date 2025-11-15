'use client';

import { useEffect, useMemo, useState } from 'react';

interface WorkflowRecord {
  book_id: string;
  page_number: number;
  summary: string;
  overview: {
    key_points: string[];
    learning_focus: string;
    teacher_guidance: string;
  };
  topics: Array<{ label: string; display_name: string; confidence: number }>;
  instructional: {
    grade_band: string;
    pedagogy_type: { value: string };
    bloom_level: { value: string };
  };
  instructional_objectives: Array<{ description: string; confidence: number }>;
  confidence_profile: {
    overall: number;
  };
  qa_status: {
    status: string;
  };
}

interface WorkflowResponse {
  bookId: string;
  totalPages: number;
  generatedAt: string;
  sourceChecksum: string;
  preview: WorkflowRecord[];
  records: WorkflowRecord[];
}

export default function BasicWorkflowPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bookId, setBookId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WorkflowResponse | null>(null);

  const previewTopics = (record: WorkflowRecord) =>
    record.topics
      .slice(0, 3)
      .map((topic) => `${topic.display_name} (${Math.round(topic.confidence * 100)}%)`)
      .join(', ');

  const previewObjectives = (record: WorkflowRecord) =>
    record.instructional_objectives
      .slice(0, 2)
      .map((objective) => objective.description)
      .join(' • ');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Choose a PDF before running the workflow.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      if (bookId.trim()) {
        formData.append('bookId', bookId.trim());
      }

      const response = await fetch('/api/workflow/basic', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Workflow failed');
      }

      const data = (await response.json()) as WorkflowResponse;
      setResult(data);
    } catch (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBlobUrl = useMemo(() => {
    if (!result) {
      return null;
    }
    const blob = new Blob([JSON.stringify(result.records, null, 2)], {
      type: 'application/json'
    });
    return URL.createObjectURL(blob);
  }, [result]);

  useEffect(() => {
    return () => {
      if (downloadBlobUrl) {
        URL.revokeObjectURL(downloadBlobUrl);
      }
    };
  }, [downloadBlobUrl]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Basic Metadata Workflow</h1>
        <p className="text-sm text-muted-foreground">
          Upload a PDF textbook to run the heuristic metadata pipeline. This prototype mirrors the
          CLI flow defined in <code>docs/workflows/basic-cli.md</code> and returns page-level
          metadata to help iterate on the multi-agent design.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Textbook PDF</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const fileList = event.target.files;
                setSelectedFile(fileList && fileList.length ? fileList[0] : null);
              }}
              required
              className="rounded border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Book ID (optional)</span>
            <input
              type="text"
              placeholder="auto-generated from filename"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
              className="rounded border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted"
            >
              {isLoading ? 'Running…' : 'Run workflow'}
            </button>
            {selectedFile && (
              <span className="text-xs text-muted-foreground">
                {selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </section>

      {isLoading && (
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Processing PDF… this may take a moment.</p>
        </section>
      )}

      {result && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Run Summary</h2>
              <p className="text-sm text-muted-foreground">
                {result.bookId} · {result.totalPages} pages · generated {new Date(result.generatedAt).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Checksum: {result.sourceChecksum}</p>
            </div>
            {downloadBlobUrl && (
              <a
                href={downloadBlobUrl}
                download={`${result.bookId}-metadata.json`}
                className="inline-flex items-center justify-center rounded border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Download full JSON
              </a>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full table-auto text-left text-sm">
              <thead className="border-b border-border bg-muted/60">
                <tr>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Key Points</th>
                  <th className="px-4 py-3">Objectives</th>
                  <th className="px-4 py-3">Topics</th>
                  <th className="px-4 py-3">Grade Band</th>
                  <th className="px-4 py-3">Pedagogy</th>
                  <th className="px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {result.preview.map((record) => (
                  <tr key={record.page_number} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{record.page_number}</td>
                    <td className="px-4 py-3 text-xs leading-relaxed">
                      {record.overview.key_points.join(' • ')}
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed">{previewObjectives(record)}</td>
                    <td className="px-4 py-3 text-xs leading-relaxed">{previewTopics(record)}</td>
                    <td className="px-4 py-3 text-xs">{record.instructional.grade_band}</td>
                    <td className="px-4 py-3 text-xs">{record.instructional.pedagogy_type.value}</td>
                    <td className="px-4 py-3 text-xs">{Math.round(record.confidence_profile.overall * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            The preview shows up to five pages. Download the full JSON to inspect all records or feed
            them into downstream evaluation scripts.
          </p>
        </section>
      )}
    </main>
  );
}
