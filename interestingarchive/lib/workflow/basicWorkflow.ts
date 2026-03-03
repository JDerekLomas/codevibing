import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { runPageIntelligenceAgent } from './pageIntelligenceAgent';

export interface BasicWorkflowOptions {
  pdfBuffer: Buffer;
  pdfPath?: string;
  bookId?: string;
  outputDir?: string;
  persist?: boolean;
}

export interface WorkflowSummary {
  bookId: string;
  totalPages: number;
  generatedAt: string;
  sourceChecksum: string;
  outputDir?: string;
}

export interface TopicRecord {
  label: string;
  display_name: string;
  confidence: number;
  evidence: string;
  taxonomy_path?: string[];
}

export interface InstructionalProfile {
  grade_band: string;
  age_range: {
    min: number;
    max: number;
    confidence: number;
  };
  pedagogy_type: {
    value: string;
    confidence: number;
    rationale?: string;
  };
  bloom_level: {
    value: string;
    confidence: number;
    rationale?: string;
  };
  primary_skill: {
    label: string;
    confidence: number;
    rationale?: string;
  };
}

export interface StandardsAlignment {
  topic_label?: string;
  standard_id: string;
  name: string;
  description?: string;
  grade_band?: string;
  alignment_type?: 'primary' | 'supporting' | 'extension' | 'review';
  alignment_confidence: number;
  evidence?: string;
  review_action?: string;
}

export interface AssetBundle {
  items: Array<{
    type: string;
    description: string;
    bounding_box?: number[];
    notes?: string;
  }>;
  assessment: {
    has_assessment: boolean;
    items: Array<{
      question_type: string;
      count: number;
    }>;
  };
  warnings: string[];
}

export interface InstructionalObjective {
  description: string;
  confidence: number;
  evidence?: string;
  related_standards?: string[];
}

export interface AssessmentProfile {
  purpose: 'none' | 'informal' | 'formative' | 'summative' | 'diagnostic';
  question_summary: Array<{
    question_type: string;
    count: number;
  }>;
  differentiation_notes?: string;
  confidence: number;
  notes?: string;
}

export interface InstructionalStrategy {
  primary:
    | 'direct_instruction'
    | 'guided_practice'
    | 'independent_practice'
    | 'collaborative_learning'
    | 'project_based'
    | 'exploratory'
    | 'reference'
    | 'discussion'
    | 'other';
  supporting: string[];
  confidence: number;
  rationale?: string;
}

export interface DifferentiationSupport {
  type: 'ELL' | 'intervention' | 'enrichment' | 'scaffolding' | 'extension' | 'other';
  description: string;
  confidence: number;
}

export interface SupplementaryResource {
  type: 'worksheet' | 'digital_tool' | 'manipulative' | 'video' | 'assessment' | 'other';
  description: string;
  availability: 'included' | 'external' | 'optional';
  link?: string;
}

export interface VocabularyTerm {
  term: string;
  definition?: string;
  complexity: 'introductory' | 'grade_level' | 'advanced' | 'requires_support';
  confidence: number;
  notes?: string;
}

export interface EquityAccessibilityFlag {
  category:
    | 'reading_level'
    | 'cultural_relevance'
    | 'accessibility'
    | 'language_support'
    | 'technology_requirement'
    | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  action?: string;
}

export interface WorkflowRecord {
  book_id: string;
  page_number: number;
  source_checksum: string;
  summary: string;
  overview: {
    key_points: string[];
    learning_focus: string;
    teacher_guidance: string;
    student_prerequisites?: string;
  };
  topics: TopicRecord[];
  instructional: InstructionalProfile;
  instructional_objectives: InstructionalObjective[];
  standards: StandardsAlignment[];
  assessment_profile: AssessmentProfile;
  instructional_strategy: InstructionalStrategy;
  differentiation_supports: DifferentiationSupport[];
  supplementary_resources: SupplementaryResource[];
  vocabulary_terms: VocabularyTerm[];
  equity_accessibility_flags: EquityAccessibilityFlag[];
  assets: AssetBundle;
  confidence_profile: {
    overall: number;
    topics_mean: number;
    standards_mean: number;
    instructional_mean: number;
  };
  qa_status: {
    status: 'approved' | 'retry' | 'manual_review';
    violations: Array<{
      field: string;
      issue: string;
      severity: 'info' | 'warning' | 'error';
    }>;
    notes: string[];
  };
  generated_at: string;
  agent_versions: Record<string, string>;
  processing_log: Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>;
}

