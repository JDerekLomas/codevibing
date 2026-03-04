export interface OGData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

// Simple in-memory cache (survives within a single serverless invocation)
const cache = new Map<string, { data: OGData; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function fetchOG(url: string): Promise<OGData | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'bot' },
      signal: AbortSignal.timeout(5000),
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;

    const html = await res.text();

    // Parse OG tags with regex (fast, no dependency needed)
    const getMeta = (property: string): string | undefined => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i'),
        new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, 'i'),
      ];
      for (const pat of patterns) {
        const match = html.match(pat);
        if (match) return match[1];
      }
      return undefined;
    };

    const title = getMeta('og:title') || getMeta('twitter:title') || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description');
    const image = getMeta('og:image') || getMeta('twitter:image');
    const siteName = getMeta('og:site_name');

    if (!title && !description && !image) return null;

    // Resolve relative image URLs
    let resolvedImage = image;
    if (image && !image.startsWith('http')) {
      const base = new URL(url);
      resolvedImage = new URL(image, base.origin).toString();
    }

    const data: OGData = {
      url,
      title: title?.trim(),
      description: description?.trim(),
      image: resolvedImage,
      siteName: siteName?.trim(),
    };

    cache.set(url, { data, ts: Date.now() });
    return data;
  } catch {
    return null;
  }
}
