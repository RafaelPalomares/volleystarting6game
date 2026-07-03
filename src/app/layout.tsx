import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Starting 6 — Build Your VNL Dream Team',
  description: 'Spin the slot machine, draft real VNL 2026 players, and build the highest-rated volleyball lineup. Can you get S+?',
  keywords: ['volleyball', 'VNL', 'draft', 'game', 'starting 6', 'lineup builder', 'nations league'],
  openGraph: {
    title: 'Starting 6 — Build Your VNL Dream Team',
    description: 'Spin. Draft. Dominate. Build the ultimate volleyball lineup from 300+ real players.',
    type: 'website',
    siteName: 'Starting 6',
    url: 'https://starting6.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starting 6 🏐',
    description: 'Can you build an S+ rated volleyball team? Spin the slot machine and draft your VNL dream lineup.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07080f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - Replace with your real publisher ID */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        {/* Google Analytics - Replace with your GA ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
