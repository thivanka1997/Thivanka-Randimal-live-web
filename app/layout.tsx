import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalProvider } from '@/src/context/PortalContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://thivankarandimal.com'),
  title: 'Thivanka Randimal | Full-Stack Software Engineer & Creative Developer',
  description:
    'Official portfolio of Thivanka Randimal - Full-Stack Software Engineer, AI Specialist & UI/UX Designer. Explore software engineering projects, web applications, and professional expertise.',
  keywords: [
    'Thivanka Randimal',
    'Thivanka',
    'Thivanka Randimal Portfolio',
    'Full-Stack Developer Sri Lanka',
    'Software Engineer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'MongoDB Atlas',
    'Web Developer',
    'Fiverr Top Rated',
  ],
  authors: [{ name: 'Thivanka Randimal', url: 'https://thivankarandimal.com' }],
  creator: 'Thivanka Randimal',
  alternates: {
    canonical: 'https://thivankarandimal.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thivankarandimal.com',
    siteName: 'Thivanka Randimal Portfolio',
    title: 'Thivanka Randimal | Full-Stack Software Engineer',
    description:
      'Explore software engineering projects, Next.js web applications, and full-stack solutions by Thivanka Randimal.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thivanka Randimal | Full-Stack Software Engineer',
    description:
      'Explore software engineering projects, Next.js web applications, and full-stack solutions by Thivanka Randimal.',
  },
  verification: {
    google: 'googleb9e16a330f0e8bb1',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0d12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#0b0d12] text-zinc-100 antialiased selection:bg-[#8B9FFD]/30 selection:text-white min-h-screen" suppressHydrationWarning>
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
