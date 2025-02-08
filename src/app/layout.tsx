import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
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

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}