'use client';

import {
  Cpu,
  FileCode2,
  Globe,
  MemoryStick,
  Package,
  Search,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import ModeToggle from '@/components/hostpicker/ModeToggle';
import { App } from '@/generated/prisma/client';
import { useModeStore } from '@/lib/store';

export default function AppsGrid({ initialApps }: { initialApps: App[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { mode } = useModeStore();

  initialApps.sort((a, b) => a.name.localeCompare(b.name));

  const filteredApps = initialApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-accent border-accent/30 bg-accent/5 rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
              Terminal / Registry
            </span>
          </div>
          <h1 className="glow-text mb-4 text-4xl font-black tracking-tighter uppercase sm:text-5xl">
            Available <span className="text-accent">Apps</span>
          </h1>
          <p className="text-fg-muted border-accent/20 max-w-xl border-l-2 py-1 pl-4 text-xs italic sm:text-sm">
            Browse our curated list of applications supported for hosting. Each
            app includes resource requirements derived from production
            benchmarks.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {/* SEARCH BAR: Styled to match ModeToggle */}
          <div className="border-line-accent bg-card group focus-within:ring-accent/20 flex items-center gap-3 rounded-md border px-4 py-2 transition-all focus-within:ring-1">
            <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-focus-within:opacity-100">
              <Search size={18} className="text-accent" />
              <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                Find
              </span>
            </div>

            <div className="bg-default/30 mx-1 h-8 w-px" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search_apps"
              className="text-fg placeholder:text-fg-dim/40 w-full border-none bg-transparent py-1 font-mono text-xs outline-none md:w-48"
            />
          </div>

          <ModeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="card group relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
          >
            {/* HEADER */}
            <div className="border-default mb-4 flex items-center gap-3 border-b pb-4">
              {app.logoUrl ? (
                <Image
                  src={app.logoUrl}
                  alt={`${app.name} logo`}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <Package size={24} className="text-fg-dim" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-fg group-hover:text-accent truncate text-base font-bold transition-colors">
                  {app.name}
                </h3>
                <p className="text-accent text-[10px] font-bold tracking-widest uppercase opacity-80">
                  {app.category}
                </p>
              </div>

              {app.officialUrl && (
                <a
                  href={app.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-default bg-bg-input text-fg hover:border-accent/40 flex h-8 w-8 items-center justify-center rounded-sm border opacity-50 transition-all hover:opacity-100"
                  title="Visit Official Site"
                >
                  <Globe size={14} />
                </a>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6 flex flex-1 flex-col gap-3">
              <p className="text-fg line-clamp-2 text-xs leading-relaxed">
                {app.description || 'No description available.'}
              </p>
              {app.longDescription && (
                <p className="text-fg-muted text-[11px]">
                  {app.longDescription}
                </p>
              )}
            </div>

            {/* SPECS */}
            {mode === 'expert' && (
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="bg-bg-input border-default group-hover:border-default/80 rounded-sm border p-3 transition-colors">
                  <div className="text-accent/70 mb-2 text-[9px] font-bold tracking-widest uppercase">
                    Minimum
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu size={12} className="text-accent" />
                      <span className="text-fg text-[11px] font-bold">
                        {app.minCPU}{' '}
                        <span className="text-[9px] font-normal opacity-50">
                          Cores
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MemoryStick size={12} className="text-accent" />
                      <span className="text-fg text-[11px] font-bold">
                        {app.minRAM}{' '}
                        <span className="text-[9px] font-normal opacity-50">
                          GB
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-input border-default group-hover:border-default/80 rounded-sm border p-3 transition-colors">
                  <div className="text-accent/70 mb-2 text-[9px] font-bold tracking-widest uppercase">
                    Recommended
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu size={12} className="text-accent" />
                      <span className="text-fg text-[11px] font-bold">
                        {app.recommendedCPU}{' '}
                        <span className="text-[9px] font-normal opacity-50">
                          Cores
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MemoryStick size={12} className="text-accent" />
                      <span className="text-fg text-[11px] font-bold">
                        {app.recommendedRAM}{' '}
                        <span className="text-[9px] font-normal opacity-50">
                          GB
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex gap-2">
              {app.dockerRegistryUrl && (
                <a
                  href={app.dockerRegistryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-bg flex flex-1 items-center justify-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  <FileCode2 size={12} /> Registry
                </a>
              )}
              {app.cubepathUrl && app.isCloudRecommended && (
                <a
                  href={app.cubepathUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-green/40 bg-green/10 text-green hover:bg-green hover:text-bg flex flex-1 items-center justify-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  <Zap size={12} /> Deploy
                </a>
              )}
            </div>

            {/* Decorative Corner Line */}
            <div className="absolute top-0 right-0 h-2 w-2 opacity-20 transition-opacity group-hover:opacity-100">
              <div className="bg-accent absolute top-0 right-0 h-px w-full" />
              <div className="bg-accent absolute top-0 right-0 h-full w-px" />
            </div>
          </div>
        ))}
        {filteredApps.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Package
              size={48}
              className="text-fg-dim mx-auto mb-4 opacity-20"
            />
            <p className="text-fg-muted italic">
              No apps found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </>
  );
}