export interface WorkflowResult {
  records: WorkflowRecord[];
  summary: WorkflowSummary;
  outputPaths?: {
    metadataJsonl?: string;
    auditSummary?: string;
  };
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'from',
  'this',
  'have',
  'your',
  'about',
  'into',
  'page',
  'chapter',
  'lesson',
  'their',
  'there',
  'which',
  'would',
  'could',
  'should',
  'after',
  'before',
  'where',
  'when',
  'while',
  'they',
  'them',
  'each',
  'other',
  'also',
  'been',
  'than',
  'then',
  'over',
  'under',
  'using',
  'used',
  'such',
  'upon',
  'through',
  'these',
  'those',
  'will',
  'show',
  'because',
  'example',
  'question',
  'answer',
  'figure',
  'table',
  'activity'
]);

const TOPIC_MAP: Record<string, string> = {
  algebra: 'math.algebra',
  equation: 'math.algebra.linear_equations',
  equations: 'math.algebra.linear_equations',
  fraction: 'math.fractions',
  fractions: 'math.fractions',
  geometry: 'math.geometry',
  triangle: 'math.geometry.triangles',
  biology: 'science.biology',
  chemistry: 'science.chemistry',
  physics: 'science.physics',
  history: 'social.history',
  grammar: 'ela.grammar',
  reading: 'ela.reading_comprehension',
  literature: 'ela.literature',
  ecosystem: 'science.life.ecosystems',
  energy: 'science.physics.energy',
  democracy: 'social.civics',
  geography: 'social.geography'
};

const STANDARD_MAP: Record<string, StandardsAlignment> = {
  'math.fractions': {
    topic_label: 'math.fractions',
    standard_id: 'CCSS.MATH.CONTENT.4.NF.B.3',
    name: 'Understand addition and subtraction of fractions',
    description:
      'Apply and extend previous understandings of addition and subtraction to add and subtract fractions.',
    grade_band: '3-5',
    alignment_confidence: 0.7,
    alignment_type: 'primary'
  },
  'math.algebra.linear_equations': {
    topic_label: 'math.algebra.linear_equations',
    standard_id: 'CCSS.MATH.CONTENT.8.EE.C.7',
    name: 'Solve linear equations in one variable',
    description: 'Give examples of linear equations in one variable and solve them.',
    grade_band: '6-8',
    alignment_confidence: 0.75,
    alignment_type: 'primary'
  },
  'science.biology': {
    topic_label: 'science.biology',
    standard_id: 'NGSS.MS-LS1-1',
    name: 'Structure and function in organisms',
    description: 'Conduct investigations to provide evidence that living things are made of cells.',
    grade_band: '6-8',
    alignment_confidence: 0.7,
    alignment_type: 'primary'
  },
  'science.chemistry': {
    topic_label: 'science.chemistry',
    standard_id: 'NGSS.HS-PS1-1',
    name: 'Structure and properties of matter',
    description: 'Use the periodic table as a model to predict properties of elements.',
    grade_band: '9-12',
    alignment_confidence: 0.75,
    alignment_type: 'primary'
  },
  'ela.reading_comprehension': {
    topic_label: 'ela.reading_comprehension',
    standard_id: 'CCSS.ELA-LITERACY.RL.5.1',
    name: 'Quote accurately from a text',
    description: 'Quote accurately from a text when explaining what the text says explicitly.',
    grade_band: '3-5',
    alignment_confidence: 0.7,
    alignment_type: 'primary'
  },
  'social.civics': {
    topic_label: 'social.civics',
    standard_id: 'NCSS.CIV.2.3',
    name: 'Understand democratic principles',
    description: 'Explain how democratic ideals are reflected in government.',
    grade_band: '6-8',
    alignment_confidence: 0.68,
    alignment_type: 'primary'
  }
};

