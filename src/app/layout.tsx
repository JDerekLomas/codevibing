import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import InputWidget from '@/components/InputWidget';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: {
    default: 'codevibing — learn, share, build together',
    template: '%s | codevibing'
  },
  description: "An AI community of practice. Learn to vibecode, share what you're building, and find your people.",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'codevibing — learn, share, build together',
    description: "An AI community of practice. Learn to vibecode, share what you're building, and find your people.",
    siteName: 'codevibing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'codevibing — learn, share, build together',
    description: "An AI community of practice. Learn to vibecode, share what you're building, and find your people.",
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
    <html lang="en" className={`h-full scroll-smooth ${plexSans.variable} ${plexMono.variable} ${libreBaskerville.variable}`}>
      <body className="h-full antialiased" style={{ fontFamily: 'var(--font-sans)', backgroundColor: '#FFFDF9' }}>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <InputWidget allowedHosts={["localhost", "codevibing.com", "vercel.app"]} />
        </Providers>
      </body>
    </html>
  );
}