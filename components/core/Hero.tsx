'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const WORDS = ['PaaS', 'Database', 'Headless CMS', 'Media Server', 'Web Backend', 'AI Agent', 'Game Server', 'Personal Cloud'];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsAnimating(true), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
      setIsAnimating(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [isAnimating]);

  return (
    <header className="border-default bg-card w-full border-b">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-10 sm:px-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center justify-center md:items-start md:justify-start">
          <div className="prompt text-fg-muted mb-3 text-xs tracking-widest uppercase">
            self-hosting made simple
          </div>
          <h1 className="glow-text text-fg mb-3 text-3xl font-black tracking-tight sm:text-5xl text-center sm:text-start">
            Can <span className="text-accent"> I </span> host
            <span className="text-fg-muted"> {WORDS[index].startsWith('A') ? 'an' : 'a'} </span>
            <br className="sm:hidden" />{' '}
            <span className="whitespace-nowrap">
              <span
                className={`text-accent inline-block transition-all duration-200 ${
                  isAnimating
                    ? 'scale-95 blur-sm -translate-y-2 opacity-0'
                    : 'scale-100 blur-0 translate-y-0 opacity-100'
                }`}
              >
                {WORDS[index]}
              </span>
              <span className="text-fg-muted">?</span>
            </span>
          </h1>
          <p className="text-fg-muted max-w-xl text-sm text-balance text-center">
            Find the perfect services to run on your host.
          </p>
        </div>
        <div>
          <Link
            href="/builder"
            className="btn-terminal inline-flex items-center gap-2 px-8 py-4 text-[13px] font-bold shadow-lg transition-all text-center text-balance"
          >
            <Zap size={16} /> Build your own server
          </Link>
        </div>
      </div>
    </header>
  );
}