export function inferBookId(pdfPath: string): string {
  const basename = path.basename(pdfPath, path.extname(pdfPath));
  return basename.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export async function runBasicWorkflow(options: BasicWorkflowOptions): Promise<WorkflowResult> {
  const { pdfBuffer, pdfPath, bookId: providedBookId, outputDir, persist = false } = options;

  const bookId = providedBookId || (pdfPath ? inferBookId(pdfPath) : `book-${Date.now()}`);
  const checksum = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

  const pages = await extractPageTexts(pdfBuffer);
  if (!pages.length) {
    throw new Error('No pages extracted from PDF.');
  }

  const records: WorkflowRecord[] = [];
  for (let index = 0; index < pages.length; index += 1) {
    const text = pages[index];
    const record = await buildMetadataRecord({
      bookId,
      pageNumber: index + 1,
      text,
      sourceChecksum: checksum
    });
    records.push(record);
  }

  const summary: WorkflowSummary = {
    bookId,
    totalPages: records.length,
    generatedAt: new Date().toISOString(),
    sourceChecksum: checksum,
    outputDir: persist ? resolveOutputDir(bookId, outputDir) : undefined
  };

  let outputPaths: WorkflowResult['outputPaths'];
  if (persist) {
    outputPaths = writeOutputs(records, summary, outputDir);
  }

  return {
    records,
    summary,
    outputPaths
  };
}

async function extractPageTexts(pdfBuffer: Buffer): Promise<string[]> {
  const pages: string[] = [];

  const options = {
    pagerender: (pageData: any) =>
      pageData
        .getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false
        })
        .then((textContent: any) => {
          const combined = textContent.items.map((item: any) => item.str).join(' ');
          const cleaned = combined.replace(/\s+/g, ' ').trim();
          pages.push(cleaned);
          return cleaned;
        })
  };

  // Dynamically import pdf-parse to avoid build-time issues
  const pdfParse = (await import('pdf-parse')).default;
  await pdfParse(pdfBuffer, options);
  return pages;
}

function buildHeuristicRecord({
  bookId,
  pageNumber,
  text,
  sourceChecksum
}: {
  bookId: string;
  pageNumber: number;
  text: string;
  sourceChecksum: string;
}): WorkflowRecord {
  const cleanText = text || '';
  const summary = generateSummary(cleanText);
  const topics = extractTopics(cleanText);
  const instructional = inferInstructionalProfile(cleanText, topics);
  const standards = mapStandards(topics);
  const assets = detectAssets(cleanText);
  const objectives = generateObjectives(cleanText, topics, standards);
  const assessmentProfile = buildAssessmentProfile(cleanText, assets);
  const instructionalStrategy = determineInstructionalStrategy(cleanText, instructional);
  const differentiationSupports = identifyDifferentiationSupports(cleanText);
  const supplementaryResources = identifyResources(cleanText);
  const vocabularyTerms = extractVocabularyTerms(cleanText);
  const equityAccessibilityFlags = flagEquityAccessibility(cleanText, instructional, assessmentProfile);
  const overview = createOverview(summary, cleanText, instructional, objectives);
  const confidenceProfile = computeConfidenceProfile({ topics, standards, instructional });
  const timestamp = new Date().toISOString();

  return {
    book_id: bookId,
    page_number: pageNumber,
    source_checksum: sourceChecksum,
    summary,
    overview,
    topics,
    instructional,
    instructional_objectives: objectives,
    standards,
    assessment_profile: assessmentProfile,
    instructional_strategy: instructionalStrategy,
    differentiation_supports: differentiationSupports,
    supplementary_resources: supplementaryResources,
    vocabulary_terms: vocabularyTerms,
    equity_accessibility_flags: equityAccessibilityFlags,
    assets,
    confidence_profile: confidenceProfile,
    qa_status: {
      status: 'approved',
      violations: [],
      notes: []
    },
    generated_at: timestamp,
    agent_versions: {
      coordinator: 'basic-cli-0.2.0',
      ingestion: 'stub-0.1.0',
      analyzers: 'heuristic-0.2.0',
      quality_gate: 'heuristic-0.1.0'
    },
    processing_log: [
      {
        agent: 'ingestion',
        message: 'Page text extracted via pdf-parse heuristic pipeline.',
        timestamp
      },
      {
        agent: 'analysis',
        message:
          'Overview, objectives, standards, assessment profile, and supplementary metadata inferred heuristically.',
        timestamp
      }
    ]
  };
}

