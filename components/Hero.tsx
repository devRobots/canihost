'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <header className="w-full border-b border-default bg-card">
      <div className="container mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest mb-3 prompt text-fg-muted">
            self-hosting made simple
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight glow-text mb-3 text-fg">
            Can<span className="text-accent">I</span>Host
            <span className="text-fg-muted">.tech</span>
          </h1>
          <p className="text-sm max-w-xl text-fg-muted">
            Find the perfect services to run on your Machine or VPS.
          </p>
        </div>
        <div>
          <Link
            href="/builder"
            className="inline-block text-[13px] font-bold px-8 py-4 shadow-lg btn-terminal transition-all"
          >
            ⚡ Build your own server
          </Link>
        </div>
      </div>
    </header>
  );
}
