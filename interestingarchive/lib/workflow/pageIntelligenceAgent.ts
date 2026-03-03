import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const MAX_TEXT_LENGTH = 12000;

let cachedSchema: string | null = null;
let anthropicClient: Anthropic | null = null;

function getSchema(): string {
  if (!cachedSchema) {
    const schemaPath = path.resolve(process.cwd(), 'docs/schema/page-metadata.json');
    try {
      cachedSchema = fs.readFileSync(schemaPath, 'utf8');
    } catch (error) {
      throw new Error(`Unable to load metadata schema at ${schemaPath}: ${error}`);
    }
  }
  return cachedSchema;
}

function getAnthropic(): Anthropic {
  if (anthropicClient) {
    return anthropicClient;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set.');
  }
  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

function truncateText(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_TEXT_LENGTH)}\n...[truncated ${text.length - MAX_TEXT_LENGTH} chars]`;
}

export interface PageIntelligenceInput {
  bookId: string;
  pageNumber: number;
  sourceChecksum: string;
  pageText: string;
}

export async function runPageIntelligenceAgent(
  input: PageIntelligenceInput
): Promise<Record<string, unknown>> {
  const client = getAnthropic();
  const schema = getSchema();
  const prompt = buildPrompt(input, schema);

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL ?? 'claude-3-5-sonnet-latest',
    max_tokens: 4096,
    temperature: 0.2,
    system:
      'You are the Page Intelligence Agent for curriculum reviewers. You produce concise, factual metadata aligned with the provided JSON schema. Always respond with valid JSON only, no additional commentary.',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const textBlocks = response.content
    .filter((item): item is { type: 'text'; text: string } => item.type === 'text')
    .map((item) => item.text);

  if (!textBlocks.length) {
    throw new Error('Claude response did not contain text content.');
  }

  const jsonString = extractJson(textBlocks.join('\n'));
  return parseAgentJson(jsonString, input);
}

function buildPrompt(input: PageIntelligenceInput, schema: string): string {
  const { bookId, pageNumber, pageText, sourceChecksum } = input;
  return `Schema:\n${schema}\n\nInstructions:\n- Output must be valid JSON matching the schema above.\n- Populate every required field. If data not available, use an empty array and include an explanatory note in qa_status.notes.\n- Use concise language. Cite evidence snippets up to 150 characters when possible.\n- Provide confidence scores between 0 and 1.\n- Keep arrays ordered by importance (most relevant first).\n- Do not invent links or resources that are not mentioned in the page text.\n- If standards are unknown, return an empty array and note why in qa_status.notes.\n\nContext:\nBook ID: ${bookId}\nPage Number: ${pageNumber}\nSource Checksum: ${sourceChecksum}\nPage Text:\n"""\n${truncateText(pageText)}\n"""`;
}

function extractJson(content: string): string {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Unable to locate JSON object in Claude response.');
  }
  return content.slice(start, end + 1);
}

function parseAgentJson(
  jsonString: string,
  input: PageIntelligenceInput
): Record<string, unknown> {
  try {
    const parsed = JSON.parse(jsonString) as Record<string, unknown>;
    return {
      ...parsed,
      book_id: input.bookId,
      page_number: input.pageNumber,
      source_checksum: input.sourceChecksum
    };
  } catch (error) {
    throw new Error(`Failed to parse agent JSON: ${error}`);
  }
}
