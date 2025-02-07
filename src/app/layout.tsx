import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeVibing - Share Your AI-Generated React Projects',
  description: 'A visual gallery of AI-generated React components and experiments. Share and explore creative coding with AI assistance.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'CodeVibing - Share Your AI-Generated React Projects',
    description: 'A visual gallery of AI-generated React components and experiments',
    url: 'https://codevibing.com',
    siteName: 'CodeVibing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeVibing - Share Your AI-Generated React Projects',
    description: 'A visual gallery of AI-generated React components and experiments',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>{children}</body>
    </html>
  );
}