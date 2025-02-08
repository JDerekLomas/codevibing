import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata Configuration
 * Configures SEO and social sharing metadata for the application
 * Uses the metadataBase to ensure consistent URL generation
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://codevibing-etjtwbhaq-derek-lomas-projects.vercel.app'),
  title: {
    default: 'CodeVibing - Share Your AI-Generated React Projects',
    template: '%s | CodeVibing'
  },
  description: 'A visual gallery of AI-generated React components and experiments. Share and explore creative coding with AI assistance.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'CodeVibing - Share Your AI-Generated React Projects',
    description: 'A visual gallery of AI-generated React components and experiments',
    siteName: 'CodeVibing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeVibing - AI-Generated React Components'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeVibing - Share Your AI-Generated React Projects',
    description: 'A visual gallery of AI-generated React components and experiments',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout Component
 * 
 * Provides the base HTML structure and applies global styles
 * Features:
 * - Implements Inter font for clean typography
 * - Sets HTML language for accessibility
 * - Maintains full height layout
 * - Applies consistent background color
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}