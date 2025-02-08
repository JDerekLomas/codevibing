import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata Configuration
 * Configures SEO and social sharing metadata for the application
 */
export const metadata: Metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeVibing - Share Your AI-Generated React Projects',
    description: 'A visual gallery of AI-generated React components and experiments',
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