import '@/app/globals.css';

import type { Metadata } from 'next';

import Navbar from '@/components/core/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://canihost.tech'),
  title: {
    default: 'CanIHost.tech - Find Perfect Services to Self-Host',
    template: '%s | CanIHost.tech',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
      { url: '/apple-touch-icon-180x180.png', rel: 'apple-touch-icon', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  description:
    'CanIHost helps you discover, manage, and deploy the perfect services for your self-hosted homelab, VPS, or Mini PC setup.',
  keywords: [
    'self-hosting',
    'homelab',
    'docker',
    'docker-compose',
    'vps',
    'mini pc',
    'kubernetes',
    'foss',
    'automation',
    'devRobots',
  ],
  authors: [{ name: 'devRobots', url: 'https://github.com/devRobots' }],
  creator: 'devRobots',
  publisher: 'CanIHost.tech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CanIHost.tech - Find Perfect Services to Self-Host',
    description:
      'Discover the best apps for your self-hosted setup. Generate customized docker-compose configurations instantly.',
    url: 'https://canihost.tech',
    siteName: 'CanIHost.tech',
    images: [
      {
        url: '/resources/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CanIHost.tech Open Graph Image',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CanIHost.tech - Host Your Own Apps',
    description:
      'Discover, manage, and deploy the perfect services for your self-hosted homelab, VPS, or Mini PC setup.',
    creator: '@devRobots',
    images: ['/resources/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body className="scanlines flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>

        {/* FOOTER */}
        <footer className="border-line-accent/30 bg-card/30 text-fg-dim relative z-10 flex w-full items-center justify-center border-t py-6 font-mono text-[10px] tracking-widest uppercase backdrop-blur-sm sm:text-xs">
          <div className="flex items-center">
            Made with <span className="text-accent mx-2 font-bold">code</span>{' '}
            by
            <a
              href="https://github.com/devRobots"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent group relative ml-2 font-bold transition-all duration-300"
            >
              devRobots
              <span className="bg-accent absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
