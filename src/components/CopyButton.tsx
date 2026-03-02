'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-xs font-bold transition-colors"
      style={{
        backgroundColor: copied ? '#3D46C2' : '#FFFFFF',
        color: copied ? '#FFFFFF' : '#3D46C2',
        border: '2px solid #3D46C2',
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}
