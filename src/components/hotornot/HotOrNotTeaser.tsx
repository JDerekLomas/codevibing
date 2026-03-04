import Link from 'next/link';
import { getRandomProjects, getProjectCount } from '@/lib/supabase';

export default async function HotOrNotTeaser(): Promise<JSX.Element | null> {
  const count = await getProjectCount();
  if (count < 3) return null;

  const projects = await getRandomProjects(3);
  if (projects.length < 3) return null;

  return (
    <section className="pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Hot or Not
        </h2>
        <Link
          href="/hotornot/trending"
          className="text-xs hover:underline"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
        >
          See rankings &rarr;
        </Link>
      </div>

      <Link
        href="/hotornot"
        className="block rounded-xl border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 group"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        {/* Fanned cards */}
        <div className="flex justify-center items-center mb-5 h-32 relative">
          {projects.map((project, i) => {
            const rotation = (i - 1) * 8;
            const translateX = (i - 1) * 30;
            return (
              <div
                key={project.id}
                className="absolute w-28 h-36 rounded-lg border overflow-hidden transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'var(--color-warm-border)',
                  transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
                  zIndex: i === 1 ? 3 : i === 2 ? 2 : 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {project.preview ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.preview})` }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-2"
                    style={{ background: 'linear-gradient(135deg, #F5F0EB, #E8E2DA)' }}
                  >
                    <span className="text-[10px] text-center leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>
                      {project.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Rate vibecoded projects
          </p>
          <span
            className="inline-block text-xs px-4 py-2 rounded-full transition-colors"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Start swiping &rarr;
          </span>
        </div>
      </Link>
    </section>
  );
}
