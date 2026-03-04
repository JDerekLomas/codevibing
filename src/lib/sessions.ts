import type { SessionSummary } from './supabase';

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

export function findSessionForProject(
  project: { title: string },
  sessions: SessionSummary[]
): SessionSummary | null {
  const normalized = normalizeTitle(project.title);
  if (!normalized) return null;

  // Exact normalized match
  const exact = sessions.find(s => normalizeTitle(s.title) === normalized);
  if (exact) return exact;

  // Substring match (session title contains project title or vice versa)
  const substring = sessions.find(s => {
    const sNorm = normalizeTitle(s.title);
    return sNorm.includes(normalized) || normalized.includes(sNorm);
  });
  return substring || null;
}

export function buildSessionMap(
  projects: Array<{ title: string; author?: string }>,
  sessions: SessionSummary[]
): Map<string, SessionSummary> {
  const map = new Map<string, SessionSummary>();
  for (const project of projects) {
    // Filter sessions by author if available
    const authorSessions = project.author
      ? sessions.filter(s => s.author === project.author)
      : sessions;
    const match = findSessionForProject(project, authorSessions);
    if (match) {
      map.set(project.title, match);
    }
  }
  return map;
}
