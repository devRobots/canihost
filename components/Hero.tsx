'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <header className="border-default bg-card w-full border-b">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="prompt text-fg-muted mb-3 text-xs tracking-widest uppercase">
            self-hosting made simple
          </div>
          <h1 className="glow-text text-fg mb-3 text-3xl font-black tracking-tight sm:text-5xl">
            Can<span className="text-accent">I</span>Host
            <span className="text-fg-muted">.tech</span>
          </h1>
          <p className="text-fg-muted max-w-xl text-sm">
            Find the perfect services to run on your host.
          </p>
        </div>
        <div>
          <Link
            href="/builder"
            className="btn-terminal inline-block px-8 py-4 text-[13px] font-bold shadow-lg transition-all"
          >
            ⚡ Build your own server
          </Link>
        </div>
      </div>
    </header>
  );
}