async function buildMetadataRecord({
  bookId,
  pageNumber,
  text,
  sourceChecksum
}: {
  bookId: string;
  pageNumber: number;
  text: string;
  sourceChecksum: string;
}): Promise<WorkflowRecord> {
  const heuristicRecord = buildHeuristicRecord({ bookId, pageNumber, text, sourceChecksum });

  if (!process.env.ANTHROPIC_API_KEY) {
    return heuristicRecord;
  }

  try {
    const agentPartial = (await runPageIntelligenceAgent({
      bookId,
      pageNumber,
      sourceChecksum,
      pageText: text
    })) as Partial<WorkflowRecord>;

    const merged = mergeRecords(heuristicRecord, agentPartial);
    merged.processing_log.push({
      agent: 'page_intelligence',
      message: 'Merged Claude Page Intelligence response.',
      timestamp: new Date().toISOString()
    });
    merged.agent_versions = {
      ...merged.agent_versions,
      page_intelligence: process.env.CLAUDE_MODEL ?? 'claude-3-5-sonnet-latest'
    };
    return merged;
  } catch (error) {
    heuristicRecord.processing_log.push({
      agent: 'page_intelligence',
      message: `Fell back to heuristics: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    });
    heuristicRecord.qa_status.notes = [
      ...(heuristicRecord.qa_status.notes ?? []),
      'Page Intelligence agent unavailable; using heuristic metadata.'
    ];
    return heuristicRecord;
  }
}

function mergeRecords(base: WorkflowRecord, agent: Partial<WorkflowRecord>): WorkflowRecord {
  const merged: WorkflowRecord = {
    ...base,
    summary: agent.summary ?? base.summary,
    overview: agent.overview ?? base.overview,
    topics: useAgentArray(agent.topics, base.topics),
    instructional: agent.instructional ?? base.instructional,
    instructional_objectives: useAgentArray(agent.instructional_objectives, base.instructional_objectives),
    standards: useAgentArray(agent.standards, base.standards),
    assessment_profile: agent.assessment_profile ?? base.assessment_profile,
    instructional_strategy: agent.instructional_strategy ?? base.instructional_strategy,
    differentiation_supports: useAgentArray(agent.differentiation_supports, base.differentiation_supports),
    supplementary_resources: useAgentArray(agent.supplementary_resources, base.supplementary_resources),
    vocabulary_terms: useAgentArray(agent.vocabulary_terms, base.vocabulary_terms),
    equity_accessibility_flags: useAgentArray(
      agent.equity_accessibility_flags,
      base.equity_accessibility_flags
    ),
    assets: agent.assets ?? base.assets,
    confidence_profile: agent.confidence_profile ?? base.confidence_profile,
    qa_status: mergeQaStatus(base.qa_status, agent.qa_status),
    agent_versions: {
      ...base.agent_versions,
      ...(agent.agent_versions ?? {})
    },
    processing_log: [...base.processing_log]
  };

  if (agent.processing_log?.length) {
    merged.processing_log.push(...agent.processing_log);
  }

  merged.generated_at = agent.generated_at ?? base.generated_at;
  return merged;
}

function useAgentArray<T>(agentValue: T[] | undefined, baseValue: T[]): T[] {
  if (Array.isArray(agentValue) && agentValue.length > 0) {
    return agentValue;
  }
  return baseValue;
}

function mergeQaStatus(
  base: WorkflowRecord['qa_status'],
  agent?: WorkflowRecord['qa_status']
): WorkflowRecord['qa_status'] {
  if (!agent) {
    return base;
  }
  return {
    status: agent.status ?? base.status,
    violations: agent.violations?.length ? agent.violations : base.violations,
    notes: agent.notes?.length ? agent.notes : base.notes
  };
}

function generateSummary(text: string): string {
  if (!text) {
    return 'No textual content detected on this page.';
  }
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 0);
  if (!sentences.length) {
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  }
  return sentences.slice(0, 2).join(' ');
}

function extractTopics(text: string): TopicRecord[] {
  const frequencies = tokenize(text);
  const topTokens = Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([token]) => token);

  if (!topTokens.length) {
    return [defaultTopic()];
  }

  return topTokens.map((token) => toTopic(token));
}

function tokenize(text: string): Map<string, number> {
  const frequencies = new Map<string, number>();
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));

  tokens.forEach((token) => {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  });

  return frequencies;
}

function toTopic(keyword: string): TopicRecord {
  const slug = TOPIC_MAP[keyword] || `misc.${keyword}`;
  return {
    label: slug,
    display_name: keyword.replace(/_/g, ' '),
    confidence: 0.6,
    evidence: `Keyword frequency signal for “${keyword}”.`
  };
}

function defaultTopic(): TopicRecord {
  return {
    label: 'misc.general',
    display_name: 'General instructional content',
    confidence: 0.3,
    evidence: 'Fallback topic due to limited textual signal.'
  };
}

function inferInstructionalProfile(text: string, topics: TopicRecord[]): InstructionalProfile {
  const lowered = text.toLowerCase();
  const gradeBand = pickGradeBand(lowered, topics);
  const pedagogy = detectPedagogy(lowered);
  const bloom = detectBloomLevel(lowered);
  const primarySkill = topics.length ? topics[0] : defaultTopic();

  return {
    grade_band: gradeBand.value,
    age_range: {
      min: gradeBand.age[0],
      max: gradeBand.age[1],
      confidence: gradeBand.confidence
    },
    pedagogy_type: {
      value: pedagogy.value,
      confidence: pedagogy.confidence,
      rationale: pedagogy.rationale
    },
    bloom_level: {
      value: bloom.value,
      confidence: bloom.confidence,
      rationale: bloom.rationale
    },
    primary_skill: {
      label: primarySkill.label,
      confidence: Math.max(0.4, primarySkill.confidence - 0.1),
      rationale: primarySkill.evidence
    }
  };
}

function pickGradeBand(text: string, topics: TopicRecord[]): {
  value: string;
  age: [number, number];
  confidence: number;
} {
  const rules: Array<{
    value: string;
    age: [number, number];
    confidence: number;
    keywords: string[];
  }> = [
    { value: 'K-2', age: [5, 7], confidence: 0.55, keywords: ['alphabet', 'phonics', 'counting', 'shapes'] },
    { value: '3-5', age: [8, 11], confidence: 0.6, keywords: ['fraction', 'fractions', 'paragraph', 'story', 'region'] },
    { value: '6-8', age: [11, 14], confidence: 0.65, keywords: ['algebra', 'equation', 'ratio', 'cells', 'ecosystem'] },
    { value: '9-12', age: [14, 18], confidence: 0.7, keywords: ['derivative', 'molecule', 'constitution', 'trigonometry', 'stoichiometry'] },
    { value: 'higher-ed', age: [18, 99], confidence: 0.6, keywords: ['theorem', 'thermodynamics', 'quantum', 'essay'] }
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule;
    }
  }

  if (topics.some((topic) => topic.label.startsWith('math.') || topic.label.startsWith('science.'))) {
    return { value: '6-8', age: [11, 14], confidence: 0.45 };
  }

  return { value: 'unspecified', age: [10, 18], confidence: 0.3 };
}

function detectPedagogy(text: string): {
  value:
    | 'lecture'
    | 'worked_example'
    | 'guided_practice'
    | 'independent_practice'
    | 'assessment'
    | 'lab_activity'
    | 'project'
    | 'reference'
    | 'discussion'
    | 'other';
  confidence: number;
  rationale: string;
} {
  if (text.includes('multiple choice') || text.includes('answer the questions')) {
    return { value: 'assessment', confidence: 0.65, rationale: 'Instructions to answer questions detected.' };
  }
  if (text.includes('step') && text.includes('example')) {
    return { value: 'worked_example', confidence: 0.6, rationale: 'Mentions of step-by-step example.' };
  }
  if (text.includes('practice') || text.includes('try it')) {
    return { value: 'independent_practice', confidence: 0.55, rationale: 'Practice directives detected.' };
  }
  if (text.includes('discussion') || text.includes('investigate')) {
    return { value: 'discussion', confidence: 0.5, rationale: 'Collaborative cues detected.' };
  }
  if (text.includes('lab') || text.includes('experiment')) {
    return { value: 'lab_activity', confidence: 0.55, rationale: 'Hands-on lab language detected.' };
  }
  return { value: 'reference', confidence: 0.4, rationale: 'Default classification for informational content.' };
}

function detectBloomLevel(text: string): {
  value: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create' | 'unspecified';
  confidence: number;
  rationale: string;
} {
  if (text.includes('define') || text.includes('list')) {
    return { value: 'remember', confidence: 0.55, rationale: 'Recall verbs detected.' };
  }
  if (text.includes('explain') || text.includes('describe')) {
    return { value: 'understand', confidence: 0.6, rationale: 'Explanation verbs detected.' };
  }
  if (text.includes('solve') || text.includes('apply')) {
    return { value: 'apply', confidence: 0.6, rationale: 'Applied practice cues detected.' };
  }
  if (text.includes('analyze') || text.includes('compare')) {
    return { value: 'analyze', confidence: 0.55, rationale: 'Analysis verbs detected.' };
  }
  if (text.includes('design') || text.includes('construct')) {
    return { value: 'create', confidence: 0.5, rationale: 'Creation verbs detected.' };
  }
  return { value: 'unspecified', confidence: 0.3, rationale: 'No Bloom verbs detected.' };
}

function mapStandards(topics: TopicRecord[]): StandardsAlignment[] {
  const results: StandardsAlignment[] = [];

  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
    const base = STANDARD_MAP[topic.label];
    if (!base) {
      continue;
    }
    const alignmentType: 'primary' | 'supporting' = index === 0 ? 'primary' : 'supporting';
    results.push({
      ...base,
      alignment_type: alignmentType,
      alignment_confidence: Math.min(0.9, topic.confidence + 0.1),
      evidence: `Mapped heuristically from topic ${topic.label}.`,
      review_action: alignmentType === 'primary' ? 'auto_approve' : 'confirm_as_supporting'
    });
  }

  return results;
}

function detectAssets(text: string): AssetBundle {
  const lowered = text.toLowerCase();
  const assets: AssetBundle['items'] = [];

  if (lowered.includes('figure')) {
    assets.push({ type: 'diagram', description: 'Figure referenced in text.' });
  }
  if (lowered.includes('table')) {
    assets.push({ type: 'table', description: 'Table referenced in text.' });
  }
  if (lowered.includes('diagram')) {
    assets.push({ type: 'diagram', description: 'Diagram referenced in text.' });
  }
  if (lowered.includes('exercise') || lowered.includes('practice')) {
    assets.push({ type: 'activity', description: 'Practice exercise mentioned.' });
  }
  if (lowered.includes('lab') || lowered.includes('experiment')) {
    assets.push({ type: 'experiment', description: 'Lab or experiment referenced.' });
  }

  return {
    items: dedupeAssets(assets),
    assessment: {
      has_assessment: lowered.includes('question') || lowered.includes('quiz'),
      items: inferAssessmentItems(lowered)
    },
    warnings: assets.length === 0 ? ['No explicit asset cues detected.'] : []
  };
}

function dedupeAssets(items: AssetBundle['items']): AssetBundle['items'] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}:${item.description}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function inferAssessmentItems(text: string): AssetBundle['assessment']['items'] {
  const items: AssetBundle['assessment']['items'] = [];
  if (text.includes('multiple choice')) {
    items.push({ question_type: 'multiple_choice', count: 3 });
  }
  if (text.includes('short answer')) {
    items.push({ question_type: 'short_answer', count: 2 });
  }
  if (text.includes('essay')) {
    items.push({ question_type: 'open_response', count: 1 });
  }
  if (text.includes('true or false') || text.includes('true/false')) {
    items.push({ question_type: 'true_false', count: 2 });
  }
  if (!items.length && (text.includes('question') || text.includes('quiz'))) {
    items.push({ question_type: 'other', count: 3 });
  }
  return items;
}

function generateObjectives(
  text: string,
  topics: TopicRecord[],
  standards: StandardsAlignment[]
): InstructionalObjective[] {
  const objectives: InstructionalObjective[] = [];
  const firstTopic = topics[0]?.display_name ?? 'content';
  const secondTopic = topics[1]?.display_name ?? '';
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 0)
    .slice(0, 3);

  if (sentences.length) {
    objectives.push({
      description: `Students will be able to explain the main idea: ${sentences[0].slice(0, 120).trim()}`,
      confidence: 0.55,
      evidence: sentences[0].trim(),
      related_standards: standards.slice(0, 1).map((standard) => standard.standard_id)
    });
  }

  objectives.push({
    description: `Students will apply knowledge of ${firstTopic}${secondTopic ? ` and ${secondTopic}` : ''} to solve or discuss real-world situations.`,
    confidence: 0.5,
    evidence: `Derived from topic focus on ${firstTopic}.`,
    related_standards: standards.map((standard) => standard.standard_id)
  });

  if (!objectives.length) {
    objectives.push({
      description: 'Students will engage with the primary concept presented on this page.',
      confidence: 0.4
    });
  }

  return objectives;
}

function buildAssessmentProfile(text: string, assets: AssetBundle): AssessmentProfile {
  const lowered = text.toLowerCase();
  let purpose: AssessmentProfile['purpose'] = 'none';
  if (assets.assessment.has_assessment) {
    if (lowered.includes('review') || lowered.includes('practice')) {
      purpose = 'informal';
    }
    if (lowered.includes('quiz') || lowered.includes('test')) {
      purpose = 'summative';
    }
    if (lowered.includes('check for understanding') || lowered.includes('monitor')) {
      purpose = 'formative';
    }
  }

  const differentiationNotes = lowered.includes('support')
    ? 'Text references support or scaffolds around the assessment items.'
    : undefined;

  return {
    purpose,
    question_summary: assets.assessment.items,
    differentiation_notes: differentiationNotes,
    confidence: purpose === 'none' ? 0.3 : 0.55,
    notes: purpose === 'none' ? 'No explicit assessment cues detected; treat as informational page.' : undefined
  };
}

function determineInstructionalStrategy(
  text: string,
  instructional: InstructionalProfile
): InstructionalStrategy {
  const lowered = text.toLowerCase();
  let primary: InstructionalStrategy['primary'] = 'reference';
  const supporting: string[] = [];
  let confidence = 0.5;
  let rationale = 'Defaulted to reference content.';

  if (instructional.pedagogy_type.value === 'worked_example') {
    primary = 'direct_instruction';
    supporting.push('guided_practice');
    confidence = 0.6;
    rationale = 'Worked example language detected.';
  } else if (instructional.pedagogy_type.value === 'independent_practice') {
    primary = 'independent_practice';
    rationale = 'Practice directives detected.';
    confidence = 0.6;
  } else if (lowered.includes('project') || lowered.includes('investigation')) {
    primary = 'project_based';
    supporting.push('exploratory');
    rationale = 'Project or investigation keywords present.';
    confidence = 0.55;
  } else if (lowered.includes('discussion') || lowered.includes('debate')) {
    primary = 'discussion';
    supporting.push('collaborative_learning');
    rationale = 'Discussion cues detected.';
    confidence = 0.55;
  }

  if (lowered.includes('group') || lowered.includes('partner')) {
    supporting.push('collaborative_learning');
  }

  return {
    primary,
    supporting: Array.from(new Set(supporting)),
    confidence,
    rationale
  };
}

function identifyDifferentiationSupports(text: string): DifferentiationSupport[] {
  const lowered = text.toLowerCase();
  const supports: DifferentiationSupport[] = [];

  if (lowered.includes('english learner') || lowered.includes('ell')) {
    supports.push({
      type: 'ELL',
      description: 'Mentions support for English learners.',
      confidence: 0.65
    });
  }
  if (lowered.includes('challenge') || lowered.includes('enrichment')) {
    supports.push({
      type: 'enrichment',
      description: 'Includes challenge or enrichment prompts.',
      confidence: 0.55
    });
  }
  if (lowered.includes('support') || lowered.includes('scaffold')) {
    supports.push({
      type: 'scaffolding',
      description: 'General scaffolding language detected.',
      confidence: 0.5
    });
  }

  return supports;
}

function identifyResources(text: string): SupplementaryResource[] {
  const lowered = text.toLowerCase();
  const resources: SupplementaryResource[] = [];

  if (lowered.includes('worksheet')) {
    resources.push({ type: 'worksheet', description: 'Worksheet referenced on page.', availability: 'included' });
  }
  if (lowered.includes('online') || lowered.includes('digital')) {
    resources.push({
      type: 'digital_tool',
      description: 'Digital resource or platform mentioned.',
      availability: 'external'
    });
  }
  if (lowered.includes('video')) {
    resources.push({ type: 'video', description: 'Video resource referenced.', availability: 'external' });
  }
  if (lowered.includes('manipulative')) {
    resources.push({
      type: 'manipulative',
      description: 'Physical manipulative referenced.',
      availability: 'optional'
    });
  }

  return resources;
}

function extractVocabularyTerms(text: string): VocabularyTerm[] {
  const frequencies = tokenize(text);
  const sortedTerms = Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return sortedTerms.map(([term], index) => ({
    term,
    complexity: index <= 1 ? 'grade_level' : 'introductory',
    confidence: 0.45,
    notes: 'Heuristic extraction based on term frequency.'
  }));
}

function flagEquityAccessibility(
  text: string,
  instructional: InstructionalProfile,
  assessmentProfile: AssessmentProfile
): EquityAccessibilityFlag[] {
  const lowered = text.toLowerCase();
  const flags: EquityAccessibilityFlag[] = [];

  if (instructional.grade_band === 'unspecified') {
    flags.push({
      category: 'reading_level',
      description: 'Grade band unclear; requires human verification.',
      severity: 'medium',
      confidence: 0.4,
      action: 'Confirm target grade level.'
    });
  }

  if (assessmentProfile.purpose === 'summative' && !assessmentProfile.differentiation_notes) {
    flags.push({
      category: 'accessibility',
      description: 'Summative assessment detected without differentiation notes.',
      severity: 'medium',
      confidence: 0.45,
      action: 'Ensure accommodations are provided for assessment.'
    });
  }

  if (lowered.includes('device required') || lowered.includes('online access')) {
    flags.push({
      category: 'technology_requirement',
      description: 'Page references required technology access.',
      severity: 'low',
      confidence: 0.5,
      action: 'Verify tech availability for students.'
    });
  }

  return flags;
}

function createOverview(
  summary: string,
  text: string,
  instructional: InstructionalProfile,
  objectives: InstructionalObjective[]
): WorkflowRecord['overview'] {
  const keyPoints = summary
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => sentence.trim().slice(0, 160));

  if (!keyPoints.length) {
    keyPoints.push('No clear summary available; requires manual review.');
  }

  const learningFocus = objectives[0]?.description ?? 'Review primary concepts presented on this page.';
  const teacherGuidance = instructional.pedagogy_type.value === 'reference'
    ? 'Use this page to prime discussion or set context; add your own checks for understanding.'
    : 'Follow the suggested flow and monitor student responses at key checkpoints.';

  const studentPrerequisites = text.toLowerCase().includes('review')
    ? 'Students should review prerequisite material mentioned on the page.'
    : undefined;

  return {
    key_points: keyPoints.slice(0, 3),
    learning_focus: learningFocus,
    teacher_guidance: teacherGuidance,
    student_prerequisites: studentPrerequisites
  };
}

function computeConfidenceProfile({
  topics,
  standards,
  instructional
}: {
  topics: TopicRecord[];
  standards: StandardsAlignment[];
  instructional: InstructionalProfile;
}): WorkflowRecord['confidence_profile'] {
  const topicMean = topics.length ? average(topics.map((topic) => topic.confidence)) : 0.2;
  const standardMean = standards.length ? average(standards.map((standard) => standard.alignment_confidence)) : 0.2;
  const instructionalMean = average([
    instructional.age_range.confidence,
    instructional.pedagogy_type.confidence,
    instructional.bloom_level.confidence,
    instructional.primary_skill.confidence
  ]);

  return {
    overall: Number(average([topicMean, standardMean, instructionalMean]).toFixed(2)),
    topics_mean: Number(topicMean.toFixed(2)),
    standards_mean: Number(standardMean.toFixed(2)),
    instructional_mean: Number(instructionalMean.toFixed(2))
  };
}

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function resolveOutputDir(bookId: string, outputDir?: string): string {
  if (outputDir) {
    return path.resolve(outputDir);
  }
  return path.resolve(path.join('out', bookId));
}

function writeOutputs(
  records: WorkflowRecord[],
  summary: WorkflowSummary,
  outputDir?: string
): WorkflowResult['outputPaths'] {
  const resolvedDir = resolveOutputDir(summary.bookId, outputDir);
  const auditDir = path.join(resolvedDir, 'audit');
  fs.mkdirSync(resolvedDir, { recursive: true });
  fs.mkdirSync(auditDir, { recursive: true });

  const jsonlPath = path.join(resolvedDir, 'page-metadata.jsonl');
  const stream = fs.createWriteStream(jsonlPath, { flags: 'w' });
  records.forEach((record) => {
    stream.write(`${JSON.stringify(record)}\n`);
  });
  stream.end();

  fs.writeFileSync(
    path.join(auditDir, 'summary.json'),
    JSON.stringify(
      {
        bookId: summary.bookId,
        totalPages: summary.totalPages,
        generatedAt: summary.generatedAt,
        sourceChecksum: summary.sourceChecksum
      },
      null,
      2
    )
  );

  return {
    metadataJsonl: jsonlPath,
    auditSummary: path.join(auditDir, 'summary.json')
  };
}
