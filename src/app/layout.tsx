import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: {
    default: 'CodeVibing - Instant React Playground',
    template: '%s | CodeVibing'
  },
  description: 'An instant React playground for running and sharing code. Paste your React components and see them run live in your browser.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'CodeVibing - Instant React Playground',
    description: 'An instant React playground for running and sharing code',
    siteName: 'CodeVibing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeVibing - Instant React Playground',
    description: 'An instant React playground for running and sharing code',
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full bg-gray-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}