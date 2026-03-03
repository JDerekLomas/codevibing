"use client";

import { useState } from "react";

interface AnalysisResult {
  success: boolean;
  coverage: {
    metadata: {
      total_standards: number;
      pack_name: string;
    };
    summary: {
      total_covered: number;
      total_uncovered: number;
      coverage_percent: number;
    };
    standards: Array<{
      id: string;
      grade: number;
      description: string;
      covered: boolean;
      evidence_count: number;
    }>;
  };
  evidence: Array<{
    standard_id: string;
    page: number;
    text: string;
    confidence: number;
  }>;
  pages_analyzed: number;
  error?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setProgress("Uploading PDF...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setProgress("Extracting text from PDF...");
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      setProgress("Analyzing standards alignment...");
      const data = await response.json();

      if (data.error) {
        setResult({ ...data, success: false });
      } else {
        setResult(data);
      }
      setProgress("");
    } catch (error) {
      console.error("Analysis failed:", error);
      setResult({
        success: false,
        error: "Analysis failed. Please try again.",
        coverage: {
          metadata: { total_standards: 0, pack_name: "" },
          summary: {
            total_covered: 0,
            total_uncovered: 0,
            coverage_percent: 0,
          },
          standards: [],
        },
        evidence: [],
        pages_analyzed: 0,
      });
      setProgress("");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-2xl font-light tracking-tight text-slate-900">
            EdReports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Curriculum Quality Assurance & Standards Alignment
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Upload Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
          <h2 className="text-xl font-light text-slate-900">
            Upload Textbook for Review
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload a PDF textbook to analyze standards alignment and generate a
            comprehensive review report.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            {/* File Upload Area */}
            <label
              htmlFor="file-upload"
              className="group relative block cursor-pointer"
            >
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-slate-400 hover:bg-slate-100">
                {analyzing ? (
                  <>
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
                    <p className="mt-4 text-sm font-medium text-slate-700">
                      {progress || "Processing..."}
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-12 w-12 text-slate-400 transition-colors group-hover:text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-slate-700">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PDF textbooks up to 50MB
                    </p>
                  </>
                )}
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
                disabled={analyzing}
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || analyzing}
              className="mt-6 w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Analyze Textbook"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
            {result.error ? (
              <div className="text-red-600">
                <h3 className="font-medium">Error</h3>
                <p className="mt-2 text-sm">{result.error}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-light text-slate-900">
                  Analysis Complete
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Analyzed {result.pages_analyzed} pages using{" "}
                  {result.coverage.metadata.pack_name}
                </p>

                <div className="mt-6 space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                        Total Standards
                      </p>
                      <p className="mt-2 text-2xl font-light text-slate-900">
                        {result.coverage.metadata.total_standards}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-green-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                        Covered
                      </p>
                      <p className="mt-2 text-2xl font-light text-green-900">
                        {result.coverage.summary.total_covered}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-amber-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                        Uncovered
                      </p>
                      <p className="mt-2 text-2xl font-light text-amber-900">
                        {result.coverage.summary.total_uncovered}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-blue-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                        Coverage
                      </p>
                      <p className="mt-2 text-2xl font-light text-blue-900">
                        {result.coverage.summary.coverage_percent}%
                      </p>
                    </div>
                  </div>

                  {/* Standards Details */}
                  <div className="mt-8">
                    <h4 className="font-medium text-slate-900">
                      Standards Breakdown
                    </h4>
                    <div className="mt-4 space-y-2">
                      {result.coverage.standards.map((standard) => (
                        <div
                          key={standard.id}
                          className={`rounded-lg border p-4 ${
                            standard.covered
                              ? "border-green-200 bg-green-50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-mono text-sm font-medium text-slate-900">
                                {standard.id}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {standard.description}
                              </p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {standard.covered ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                  ✓ Covered ({standard.evidence_count}{" "}
                                  {standard.evidence_count === 1
                                    ? "instance"
                                    : "instances"}
                                  )
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                                  Not covered
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Examples */}
                  {result.evidence.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-medium text-slate-900">
                        Evidence Examples
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        Sample evidence found in the textbook
                      </p>
                      <div className="mt-4 space-y-3">
                        {result.evidence.slice(0, 5).map((evidence, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-start justify-between">
                              <p className="font-mono text-xs font-medium text-slate-900">
                                {evidence.standard_id}
                              </p>
                              <span className="text-xs text-slate-600">
                                Page {evidence.page} • {evidence.confidence}%
                                confidence
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-700">
                              "{evidence.text}..."
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-medium text-slate-900">What We Analyze</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Standards alignment to CCSS Math Grade 3</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Evidence extraction with page references</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Coverage metrics and confidence scores</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keyword-based alignment detection</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-medium text-slate-900">How It Works</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Upload your PDF textbook</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>We extract and analyze all text</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Match content to standards using keywords</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Generate comprehensive coverage report</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-center text-sm text-slate-600">
            EdReports Curriculum Review Tool © 2025 • Web-based analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
