'use client';

import { useState } from 'react';

import { Cpu, FileCode2, Globe, MemoryStick, Package, Search, Zap } from 'lucide-react';
import Image from 'next/image';

import ModeToggle from '@/components/hostpicker/ModeToggle';

interface App {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string | null;
  logoUrl: string;
  officialUrl: string | null;
  cubepathUrl: string | null;
  dockerRegistryUrl: string | null;
  minCPU: number;
  recommendedCPU: number;
  minRAM: number;
  recommendedRAM: number;
  isCloudRecommended: boolean;
}

export default function AppsGrid({ initialApps }: { initialApps: App[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = initialApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-accent/30 bg-accent/5 rounded-sm">
              Terminal / Registry
            </span>
          </div>
          <h1 className="glow-text text-4xl sm:text-5xl font-black tracking-tighter mb-4 uppercase">
            Available <span className="text-accent">Apps</span>
          </h1>
          <p className="text-fg-muted max-w-xl text-xs sm:text-sm border-l-2 border-accent/20 pl-4 py-1 italic">
            Browse our curated list of applications supported for hosting. Each app includes resource requirements derived from production benchmarks.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* SEARCH BAR: Styled to match ModeToggle */}
          <div className="border-line-accent bg-card flex items-center gap-3 rounded-md border px-4 py-2 group focus-within:ring-1 focus-within:ring-accent/20 transition-all">
            <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-focus-within:opacity-100">
              <Search size={18} className="text-accent" />
              <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                Find
              </span>
            </div>
            
            <div className="h-8 w-px bg-default/30 mx-1" />
            
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search_apps --query=..."
              className="bg-transparent border-none text-xs font-mono text-fg placeholder:text-fg-dim/40 outline-none w-full md:w-48 py-1"
            />
          </div>

          <ModeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div key={app.id} className="card group relative flex flex-col p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b border-default pb-4 mb-4">
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
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-fg group-hover:text-accent transition-colors truncate">
                  {app.name}
                </h3>
                <p className="text-[10px] tracking-widest uppercase font-bold text-accent opacity-80">
                  {app.category}
                </p>
              </div>

              {app.officialUrl && (
                <a
                  href={app.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-default bg-bg-input text-fg opacity-50 transition-all hover:opacity-100 hover:border-accent/40"
                  title="Visit Official Site"
                >
                  <Globe size={14} />
                </a>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex-1 flex flex-col gap-3 mb-6">
              <p className="text-xs leading-relaxed text-fg line-clamp-2">
                {app.description || 'No description available.'}
              </p>
              {app.longDescription && (
                <p className="text-[11px] leading-relaxed text-fg-muted italic border-l border-default/30 pl-3">
                  {app.longDescription}
                </p>
              )}
            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-sm p-3 bg-bg-input border border-default group-hover:border-default/80 transition-colors">
                <div className="mb-2 text-[9px] font-bold tracking-widest uppercase text-accent/70">
                  Minimum
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={12} className="text-accent" />
                    <span className="text-[11px] font-bold text-fg">
                      {app.minCPU} <span className="text-[9px] font-normal opacity-50">Cores</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MemoryStick size={12} className="text-accent" />
                    <span className="text-[11px] font-bold text-fg">
                      {app.minRAM} <span className="text-[9px] font-normal opacity-50">GB</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm p-3 bg-bg-input border border-default group-hover:border-default/80 transition-colors">
                <div className="mb-2 text-[9px] font-bold tracking-widest uppercase text-accent/70">
                  Recommended
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={12} className="text-accent" />
                    <span className="text-[11px] font-bold text-fg">
                      {app.recommendedCPU} <span className="text-[9px] font-normal opacity-50">Cores</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MemoryStick size={12} className="text-accent" />
                    <span className="text-[11px] font-bold text-fg">
                      {app.recommendedRAM} <span className="text-[9px] font-normal opacity-50">GB</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex gap-2">
              {app.dockerRegistryUrl && (
                <a
                  href={app.dockerRegistryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent transition-all hover:bg-accent hover:text-bg"
                >
                  <FileCode2 size={12} /> Registry
                </a>
              )}
              {app.cubepathUrl && app.isCloudRecommended && (
                <a
                  href={app.cubepathUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-green/40 bg-green/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green transition-all hover:bg-green hover:text-bg"
                >
                  <Zap size={12} /> Deploy
                </a>
              )}
            </div>

            {/* Decorative Corner Line */}
            <div className="absolute top-0 right-0 w-2 h-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-0 right-0 w-full h-px bg-accent" />
              <div className="absolute top-0 right-0 h-full w-px bg-accent" />
            </div>
          </div>
        ))}
        {filteredApps.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Package size={48} className="mx-auto text-fg-dim mb-4 opacity-20" />
            <p className="text-fg-muted italic">No apps found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </>
  );
}
