import '@/app/globals.css';

import type { Metadata } from 'next';

import Navbar from '@/components/core/Navbar';

export const metadata: Metadata = {
  title: 'CanIHost.tech',
  description: 'Check what services can run on your host',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
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
