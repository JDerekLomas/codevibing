import type { Metadata } from 'next';
import { getProfile } from '@/lib/supabase';

interface Props {
  params: { username: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getProfile(params.username);
  const displayName = profile?.display_name || params.username;
  const bio = profile?.bio || '';
  const title = `@${params.username} on codevibing`;
  const description = bio || `${displayName}'s profile on codevibing`;

  const ogParams = new URLSearchParams({
    type: 'profile',
    username: params.username,
    ...(bio && { bio: bio.slice(0, 120) }),
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [{ url: `/api/og/image?${ogParams}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/image?${ogParams}`],
    },
  };
}

export default function ProfileLayout({ children }: Props) {
  return children;
}
