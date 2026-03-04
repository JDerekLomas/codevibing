'use client';

interface LinkifyTextProps {
  text: string;
  className?: string;
}

export function LinkifyText({ text, className }: LinkifyTextProps) {
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith('http') ? part : `https://${part}`;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:underline"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
