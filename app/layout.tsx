import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalProvider } from '@/src/context/PortalContext';

export const metadata: Metadata = {
  title: 'Thivanka Randimal | Full-Stack Software Engineer & Creative Developer',
  description:
    'Portfolio and Client Hub for Thivanka Randimal - Senior Full-Stack Engineer, AI Specialist & UI/UX Designer. Explore projects, freelance packages, live portal demos, and technical skills.',
  keywords: [
    'Thivanka Randimal',
    'Full-Stack Developer',
    'Software Engineer',
    'Next.js',
    'React',
    'MongoDB',
    'TypeScript',
    'Portfolio',
    'Fiverr Top Rated',
  ],
  authors: [{ name: 'Thivanka Randimal' }],
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
