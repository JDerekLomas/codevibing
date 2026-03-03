import { NextRequest, NextResponse } from "next/server";
const pdfParse = require("pdf-parse");

// Simple standards alignment logic
interface Standard {
  id: string;
  grade: number;
  description: string;
  keywords: string[];
  anti_keywords?: string[];
}

interface Evidence {
  standard_id: string;
  page: number;
  text: string;
  confidence: number;
}

function alignStandards(
  pdfText: string,
  standards: Standard[]
): {
  coverage: any;
  evidence: Evidence[];
} {
  const evidence: Evidence[] = [];
  const pages = pdfText.split("\f"); // Form feed separates pages in PDF text

  standards.forEach((standard) => {
    pages.forEach((pageText, pageIndex) => {
      const lowerPageText = pageText.toLowerCase();

      // Check for keyword matches
      const keywordMatches = standard.keywords.filter((keyword) =>
        lowerPageText.includes(keyword.toLowerCase())
      );

      // Check for anti-keyword matches (should NOT be present)
      const antiKeywordMatches = standard.anti_keywords
        ? standard.anti_keywords.filter((antiKeyword) =>
            lowerPageText.includes(antiKeyword.toLowerCase())
          )
        : [];

      // Calculate confidence score
      const confidence =
        keywordMatches.length > 0 && antiKeywordMatches.length === 0
          ? keywordMatches.length / standard.keywords.length
          : 0;

      if (confidence > 0.3) {
        // At least 30% keyword match
        // Extract relevant snippet
        const snippetLength = 200;
        const firstKeyword = keywordMatches[0];
        const keywordIndex = lowerPageText.indexOf(
          firstKeyword.toLowerCase()
        );
        const start = Math.max(0, keywordIndex - 50);
        const end = Math.min(pageText.length, keywordIndex + snippetLength);
        const snippet = pageText.substring(start, end).trim();

        evidence.push({
          standard_id: standard.id,
          page: pageIndex + 1,
          text: snippet,
          confidence: Math.round(confidence * 100),
        });
      }
    });
  });

  // Calculate coverage statistics
  const coveredStandards = new Set(evidence.map((e) => e.standard_id));
  const totalStandards = standards.length;
  const totalCovered = coveredStandards.size;
  const coveragePercent = Math.round((totalCovered / totalStandards) * 100);

  const coverage = {
    metadata: {
      total_standards: totalStandards,
      pack_name: "CCSS Math Grade 3 (Sample)",
    },
    summary: {
      total_covered: totalCovered,
      total_uncovered: totalStandards - totalCovered,
      coverage_percent: coveragePercent,
    },
    standards: standards.map((std) => ({
      id: std.id,
      grade: std.grade,
      description: std.description,
      covered: coveredStandards.has(std.id),
      evidence_count: evidence.filter((e) => e.standard_id === std.id).length,
    })),
  };

  return { coverage, evidence };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF
    const data = await pdfParse(buffer);
    const text = data.text;

    // Sample CCSS Math Grade 3 standards (subset)
    const standards: Standard[] = [
      {
        id: "3.NF.A.1",
        grade: 3,
        description: "Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts",
        keywords: ["fraction", "equal parts", "whole", "denominator"],
        anti_keywords: ["percent", "decimal"],
      },
      {
        id: "3.NF.A.2",
        grade: 3,
        description: "Understand a fraction as a number on the number line",
        keywords: ["fraction", "number line", "represent"],
        anti_keywords: ["percent"],
      },
      {
        id: "3.OA.A.1",
        grade: 3,
        description: "Interpret products of whole numbers",
        keywords: ["multiply", "multiplication", "product", "times"],
        anti_keywords: ["divide", "division"],
      },
      {
        id: "3.OA.A.2",
        grade: 3,
        description: "Interpret whole-number quotients of whole numbers",
        keywords: ["divide", "division", "quotient", "share"],
        anti_keywords: ["multiply"],
      },
      {
        id: "3.OA.A.3",
        grade: 3,
        description: "Use multiplication and division within 100 to solve word problems",
        keywords: ["word problem", "multiply", "divide", "solve"],
      },
      {
        id: "3.OA.B.5",
        grade: 3,
        description: "Apply properties of operations as strategies to multiply and divide",
        keywords: ["property", "commutative", "associative", "distributive"],
      },
      {
        id: "3.OA.C.7",
        grade: 3,
        description: "Fluently multiply and divide within 100",
        keywords: ["multiply", "divide", "fact", "fluent"],
      },
      {
        id: "3.MD.A.1",
        grade: 3,
        description: "Tell and write time to the nearest minute",
        keywords: ["time", "clock", "minute", "hour"],
      },
      {
        id: "3.MD.A.2",
        grade: 3,
        description: "Measure and estimate liquid volumes and masses",
        keywords: ["volume", "mass", "liter", "gram", "kilogram"],
      },
      {
        id: "3.G.A.1",
        grade: 3,
        description: "Understand that shapes in different categories may share attributes",
        keywords: ["shape", "quadrilateral", "attributes", "category"],
      },
    ];

    // Perform alignment
    const { coverage, evidence } = alignStandards(text, standards);

    return NextResponse.json({
      success: true,
      coverage,
      evidence: evidence.slice(0, 50), // Limit evidence to first 50 items
      pages_analyzed: data.numpages,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze PDF",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
