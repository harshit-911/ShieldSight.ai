import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShieldSight AI — Protecting Every Click. Protecting Every Family.',
  description:
    'ShieldSight AI uses on-device multimodal AI to help reduce exposure to explicit images, graphic violence, harmful language, and unsafe online interactions while keeping your browsing private.',
  keywords: [
    'ShieldSight AI',
    'Parental Safety Extension',
    'On-Device AI Moderation',
    'Explicit Content Protection',
    'Harmful Language Filter',
    'Privacy First Chrome Extension',
    'Local OCR Moderation',
  ],
  authors: [{ name: 'ShieldSight AI Team' }],
  openGraph: {
    title: 'ShieldSight AI — Protecting Every Click. Protecting Every Family.',
    description:
      'On-device multimodal AI browser extension protecting families from explicit images, violent media, and harmful conversations.',
    url: 'https://shieldsight.ai',
    siteName: 'ShieldSight AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShieldSight AI — Protecting Every Click. Protecting Every Family.',
    description:
      'On-device multimodal AI browser extension protecting families from explicit images, violent media, and harmful conversations.',
    creator: '@ShieldSightAI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} bg-[#0B1220] text-slate-100 antialiased selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
