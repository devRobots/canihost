'use client';

import { Home, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Builder', href: '/builder', icon: Zap },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default bg-page">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="glow-text text-xl font-black tracking-tight transition-opacity hover:opacity-80"
        >
          Can<span className="text-accent">I</span>Host
          <span className="text-fg-dim">.tech</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-2 rounded-sm px-3 py-2 text-[11px] font-bold tracking-widest uppercase transition-all sm:px-4 ${
                  isActive
                    ? 'bg-accent/10 text-accent border-accent/20 border'
                    : 'text-fg-muted hover:bg-input hover:text-fg border border-transparent'
                }`}
              >
                <Icon
                  size={14}
                  className={`transition-transform group-hover:scale-110 ${
                    isActive ? 'text-accent' : 'text-fg-dim group-hover:text-accent'
                  }`}
                />
                <span className={isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
