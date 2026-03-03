import Link from 'next/link';

interface PostItNoteProps {
  text: string;
  href: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
  rotation?: number;
}

const colorMap = {
  yellow: { bg: '#FFF9C4', border: '#F9E547', shadow: 'rgba(249, 229, 71, 0.3)' },
  pink: { bg: '#FCE4EC', border: '#F48FB1', shadow: 'rgba(244, 143, 177, 0.3)' },
  blue: { bg: '#E3F2FD', border: '#90CAF9', shadow: 'rgba(144, 202, 249, 0.3)' },
  green: { bg: '#E8F5E9', border: '#A5D6A7', shadow: 'rgba(165, 214, 167, 0.3)' },
};

export function PostItNote({ text, href, color = 'yellow', rotation = -1 }: PostItNoteProps) {
  const colors = colorMap[color];
  const isExternal = href.startsWith('http');
  const Component = isExternal ? 'a' : Link;
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      href={href}
      {...linkProps}
      className="block p-5 rounded-sm transition-transform hover:scale-105 hover:-rotate-0"
      style={{
        backgroundColor: colors.bg,
        borderLeft: `3px solid ${colors.border}`,
        boxShadow: `2px 3px 8px ${colors.shadow}`,
        transform: `rotate(${rotation}deg)`,
        fontFamily: 'var(--font-sans)',
        maxWidth: '280px',
      }}
    >
      <p className="text-sm leading-relaxed font-medium" style={{ color: '#3E2723' }}>
        {text}
      </p>
      <span
        className="inline-block mt-2 text-xs"
        style={{ color: '#795548', fontFamily: 'var(--font-mono)' }}
      >
        &#8599; {isExternal ? new URL(href).hostname : href}
      </span>
    </Component>
  );
}
