import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalProvider } from '@/src/context/PortalContext';
import { BDProvider } from '@/src/context/BDContext';

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
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Thivanka Randimal',
  url: 'https://thivankarandimal.com',
  jobTitle: 'Full-Stack Software Engineer & Creative Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance & Independent Software Engineering',
  },
  sameAs: [
    'https://github.com/thivanka1997',
    'https://www.linkedin.com/in/thivanka-randimal-1a6a68212/',
  ],
  knowsAbout: [
    'Software Engineering',
    'Next.js',
    'React',
    'Node.js',
    'TypeScript',
    'Full Stack Web Development',
    'MongoDB',
    'Tailwind CSS',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0b0d12] text-zinc-100 antialiased selection:bg-[#8B9FFD]/30 selection:text-white min-h-screen w-full max-w-full overflow-x-hidden relative" suppressHydrationWarning>
        <PortalProvider><BDProvider>{children}</BDProvider></PortalProvider>
      </body>
    </html>
  );
}
