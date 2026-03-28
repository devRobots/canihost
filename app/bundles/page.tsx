import { Layers, Package, Zap } from 'lucide-react';
import Image from 'next/image';

import prisma from '@/lib/prisma';

export default async function BundlesPage() {
  const bundles = await prisma.appBundle.findMany({
    include: { apps: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="bg-page flex min-h-screen flex-col font-mono">
      <div className="container mx-auto px-4 py-12 sm:px-8">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent text-sm font-bold uppercase tracking-widest px-2 py-0.5 border border-accent/30 bg-accent/5 rounded-sm">
              Collection / Bundle
            </span>
          </div>
          <h1 className="glow-text text-4xl sm:text-5xl font-black tracking-tighter mb-4">
            Curated <span className="text-accent">Bundles</span>
          </h1>
          <p className="text-fg-muted max-w-2xl text-sm sm:text-base border-l-2 border-accent/20 pl-4 py-1 italic">
            Speed up your setup with curated app bundles. These are pre-selected groups of tools that work well together, from full-stack dev environments to media servers.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="card group relative flex flex-col p-8 bg-card/50 overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-3xl rounded-full -mr-24 -mt-24 pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-bg-input border border-default rounded flex items-center justify-center group-hover:border-accent/40 transition-colors">
                      <Layers size={24} className="text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-fg mb-1">
                        {bundle.name}
                      </h2>
                      <span className="text-[10px] text-fg-dim font-bold uppercase tracking-widest border border-default/50 px-2 py-0.5 rounded-full">
                        {bundle.apps.length} Apps Included
                      </span>
                    </div>
                  </div>
                  <div className="p-2 border border-accent/20 bg-accent/5 text-accent rounded opacity-40 group-hover:opacity-100 transition-opacity">
                    <Zap size={16} />
                  </div>
                </div>

                <p className="text-sm text-fg-muted mb-4 border-l-2 border-default/30 pl-4 max-w-xl">
                  {bundle.description || "A curated selection of applications optimized for efficiency and interoperability."}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-fg-muted font-bold uppercase tracking-widest">
                      Installed Apps:
                    </span>
                    <div className="divider-line h-px bg-default/20" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bundle.apps.map((app) => (
                      <div key={app.id} className="flex items-center gap-3 p-3 bg-bg-input/30 border border-default/40 rounded hover:bg-bg-input hover:border-accent/30 transition-all group/app group cursor-default">
                        <div className="relative w-8 h-8 flex items-center justify-center p-1.5 bg-bg-card rounded shadow-sm group-hover/app:shadow-accent/10 transition-shadow">
                          {app.logoUrl ? (
                            <Image 
                              src={app.logoUrl} 
                              alt={app.name} 
                              width={24} 
                              height={24} 
                              className="object-contain filter grayscale group-hover/app:grayscale-0 transition-all"
                            />
                          ) : (
                            <Package size={14} className="text-fg-dim" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-fg-muted group-hover/app:text-fg transition-colors truncate">
                          {app.name}
                        </span>
                      </div>
                    ))}
                    {bundle.apps.length === 0 && (
                      <div className="col-span-full py-4 text-center text-xs text-fg-dim border border-dashed border-default/40 rounded italic">
                        No apps in this bundle yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-default/20 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-fg-dim uppercase font-bold tracking-widest">Est. Min CPU</span>
                      <span className="text-sm font-mono text-fg">{bundle.apps.reduce((acc, app) => acc + app.minCPU, 0)} Cores</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-fg-dim uppercase font-bold tracking-widest">Est. Min RAM</span>
                      <span className="text-sm font-mono text-fg">{bundle.apps.reduce((acc, app) => acc + app.minRAM, 0)} GB</span>
                    </div>
                  </div>
                  
                  <button className="px-5 py-2 btn-terminal text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-accent ring-1 ring-accent ring-offset-2 ring-offset-bg group-hover:ring-offset-bg transition-all">
                    View Details
                  </button>
                </div>
              </div>

              {/* Decorative Corner Line */}
              <div className="absolute top-0 right-0 w-2 h-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-full h-px bg-accent" />
                <div className="absolute top-0 right-0 h-full w-px bg-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
